import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db, TABLE, ScanCommand, QueryCommand, PutCommand, GetCommand } from '@/lib/dynamodb';
import { logAction } from '@/lib/audit';
import { canCreateTask, isTaskVisible, canAssignToMember, canAssignToScope } from '@/lib/permissions';
import { autoCloseIfExpired } from '@/lib/tasks';
import { isDeadlinePassed } from '@/lib/utils';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const myTasks = searchParams.get('my') === 'true';

    if (status !== null && !['OPEN', 'CLOSED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // A status filter can go straight to the StatusCreatedIndex GSI instead of
    // scanning the whole table — cheaper and it comes back pre-sorted.
    const tasksResult = status
      ? await db.send(new QueryCommand({
          TableName: TABLE.TASKS,
          IndexName: 'StatusCreatedIndex',
          KeyConditionExpression: '#s = :status',
          ExpressionAttributeNames: { '#s': 'status' },
          ExpressionAttributeValues: { ':status': status },
          ScanIndexForward: false,
        }))
      : await db.send(new ScanCommand({ TableName: TABLE.TASKS }));

    let tasks = tasksResult.Items || [];

    // Lazily flip any OPEN task whose deadline has passed to CLOSED — no
    // cron/Lambda needed, the status just self-corrects on the next read.
    // Skipped entirely when status=CLOSED was requested (nothing OPEN in that set).
    if (status !== 'CLOSED') {
      await Promise.all(
        tasks
          .filter((t: any) => t.status === 'OPEN' && isDeadlinePassed(t.deadline))
          .map(async (t: any) => { t.status = await autoCloseIfExpired(t); })
      );
    }

    tasks = tasks.filter((task: any) => isTaskVisible(user, task));

    // If autoClose flipped some tasks to CLOSED above and the caller asked for
    // status=OPEN, those no longer belong in the result.
    if (status) tasks = tasks.filter((t: any) => t.status === status);
    if (myTasks) tasks = tasks.filter((t: any) => t.assignedToId === user.memberId || t.assignmentType === 'GENERAL');

    tasks.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canCreateTask(user)) {
    return NextResponse.json({ error: 'Unauthorized to create tasks' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, description, deadline, assignmentType, assignedToId, domain, subdomain, priority } = body;

    if (!title || !description || !deadline || !assignmentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (priority !== undefined && !['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
      return NextResponse.json({ error: 'Invalid priority value' }, { status: 400 });
    }

    // assignedToName is always derived server-side; never trusted from the client.
    let resolvedAssignedToName = 'Everyone';

    if (assignmentType === 'INDIVIDUAL') {
      if (!assignedToId) return NextResponse.json({ error: 'Missing target member' }, { status: 400 });
      const targetResult = await db.send(new GetCommand({ TableName: TABLE.MEMBERS, Key: { memberId: assignedToId } }));
      if (!targetResult.Item) return NextResponse.json({ error: 'Target member not found' }, { status: 404 });
      if (!canAssignToMember(user, targetResult.Item as any)) {
        return NextResponse.json({ error: 'You are not allowed to assign tasks to this member' }, { status: 403 });
      }
      resolvedAssignedToName = targetResult.Item.name;
    } else if (assignmentType === 'DOMAIN' || assignmentType === 'SUBDOMAIN') {
      if (!domain || (assignmentType === 'SUBDOMAIN' && !subdomain)) {
        return NextResponse.json({ error: 'Missing domain/subdomain' }, { status: 400 });
      }
      if (!canAssignToScope(user, assignmentType, domain, subdomain)) {
        return NextResponse.json({ error: 'You are not allowed to assign tasks to this scope' }, { status: 403 });
      }
      resolvedAssignedToName = assignmentType === 'SUBDOMAIN' ? subdomain : domain;
    } else if (assignmentType === 'GENERAL') {
      if (!canAssignToScope(user, 'GENERAL')) {
        return NextResponse.json({ error: 'Only the presidium can assign org-wide tasks' }, { status: 403 });
      }
    }

    const taskId = randomUUID();
    const task = {
      taskId,
      title,
      description,
      deadline,
      priority: priority || 'MEDIUM',
      assignmentType,
      assignedToId: assignedToId || undefined,
      assignedToName: resolvedAssignedToName,
      domain: domain || undefined,
      subdomain: subdomain || undefined,
      createdBy: user.memberId,
      createdByName: user.name,
      createdAt: new Date().toISOString(),
      status: 'OPEN',
      totalSubmissions: 0,
    };

    await db.send(new PutCommand({ TableName: TABLE.TASKS, Item: task }));
    await logAction(user, 'CREATE_TASK', 'TASK', taskId, `Created task: ${title}`);

    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

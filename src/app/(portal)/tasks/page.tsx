import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getVisibleTasksForUser } from '@/lib/tasks';
import TasksClient from './TasksClient';

export default async function TasksPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const tasks = await getVisibleTasksForUser(user);

  return <TasksClient initialTasks={tasks} />;
}

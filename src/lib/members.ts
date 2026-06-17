import { db, TABLE, ScanCommand } from '@/lib/dynamodb';
import type { Member } from '@/types';

// Mirrors the default (no domain/role/search/all params) branch of
// GET /api/members — used by the members list Server Component for the
// initial render. Keep in sync if the route's base query logic changes.
export async function getActiveMembers(): Promise<Member[]> {
  const result = await db.send(new ScanCommand({ TableName: TABLE.MEMBERS }));
  const members = (result.Items || []).filter((m: any) => m.isActive !== false) as Member[];
  members.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  return members;
}

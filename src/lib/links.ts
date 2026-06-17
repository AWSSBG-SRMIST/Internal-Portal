import { db, TABLE, ScanCommand } from '@/lib/dynamodb';
import type { ShortLink } from '@/types';

// Mirrors GET /api/links — used by the links list Server Component for the
// initial render. Keep in sync if the route's logic changes.
export async function getLinks(): Promise<ShortLink[]> {
  const result = await db.send(new ScanCommand({ TableName: TABLE.LINKS }));
  const links = (result.Items || []) as ShortLink[];
  links.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return links;
}

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { isPresidium } from '@/lib/permissions';
import { getAuditLogs } from '@/lib/audit';
import AuditLogsClient from './AuditLogsClient';

export default async function AuditLogsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!isPresidium(user)) redirect('/dashboard');

  const logs = await getAuditLogs(200);

  return <AuditLogsClient initialLogs={logs} />;
}

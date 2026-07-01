import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '/dashboard';
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  return <Sidebar user={user}>{children}</Sidebar>;
}

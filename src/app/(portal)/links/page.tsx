import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { canUseLinkShortener } from '@/lib/permissions';
import { getLinks } from '@/lib/links';
import LinksClient from './LinksClient';

export default async function LinksPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const links = canUseLinkShortener(user) ? await getLinks() : [];

  return <LinksClient me={user} initialLinks={links} />;
}

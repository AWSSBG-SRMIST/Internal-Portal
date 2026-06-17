import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { SwaggerUIClient } from './SwaggerUIClient';

export default async function ApiDocsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return <SwaggerUIClient />;
}

// SERVER component
import { cookies } from 'next/headers';
import DashboardPageClient from './_client';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const id = cookieStore.get('mxtk_home_id')?.value || 'default';
  return <DashboardPageClient initialDocId={id} />;
}
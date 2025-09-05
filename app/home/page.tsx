import HomeView from '@/components/home/HomeView'
import { cookies } from 'next/headers'

export default async function Page() {
  const c = cookies()
  const id = c.get('mxtk_home_id')?.value || null
  return <HomeView id={id} />
}



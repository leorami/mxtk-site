import { redirect } from 'next/navigation';

export default function GuidePage() {
  // Redirect to /journey where the Guide is now docked
  redirect('/journey');
}

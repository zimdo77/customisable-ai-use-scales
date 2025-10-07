// Redirect to either /home or /login
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import LoginPage from './login/page';

export default async function Home() {
  const supabase = await createClient();

  // Get the current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If logged in, redirect to "my rubrics"
  if (session?.user) {
    redirect('/my-rubrics');
  }
  return <LoginPage />;
}

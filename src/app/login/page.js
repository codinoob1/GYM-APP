import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import Loginpage from '@/components/landing/Loginpage';

export default async function LoginRoute() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    if (user.user_metadata?.onboarding_completed) {
      redirect('/');
    } else {
      redirect('/onboarding');
    }
  }
  
  

  return <Loginpage />;
}

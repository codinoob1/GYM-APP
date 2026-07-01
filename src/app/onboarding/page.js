import { redirect } from 'next/navigation';
import Onbordflow from '@/components/onBord/Onbordflow';
import { WorkoutProvider } from '@/lib/WorkoutContext';
import { createClient } from '@/lib/supabaseServer';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/login?next=/onboarding`);
  }
  else if (user.user_metadata?.onboarding_completed) {
    redirect(`/dashboard`);
  }

  return (
    <WorkoutProvider>
      <Onbordflow />
    </WorkoutProvider>
  );
}

import { createClient } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: plan, error: planErr } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const { data: logs, error: logsErr } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (profileErr || planErr || logsErr) {
      console.error('user-data fetch errors', { profileErr, planErr, logsErr });
      // still return what we have, but signal partial failure
    }

    return new Response(
      JSON.stringify({ user, profile: profile ?? null, plan: plan ?? null, logs: logs ?? [] }),
      
    );
  } catch (error) {
    console.error('user-data route error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

import { createClient } from '@/lib/supabaseServer';

export async function POST(req) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { profile, parsedPlan, rawText } = body;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    const profileData = profile ?? {};
    const { photoPreview, ...profilePayload } = profileData;

    // Upsert profile
    const { error: profileErr } = await supabase.from('profiles').upsert({
      ...profilePayload,
      id: user.id,
      photo_url: profilePayload.photo_url || profilePayload.photoPreview || '',
    });
    // Upsert workout plan
    const { error: planErr } = await supabase.from('workout_plans').upsert({
      user_id: user.id,
      raw_text: rawText || '',
      parsed_json: parsedPlan,
    });

    // Mark onboarding complete on the user metadata (best-effort)
    try {
      await supabase.auth.updateUser({ data: { onboarding_completed: true } });
    } catch (e) {
      // non-fatal
      console.error('Failed to update user metadata:', e);
    }

    if (profileErr || planErr) {
      const message = { profileErr: profileErr?.message || null, planErr: planErr?.message || null };
      return new Response(JSON.stringify({ error: 'Upsert failed', details: message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Onboarding route error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

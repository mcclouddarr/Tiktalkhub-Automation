import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useSupabaseAuth() {
  const [session, setSession] = useState<ReturnType<typeof supabase.auth.getSession> extends Promise<infer T> ? T extends { data: { session: infer S } } ? S | null : null : null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session);
        setLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  }, []);

  const signOut = useCallback(async () => {
    return supabase.auth.signOut();
  }, []);

  const signInAnonymously = useCallback(async () => {
    // Use Supabase "Sign in with OTP (anonymous)" via generate/verify if needed, or create a service key flow.
    // For now, we use a one-off email-less sign-in pattern using a random identifier stored locally.
    // Placeholder: this can be replaced with a secure service-triggered magic link or SSO.
    const { data, error } = await supabase.auth.signInAnonymously();
    return { data, error };
  }, []);

  return { session, loading, signInWithEmail, signUpWithEmail, signOut, signInAnonymously };
}
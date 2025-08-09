import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://hcngpvqnsrftuntnnwye.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbmdwdnFuc3JmdHVudG5ud3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDcxODgsImV4cCI6MjA3MDMyMzE4OH0.8YapZAoBZqt-mKJHMB34HMbQ00DA4qGUsBO8hOp1Kws";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
import { supabase } from "@/lib/supabaseClient";

export async function uploadCookieBlob(personaId: string, file: File) {
  const path = `${personaId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from("cookies").upload(path, file, {
    upsert: false,
    contentType: file.type || "application/json",
  });
  return { data, error, path };
}

export async function listCookieFiles(personaId?: string) {
  const prefix = personaId ? `${personaId}` : undefined;
  const { data, error } = await supabase.storage.from("cookies").list(prefix, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
  return { data, error };
}

export function getPublicFileUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
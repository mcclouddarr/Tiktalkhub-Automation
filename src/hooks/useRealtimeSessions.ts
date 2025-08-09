import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export type RealtimeCallback = (payload: any) => void;

export function useRealtimeSessions(callback: RealtimeCallback) {
  useEffect(() => {
    const channel = supabase
      .channel("public:sessions")
      .on("postgres_changes", { event: "*", schema: "public", table: "sessions" }, (payload) => {
        callback(payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [callback]);
}
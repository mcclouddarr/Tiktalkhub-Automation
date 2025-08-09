import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { session, loading } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate("/auth", { replace: true });
    }
  }, [loading, session, navigate]);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (!session) return null;
  return <>{children}</>;
}
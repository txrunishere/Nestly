import { clerkSupabaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/expo";
import { useMemo } from "react";

export const useSupabase = () => {
  const { getToken } = useAuth();

  const client = useMemo(
    () => clerkSupabaseClient(() => getToken()),
    [getToken],
  );

  return client;
};

import { useUserStore } from "@/store/user.store";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { useSupabase } from "./useSupabase";

export const useUserSync = () => {
  const { user } = useUser();
  const setIsAdmin = useUserStore((state) => state.setIsAdmin);
  const supabase = useSupabase();

  useEffect(() => {
    if (!user) return;
    syncUser();
  }, [user]);

  async function syncUser() {
    if (!user || !user.id) {
      setIsAdmin(false);
      return;
    }

    // 1. Try to find user in Supabase
    const { data: supabaseUser } = await supabase
      .from("users")
      .select("clerk_id,is_admin")
      .eq("clerk_id", user.id)
      .single();

    if (supabaseUser && typeof supabaseUser.is_admin !== "undefined") {
      setIsAdmin(!!supabaseUser.is_admin);
      return;
    }

    // 2. Insert user if not found
    // Defensive: check for required user fields
    const email =
      Array.isArray(user.emailAddresses) && user.emailAddresses[0]?.emailAddress
        ? user.emailAddresses[0].emailAddress
        : null;

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        first_name: user.firstName ?? null,
        last_name: user.lastName ?? null,
        email,
        clerk_id: user.id,
        avatar_url: user.imageUrl ?? null,
      })
      .select("is_admin")
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      setIsAdmin(false);
      return;
    }

    setIsAdmin(newUser?.is_admin ?? false);
  }
};

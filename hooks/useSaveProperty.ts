import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { useSupabase } from "./useSupabase";

export const useSaveProperty = (propertyId: string, onUnsave?: () => void) => {
  const { userId } = useAuth();
  const supabase = useSupabase();

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  async function checkIsSaved() {
    if (!userId) return;

    const { data } = await supabase
      .from("saved_properties")
      .select("id")
      .eq("user_clerk_id", userId)
      .eq("property_id", propertyId)
      .maybeSingle();

    setIsSaved(!!data);
  }

  useEffect(() => {
    checkIsSaved();
  }, [propertyId, userId]);

  async function toggleSave() {
    if (!userId || saveLoading) return;
    setSaveLoading(true);

    try {
      if (isSaved) {
        const { error } = await supabase
          .from("saved_properties")
          .delete()
          .eq("user_clerk_id", userId)
          .eq("property_id", propertyId);
        if (error) throw error;
        setIsSaved(false);
        onUnsave?.();
      } else {
        const { error } = await supabase.from("saved_properties").insert({
          property_id: propertyId,
          user_clerk_id: userId,
        });
        if (error) throw error;
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Toggle property save error:", error);
    } finally {
      setSaveLoading(false);
    }
  }

  return {
    isSaved,
    saveLoading,
    toggleSave,
  };
};

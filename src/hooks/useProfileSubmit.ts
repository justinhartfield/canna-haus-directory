
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileFormValues } from "@/types/profile";
import { User } from "@supabase/supabase-js";

export const useProfileSubmit = (user: User | null) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: data.fullName,
          username: data.username,
          website: data.website,
          avatar_url: data.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      
      if (profileError) throw profileError;
      
      // Update settings
      const { error: settingsError } = await supabase
        .from("user_settings")
        .update({
          theme: data.theme,
          newsletter_subscription: data.newsletterSubscription,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      
      if (settingsError) throw settingsError;
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, handleSubmit };
};

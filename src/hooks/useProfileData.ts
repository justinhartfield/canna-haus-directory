
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileFormValues } from "@/types/profile";
import { User } from "@supabase/supabase-js";

export const useProfileData = (user: User | null, onDataLoaded: (data: ProfileFormValues) => void) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        
        if (profileError) throw profileError;
        
        // Fetch user settings
        const { data: settingsData, error: settingsError } = await supabase
          .from("user_settings")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        
        if (settingsError) throw settingsError;
        
        // Prepare form data with default values if data is null
        const formData: ProfileFormValues = {
          fullName: profileData?.full_name || "",
          username: profileData?.username || "",
          website: profileData?.website || "",
          avatarUrl: profileData?.avatar_url || "",
          theme: settingsData?.theme || "light",
          newsletterSubscription: settingsData?.newsletter_subscription || false,
        };
        
        onDataLoaded(formData);
      } catch (error: any) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load profile data");
        
        // Even on error, load default data
        const defaultData: ProfileFormValues = {
          fullName: "",
          username: "",
          website: "",
          avatarUrl: "",
          theme: "light",
          newsletterSubscription: false,
        };
        
        onDataLoaded(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user, onDataLoaded]);

  return { isLoading };
};

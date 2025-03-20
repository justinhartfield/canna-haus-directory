
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { ProfileFormValues } from "@/types/profile";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileInfoFields } from "@/components/profile/ProfileInfoFields";
import { ProfilePreferences } from "@/components/profile/ProfilePreferences";
import { ProfileSubmitButton } from "@/components/profile/ProfileSubmitButton";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileSubmit } from "@/hooks/useProfileSubmit";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: "",
      username: "",
      website: "",
      avatarUrl: "",
      theme: "light",
      newsletterSubscription: false,
    },
  });

  const handleFormReset = (data: ProfileFormValues) => {
    form.reset(data);
  };

  const { isLoading } = useProfileData(user, handleFormReset);
  const { isSaving, handleSubmit } = useProfileSubmit(user);

  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-4">
            <ProfileAvatar 
              avatarUrl={form.watch("avatarUrl")} 
              fullName={form.watch("fullName")} 
              size="lg"
            />
            <div>
              <CardTitle className="text-2xl">Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <ProfileInfoFields control={form.control} />
                <ProfilePreferences control={form.control} />
              </div>
              
              <ProfileSubmitButton isSaving={isSaving} />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

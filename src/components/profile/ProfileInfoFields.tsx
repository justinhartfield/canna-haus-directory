
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ProfileFormValues } from "@/types/profile";

interface ProfileInfoFieldsProps {
  control: Control<ProfileFormValues>;
}

export const ProfileInfoFields = ({ control }: ProfileInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="johndoe" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="avatarUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Avatar URL</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/avatar.jpg" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

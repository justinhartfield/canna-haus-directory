
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";
import { ProfileFormValues } from "@/types/profile";

interface ProfilePreferencesProps {
  control: Control<ProfileFormValues>;
}

export const ProfilePreferences = ({ control }: ProfilePreferencesProps) => {
  return (
    <>
      <FormField
        control={control}
        name="theme"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Theme Preference</FormLabel>
            <FormControl>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={field.value}
                onChange={field.onChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="newsletterSubscription"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Subscribe to newsletter
              </FormLabel>
              <FormDescription>
                Receive updates and announcements via email
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

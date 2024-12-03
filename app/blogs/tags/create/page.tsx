"use client";

import React, { useState } from "react";

// COMPONENT
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// API SERVICE
import { createTagService, getAllTagsService } from "@/services/tagServices";

// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";
import MultipleSelector from "@/components/ui/multiple-selector";
import useSWR from "swr";

const tagSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: "Tag name must be at least 3 characters" })
    .max(50, { message: "Tag name cannot exceed 50 characters" }),
});

// CATEGORY SCHEMA
const newTagSchema = z.object({
  // SCHEMA FOR TITLE VALIDATION
  tags: z
    .array(tagSchema)
    .min(1, { message: "Input tag with minimun 1 tag" })
    .max(5, { message: "Input tag with maximum 5 tag" }),
});

export default function CreateCategoryPage() {
  // TOAST
  const { toast } = useToast();

  // LOADING BUTTON
  const [loading, setLoading] = useState(false);

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // ERROR HANDLER
  const [error, setError] = useState<string | null>(null);

  // FORM HANDLER
  const defaultValues = {
    tags: undefined,
  };
  const form = useForm<z.infer<typeof newTagSchema>>({
    resolver: zodResolver(newTagSchema),
    defaultValues,
    shouldFocusError: false,
    mode: "all",
  });

  // SUBMIT FORM BUTTON
  const handleSubmitButtonClick = () => {
    setShowConfirmDialog(true);
  };

  // FUNC CONFIRM CREATE AFTER ALERT DIALOG
  const handleConfirmSubmit = () => {
    form.handleSubmit(onSubmit)();
    setShowConfirmDialog(false);
  };

  // CANCEL BUTTON
  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
  };

  // HANDLING SUBMIT FORM
  const onSubmit = async (values: z.infer<typeof newTagSchema>) => {
    try {
      setLoading(true);
      setError(null);

      // SEND TO API
      const result = await createTagService(values);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        action: <ToastClose />,
        duration: 4000,
      });

      // RESET FORM
      form.setValue("tags", []);
    } catch (error: any) {
      // ERROR HANDLER
      const errorMessage =
        error?.response?.data?.message || "An error occurred";

      // TOAST MESSAGE FROM API
      toast({
        description: errorMessage,
        variant: "destructive",
        action: <ToastClose />,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetcher = () => getAllTagsService();

  const { data: tags, error: tagsError, isLoading } = useSWR("/tag", fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (tagsError) return <p>Error loading data tags</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create A New Tag for Blogs</CardTitle>
        <CardDescription>
          Create a tag to classify your blog posts effectively. Tags help
          readers discover content based on specific topics or themes. Choose a
          name that is short, relevant, and easy to understand.
        </CardDescription>
        <Separator />
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            {/* CATEGORY NAME */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag Name</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      {...field}
                      value={form.watch("tags")}
                      defaultOptions={tags}
                      placeholder="Input tag or Create a new tag"
                      hidePlaceholderWhenSelected
                      creatable
                      emptyIndicator={
                        <p className="text-center leading-6 text-gray-600 dark:text-gray-400">
                          No results found
                        </p>
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a name for the tag. Use 3-50 characters and ensure
                    it accurately reflects the topic or theme it represents.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SUBMIT */}
            <LoadingButton
              loading={loading}
              type="button"
              onClick={handleSubmitButtonClick}
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              Submit
            </LoadingButton>

            <AlertDialog
              open={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Create Tag</AlertDialogTitle>
                  <AlertDialogDescription>
                    Once the tag is created, it can be used to group blog posts
                    by similar topics. You can edit or delete tags later if
                    needed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleConfirmCancel}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmSubmit}>
                    Confirm Create
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useState } from "react";

// COMPONENT
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { ChevronLeft, CloudUpload } from "lucide-react";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// API SERVICE
import { createTagService, getAllTagsService } from "@/services/tagServices";
import useSWR from "swr";

// TOAST
import { useToast } from "@/hooks/use-toast";

// MODELS
import { ApiErrorResponse } from "@/models/error";
import { newTagSchema } from "@/models/formSchema";

// ROUTING
import { useRouter } from "next/navigation";

export default function CreateTagPage() {
  // ROUTER
  const router = useRouter();

  // TOAST
  const { toast } = useToast();

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // FORM HANDLER
  const defaultValues = {
    tags: undefined,
  };

  const form = useForm<z.infer<typeof newTagSchema>>({
    resolver: zodResolver(newTagSchema),
    defaultValues,
    shouldFocusError: false,
    mode: "onChange",
  });

  // SUBMIT FORM BUTTON
  const handleSubmitButtonClick = () => {
    setShowConfirmDialog(true);
  };

  // CONFIRM BUTTON AFTER ALERT DIALOG
  const handleConfirmSubmit = () => {
    form.handleSubmit(onSubmit)();
    setShowConfirmDialog(false);
  };

  // CANCEL BUTTON ALERT DIALOG
  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
  };

  // HANDLING SUBMIT FORM
  const onSubmit = async (values: z.infer<typeof newTagSchema>) => {
    try {
      // SEND TO API
      const result = await createTagService(values);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        duration: 4000,
      });

      // RESET FORM
      form.setValue("tags", []);
    } catch (error) {
      // ERROR HANDLER
      const apiError = error as { response?: { data?: ApiErrorResponse } };
      const errorMessage =
        apiError.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "An unexpected error occurred");

      // TOAST MESSAGE FROM API
      toast({
        description: errorMessage,
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  // FETCH TAGS DATA
  const fetcher = () => getAllTagsService();
  const { data: tags, error: tagsError, isLoading } = useSWR("/tag", fetcher);

  // DEBOUNCE FETCH TAGS DATA
  const tagSearch = async (value: string): Promise<Option[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (value.trim() === null) {
          resolve(tags || []);
          return;
        }
        const res =
          tags?.filter((tag: any) =>
            tag.name.toLowerCase().includes(value.toLowerCase())
          ) || [];
        resolve(res);
      }, 500);
    });
  };

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
          <form>
            {/* TAG NAME */}
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
                      onChange={(value) => field.onChange(value)}
                      defaultOptions={tags || []}
                      onSearch={tagSearch}
                      placeholder="Create a new tag"
                      hidePlaceholderWhenSelected
                      creatable
                      loadingIndicator={
                        <p className="text-center leading-6 text-gray-600 dark:text-gray-400">
                          loading...
                        </p>
                      }
                      emptyIndicator={
                        <p className="text-center leading-6 text-gray-600 dark:text-gray-400">
                          No results found
                        </p>
                      }
                      inputProps={{ maxLength: 50 }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>

      {/* BUTTON */}
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex"
        >
          <ChevronLeft />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmitButtonClick}
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          <CloudUpload />
          Submit
        </Button>
      </CardFooter>

      {/* ALERT DIALOG */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Create Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Once the tag is created, it can be used to group blog posts by
              similar topics. You can edit or delete tags later if needed.
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
    </Card>
  );
}

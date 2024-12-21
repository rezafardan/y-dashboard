"use client";

import React, { useState } from "react";

// COMPONENT
import { LoadingButton } from "@/components/ui/loading-button";
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
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import useSWR from "swr";
import { ApiErrorResponse } from "@/models/error";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const [isTriggered, setIsTriggered] = React.useState(false);

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
        action: <ToastClose />,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetcher = () => getAllTagsService();

  const { data: tags, error: tagsError, isLoading } = useSWR("/tag", fetcher);

  // TAGS DATA
  //   [
  //     {
  //         "id": "cm4xgjqtm0008p2cqz728ffh0",
  //         "name": "Ea Sed Esse Ultricies Ut",
  //         "createdAt": "2024-12-21T00:45:18.346Z",
  //         "user": {
  //             "username": "bobon"
  //         }
  //     },
  //     {
  //         "id": "cm4xgl50g000ap2cqt7r12qcj",
  //         "name": "Ut Nostrud Amet in ex Providerent",
  //         "createdAt": "2024-12-21T00:46:23.392Z",
  //         "user": {
  //             "username": "bobon"
  //         }
  //     },
  //     {
  //         "id": "cm4xhtuzr000np2cqi8kautvf",
  //         "name": "Commodo Dolore Elit Voluptate Laboris Adipiscing",
  //         "createdAt": "2024-12-21T01:21:09.926Z",
  //         "user": {
  //             "username": "administrator"
  //         }
  //     },
  //     {
  //         "id": "cm4xhu3ci000pp2cqjt93v1sr",
  //         "name": "Velaliquam Quis Quis Dolor Magna",
  //         "createdAt": "2024-12-21T01:21:20.754Z",
  //         "user": {
  //             "username": "administrator"
  //         }
  //     },
  //     {
  //         "id": "cm4xhuez0000rp2cqvgmnnijm",
  //         "name": "Sit Ex Tempor Nulla Dignissim",
  //         "createdAt": "2024-12-21T01:21:35.821Z",
  //         "user": {
  //             "username": "administrator"
  //         }
  //     },
  //     {
  //         "id": "cm4xhveed000tp2cqrlfieuru",
  //         "name": "Consequat Suscipit Dignissim Dolore Elit",
  //         "createdAt": "2024-12-21T01:22:21.733Z",
  //         "user": {
  //             "username": "administrator"
  //         }
  //     },
  //     {
  //         "id": "cm4xhveeh000vp2cqxs49vycc",
  //         "name": "Dignissim Amet Velit Urna Consequat Duis Nunc",
  //         "createdAt": "2024-12-21T01:22:21.737Z",
  //         "user": {
  //             "username": "administrator"
  //         }
  //     }
  // ]

  const mockSearch = async (value: string): Promise<Option[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (value.trim() === null) {
          // Jika input kosong, kembalikan semua tag
          resolve(tags || []);
          return;
        }
        // Filter tag berdasarkan nilai input
        const res =
          tags?.filter((tag: any) =>
            tag.name.toLowerCase().includes(value.toLowerCase())
          ) || [];
        resolve(res);
      }, 500); // Debouncing 500ms
    });
  };

  console.log(tags);
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
                      onChange={(value) => field.onChange(value)}
                      defaultOptions={tags || []}
                      onSearch={mockSearch}
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
                  <FormDescription>
                    Provide a name for the tag. Use 3-50 characters and ensure
                    it accurately reflects the topic or theme it represents.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        {/* SUBMIT */}
        <LoadingButton
          loading={loading}
          type="button"
          onClick={handleSubmitButtonClick}
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          Submit
        </LoadingButton>
      </CardFooter>
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

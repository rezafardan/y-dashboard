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
import { createCategoryService } from "@/services/categoryServices";

// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";
import { ApiErrorResponse } from "@/schema/error";

// CATEGORY SCHEMA
const newCategorySchema = z.object({
  // SCHEMA FOR TITLE VALIDATION
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(12, { message: "Name must not exceed 12 characters." })
    .regex(/^[A-Za-z]+$/, {
      message:
        "Name should only contain letters and must not contain spaces or numbers.",
    })
    .transform((name) => name.toUpperCase()),

  // SCHEMA FOR DESCRIPTION VALIDATION
  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(100, { message: "Description must not exceed 100 characters." }),
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

  // FORM HANDLER
  const defaultValues = {
    name: "",
    description: "",
  };
  const form = useForm<z.infer<typeof newCategorySchema>>({
    resolver: zodResolver(newCategorySchema),
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
  const onSubmit = async (values: z.infer<typeof newCategorySchema>) => {
    try {
      setLoading(true);
      setError(null);

      // SEND TO API
      const result = await createCategoryService(values);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        action: <ToastClose />,
        duration: 4000,
      });

      // RESET FORM
      form.reset();
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create A New Category for Blogs</CardTitle>
        <CardDescription>
          Organize your blogs effectively by creating a new category. Categories
          help readers find blogs related to specific topics easily. Provide a
          clear and descriptive name for your category to ensure it is intuitive
          and aligns with the content it represents.
        </CardDescription>
        <Separator />
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            {/* CATEGORY NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a name for the category. Use 3-12 characters, and
                    make sure it&apos;s clear and descriptive. Only letters, are
                    allowed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description of category" {...field} />
                  </FormControl>
                  <FormDescription>
                    Write a description for the category. It should be 10-100
                    characters long, providing readers with an idea of what this
                    category is about.
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
                  <AlertDialogTitle>Confirm Create Category</AlertDialogTitle>
                  <AlertDialogDescription>
                    Once the category is created, you can manage it by visiting
                    the blog categories list in the menu. Use this list to edit
                    or delete categories as needed.
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

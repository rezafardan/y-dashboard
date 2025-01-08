"use client";

import React, { useState } from "react";

// COMPONENT
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { ChevronLeft, CloudUpload } from "lucide-react";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// API SERVICE
import { createCategoryService } from "@/services/categoryServices";

// TOAST
import { useToast } from "@/hooks/use-toast";

// MODELS
import { ApiErrorResponse } from "@/models/error";
import { newCategorySchema } from "@/models/formSchema";

// ROUTING
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  // ROUTER
  const router = useRouter();

  // TOAST
  const { toast } = useToast();

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // SEND TO API
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FORM HANDLER
  const defaultValues = {
    name: "",
    description: "",
  };

  const form = useForm<z.infer<typeof newCategorySchema>>({
    resolver: zodResolver(newCategorySchema),
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
  const onSubmit = async (values: z.infer<typeof newCategorySchema>) => {
    setIsSubmitting(true);

    try {
      // SEND TO API
      const result = await createCategoryService(values);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
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
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
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
        <LoadingButton
          type="button"
          loading={isSubmitting}
          onClick={handleSubmitButtonClick}
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          <CloudUpload className={isSubmitting ? "hidden" : ""} />
          Submit
        </LoadingButton>
      </CardFooter>

      {/* ALERT DIALOG  */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Create Category</AlertDialogTitle>
            <AlertDialogDescription>
              Once the category is created, you can manage it by visiting the
              blog categories list in the menu. Use this list to edit or delete
              categories as needed.
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

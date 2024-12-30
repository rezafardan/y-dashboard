"use client";

import { useEffect, useState } from "react";

// COMPONENT
import { Input } from "@/components/ui/input";
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

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// API SERVICE
import {
  editCategoryService,
  getCategoryById,
} from "@/services/categoryServices";

// TOAST
import { useToast } from "@/hooks/use-toast";

// MODELS
import { ApiErrorResponse } from "@/models/error";
import { editCategorySchema, editTagSchema } from "@/models/formSchema";

// ROUTING
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Pencil } from "lucide-react";

export default function EditCategoryPage() {
  // ROUTER
  const router = useRouter();

  // GET PARAMS
  const { id } = useParams();

  // TOAST
  const { toast } = useToast();

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // EDIT BUTTON
  const [isEditing, setIsEditing] = useState(false);

  // FORM HANDLER
  const defaultValues = {
    name: "",
    description: "",
  };

  const form = useForm<z.infer<typeof editCategorySchema>>({
    resolver: zodResolver(editCategorySchema),
    defaultValues,
    shouldFocusError: false,
    mode: "onChange",
  });

  // FETCH CATEGORY DATA
  const fetchCategoryData = async () => {
    try {
      // API SERVICE
      const result = await getCategoryById(id);

      // RESULT CATEGORY DATA FROM API SERVICE
      const categoryData = {
        name: result.name || "",
        description: result.description || "",
      };

      // SEND DATA TO FORM
      form.reset(categoryData);
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

  useEffect(() => {
    fetchCategoryData();
  }, [form]);

  // BUTTON HANDLER
  // EDIT BUTTON
  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  // CANCEL EDIT BUTTON
  const handleCancelButtonClick = () => {
    setIsEditing(false);
    form.reset();
  };

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
  const onSubmit = async (values: z.infer<typeof editTagSchema>) => {
    try {
      // API SERVICE
      const result = await editCategoryService(id, values);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        duration: 4000,
      });

      // RESET FORM ON SUCCESS
      setIsEditing(false);

      // RE-FETCH DATA
      fetchCategoryData();
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Category Data</CardTitle>
        <CardDescription>Edit the category data details.</CardDescription>
        <Separator />
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            {/* CATEGORY NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tag name"
                      autoComplete="name"
                      disabled={!isEditing}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CATEGORY DETAIL */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Description"
                      autoComplete="description"
                      disabled={!isEditing}
                      {...field}
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
      <CardFooter
        className={!isEditing ? "flex justify-between" : "justify-end"}
      >
        <Button
          variant="outline"
          onClick={() => router.back()}
          className={!isEditing ? "md:flex" : "hidden"}
        >
          <ChevronLeft />
          Back
        </Button>
        {!isEditing ? (
          <Button onClick={handleEditButtonClick}>
            <Pencil />
            Edit Category
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelButtonClick}>
              Cancel
            </Button>
            <Button onClick={handleSubmitButtonClick}>Save Changes</Button>
          </div>
        )}
      </CardFooter>

      {/* ALERT DIALOG */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Save Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm if you want to save the changes to the category
              data.
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

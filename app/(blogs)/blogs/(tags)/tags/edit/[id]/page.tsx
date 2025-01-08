"use client";

import { useCallback, useEffect, useState } from "react";

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
import { ChevronLeft, Pencil } from "lucide-react";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// API SERVICE
import { editTagService, getTagByIdService } from "@/services/tagServices";

// TOAST
import { useToast } from "@/hooks/use-toast";

// MODELS
import { ApiErrorResponse } from "@/models/error";
import { editTagSchema } from "@/models/formSchema";

// ROUTING
import { useParams, useRouter } from "next/navigation";

export default function EditTagPage() {
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

  // SEND TO API
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FORM HANDLER
  const defaultValues = {
    name: "",
  };

  const form = useForm<z.infer<typeof editTagSchema>>({
    resolver: zodResolver(editTagSchema),
    defaultValues,
    shouldFocusError: false,
    mode: "onChange",
  });

  // FETCH TAG DATA
  const fetchTagData = useCallback(async () => {
    try {
      // API SERVICE
      const result = await getTagByIdService(id);

      // RESULT TAG DATA FROM API SERVICE
      const tagData = {
        name: result.name || "",
      };

      // SEND DATA TO FORM
      form.reset(tagData);
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
  }, [form, id, toast]);

  useEffect(() => {
    fetchTagData();
  }, [fetchTagData]);

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
    setIsSubmitting(true);

    try {
      // API SERVICE
      const result = await editTagService(id, values);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        duration: 4000,
      });

      // RESET FORM ON SUCCESS
      setIsEditing(false);

      // RE-FETCH DATA
      fetchTagData();
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
        <CardTitle>Edit Tag Data</CardTitle>
        <CardDescription>Edit the tag data details.</CardDescription>
        <Separator />
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            {/* TAG NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag Name</FormLabel>
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
            Edit Tag
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelButtonClick}>
              Cancel
            </Button>
            <LoadingButton
              loading={isSubmitting}
              onClick={handleSubmitButtonClick}
              disabled={form.watch("name").endsWith(" ")}
            >
              Save Changes
            </LoadingButton>
          </div>
        )}
      </CardFooter>

      {/* ALERT DIALOG */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Save Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm if you want to save the changes to the tag data.
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

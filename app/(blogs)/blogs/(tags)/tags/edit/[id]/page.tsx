"use client";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { editTagSchema } from "@/models/formSchema";
import { editTagService, getTagByIdService } from "@/services/tagServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import { LoadingButton } from "@/components/ui/loading-button";
// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";
import { ApiErrorResponse } from "@/models/error";

export default function EditTagPage() {
  // TOAST
  const { toast } = useToast();
  const params = useParams(); // Gunakan useParams() untuk mendapatkan id
  const id = params?.id; // Pastikan id tersedia
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const defaultValues = {
    name: "",
  };

  const form = useForm<z.infer<typeof editTagSchema>>({
    resolver: zodResolver(editTagSchema),
    defaultValues,
    shouldFocusError: false,
    mode: "onChange",
  });

  const fetchTagData = async () => {
    try {
      const result = await getTagByIdService(id);
      form.reset({
        name: result.name || "",
      });
      setLoading(false);
    } catch (error) {
      setError("Error fetching user data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTagData();
  }, [form]);

  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  const handleCancelButtonClick = () => {
    setIsEditing(false);
    form.reset(); // Reset form to the initial values
  };

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

  // Fungsi untuk mengirimkan data form
  const onSubmit = async (values: z.infer<typeof editTagSchema>) => {
    try {
      const result = await editTagService(id, values);

      fetchTagData();
      toast({
        description: result.message,
        action: <ToastClose />,
        duration: 4000,
      });

      setIsEditing(false);
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
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tag Details</CardTitle>
        <CardDescription>
          Explore the full details of the selected blog.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
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
      <CardFooter className="flex justify-between">
        <LoadingButton variant="outline" onClick={() => router.back()}>
          Back
        </LoadingButton>
        {!isEditing ? (
          <Button onClick={handleEditButtonClick}>Edit Tag</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelButtonClick}>
              Cancel
            </Button>
            <Button onClick={handleSubmitButtonClick}>Save Changes</Button>
          </div>
        )}
      </CardFooter>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Create User</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm if you want to create a new user with the details
              provided.
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

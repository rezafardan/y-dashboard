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
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  editUserProfileService,
  viewUserProfileService,
} from "@/services/userServices";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { editUserSchema, UserRole } from "@/models/formSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";
import { LoadingButton } from "@/components/ui/loading-button";
import { ApiErrorResponse } from "@/models/error";

export default function EditUserProfilePage() {
  // TOAST
  const { toast } = useToast();
  const { loginUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const defaultValues = {
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: undefined,
    profileImage: undefined,
  };

  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues,
    shouldFocusError: false,
    mode: "onChange",
  });

  // Ambil data pengguna saat pertama kali halaman dimuat
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await viewUserProfileService();

        form.reset({
          username: result.username || "",
          fullname: result.fullname || "",
          email: result.email || "",
          role: result.role || undefined,
          profileImage: result.profileImage || undefined,
        });

        setLoading(false);
      } catch (error) {
        // ERROR HANDLER
        const apiError = error as { response?: { data?: ApiErrorResponse } };

        const errorMessage =
          apiError.response?.data?.message ||
          (error instanceof Error
            ? error.message
            : "An unexpected error occurred");

        // TOAST MESSAGE FROM API
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
  const onSubmit = async (values: z.infer<typeof editUserSchema>) => {
    try {
      const formData = new FormData();
      const result = await editUserProfileService(formData);

      if (result.status === 200) {
        // Update session storage atau AuthContext setelah berhasil
        loginUser({
          id: result.data.data.id,
          username: result.data.data.username,
          role: result.data.data.role,
          profileImage: result.data.data.profileImage,
        });
        router.push("/"); // Arahkan ke halaman profil setelah berhasil update
      }

      toast({
        description: result.message,
        action: <ToastClose />,
        duration: 4000,
      });
    } catch (error) {
      setError("Error updating profile");
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
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your personal information here.
        </CardDescription>
        <Separator />
      </CardHeader>

      <CardContent>
        {/* User Image */}
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      autoComplete="username"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fullname</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Fullname"
                      autoComplete="fullname"
                      disabled={!isEditing}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Fullname"
                      autoComplete="username"
                      disabled={!isEditing}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New password"
                      autoComplete="new-password"
                      disabled={!isEditing}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
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
          <Button onClick={handleEditButtonClick}>Edit User</Button>
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

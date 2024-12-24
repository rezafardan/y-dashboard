"use client";

import React, { useEffect, useState } from "react";

// COMPONENT
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// API SERVICE
import {
  checkUsernameAvailability,
  createUserService,
  editUserProfileService,
  editUserService,
  getUserByIdService,
  viewUserProfileService,
} from "@/services/userServices";

// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";

// IMAGE CROPPER
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Separator } from "@/components/ui/separator";
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
import { ApiErrorResponse } from "@/models/error";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ImageCropper from "@/components/image-cropper/image-cropper";
import { useAuth } from "@/context/AuthContext";

// ENUM FOR USER ROLE
enum UserRole {
  AUTHOR = "AUTHOR",
  EDITOR = "EDITOR",
  SUBSCRIBER = "SUBSCRIBER",
  ADMINISTRATOR = "ADMINISTRATOR",
}

// USER SCHEMA
const newUserSchema = z.object({
  // SCHEMA FOR USERNAME VALIDATION
  username: z
    .string()
    .min(4, { message: "Username minimum 4 characters" })
    .max(14, { message: "Username maximum 14 characters" })
    .refine((val) => !val.includes(" "), {
      message: "Username cannot contain spaces",
    })
    .refine((val) => val === val.toLowerCase(), {
      message: "Username must be lowercase",
    })
    .refine((val) => /^[a-z0-9_]+$/.test(val), {
      message:
        "Username can only contain lowercase letters, numbers and underscore",
    })
    .optional(),

  fullname: z
    .string()
    .min(4, { message: "Fullname minimum 4 character" })
    .max(30, { message: "Fullname maximum 30 characters" })
    .refine((val) => /^[a-z ]+$/.test(val), {
      message: "Fullname can only contain lowercase letters and spaces",
    })
    .optional(),

  // SCHEMA FOR EMAIL VALIDATION
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" })
    .max(100, { message: "Email is too long" })
    .refine((email) => !email.endsWith("@tempmail.com"), {
      message: "Temporary emails are not allowed",
    })
    .refine((email) => !email.endsWith("@yopmail.com"), {
      message: "This email domain is not allowed",
    })
    .optional(),

  password: z
    .string()
    .optional()
    .refine(
      (password) => {
        // Jika password ada, pastikan panjangnya minimal 6 karakter
        if (password && password.length < 6) {
          return false;
        }
        return true; // Validasi sukses jika password tidak ada atau panjangnya cukup
      },
      {
        message: "Password must be at least 6 characters",
      }
    )
    .refine(
      (password) => {
        if (password) {
          // Hanya terapkan regex validation jika password ada
          return (
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*]/.test(password)
          );
        }
        return true; // Jika password tidak ada, abaikan regex validation
      },
      {
        message:
          "Password must contain an uppercase letter, a number, and a special character (!@#$%^&*)",
      }
    ),

  // SCHEMA FOR PASSWORD CONFIRM VALIDATION
  confirmPassword: z.string(),

  // SCHEMA FOR ROLE VALIDATION
  role: z
    .nativeEnum(UserRole)
    .optional()
    .refine((role) => role !== undefined, {
      message: "Role selection is required",
    })
    .optional(),

  // SCHEMA FOR PROFILE IMAGE VALIDATION
  profileImage: z
    .union([
      z.string(), // Untuk URL gambar
      z.instanceof(File), // Untuk file unggahan
      z.null(), // Untuk nilai kosong
    ])
    .optional(), // Nilai tidak wajib
});

export default function EditUserDataPage() {
  const { role } = useAuth();
  // TOAST
  const { toast } = useToast();

  const { id } = useParams();

  const [isEditing, setIsEditing] = useState(false);

  // LOADING BUTTON
  const [loading, setLoading] = useState(false);

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // ERROR HANDLER
  const [error, setError] = useState<string | null>(null);

  // DEBOUNCE USERNAME
  const [usernameStatus, setUsernameStatus] = useState<string>("");

  // CROPPER

  const [image, setImage] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  const router = useRouter();
  // FORM HANDLER
  const defaultValues = {
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: undefined,
    profileImage: undefined,
  };

  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues,
    shouldFocusError: false,
    mode: "onChange",
  });

  const fetchUserData = async () => {
    try {
      const result = await viewUserProfileService();

      form.reset({
        username: result.username || "",
        fullname: result.fullname || "",
        email: result.email || "",
        role: result.role || "",
        profileImage: result.profileImage || "",
      });

      console.log(result);

      setImage(`${process.env.NEXT_PUBLIC_ASSETS_URL}/${result.profileImage}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [form]);

  // CROP IMAGE

  const handleCroppedImage = (file: File) => {
    form.setValue("profileImage", file);
  };

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

  // HANDLING SUBMIT FORM
  const onSubmit = async (values: z.infer<typeof newUserSchema>) => {
    try {
      setLoading(true);
      setError(null);

      // Buat FormData untuk mengirim data
      const formData = new FormData();

      // Cek jika ada perubahan pada profileImage
      if (croppedFile) {
        formData.append("profileImage", croppedFile);
      }

      // Kirim password hanya jika ada perubahan
      if (values.password && values.password !== "") {
        if (values.password !== values.confirmPassword) {
          toast({
            description: "Passwords do not match.",
            variant: "destructive",
          });
          return;
        }
        formData.append("password", values.password);
      }

      // Menghapus password dan confirmPassword dari objek values yang akan dikirim
      const { confirmPassword, password, ...otherData } = values;

      // Hanya kirim data yang bukan null atau undefined
      Object.entries(otherData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const result = await editUserProfileService(formData);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        action: <ToastClose />,
        duration: 4000,
      });

      // RESET FORM AND IMAGE STATES ON SUCCESS
      form.reset();
      setImage(null);
      setCroppedFile(null);
      setIsEditing(false); // Exit editing mode
      await fetchUserData();
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
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create A New User</CardTitle>
          <CardDescription>
            Fill in the required fields to create a new user. Provide a unique
            username, a secure password, a valid email address, assign a role,
            and optionally upload a profile photo to complete the registration.
          </CardDescription>
          <Separator />
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="max-w-md">
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    {isEditing ? (
                      <ImageCropper
                        initialImage={image || undefined}
                        onImageCropped={handleCroppedImage}
                        {...field}
                      />
                    ) : (
                      <div className="w-full h-full relative bg-foregroundrelative bg-muted dark:bg-background aspect-square flex items-center justify-center rounded-md overflow-hidden">
                        <img
                          src={image || "/"}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full p-1"
                        />
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* USERNAME */}
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

              {/* FULLNAME */}
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

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        disabled={!isEditing}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        disabled={!isEditing}
                        required={false}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CONFIRM PASSWORD */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        disabled={!isEditing}
                        required={false}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

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
          <AlertDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Create User</AlertDialogTitle>
                <AlertDialogDescription>
                  Please confirm if you want to create a new user with the
                  details provided.
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
        </CardContent>
      </Card>
    </div>
  );
}

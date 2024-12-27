"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

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
} from "@/services/userServices";

// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";

// DEBOUNCE
import debounce from "lodash/debounce";

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
import ImageCropper from "@/components/image-cropper/image-cropper";

// ENUM FOR USER ROLE
enum UserRole {
  AUTHOR = "AUTHOR",
  EDITOR = "EDITOR",
  SUBSCRIBER = "SUBSCRIBER",
  ADMINISTRATOR = "ADMINISTRATOR",
}

// USER SCHEMA
const newUserSchema = z
  .object({
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
      }),

    fullname: z
      .string()
      .min(4, { message: "Fullname minimum 4 character" })
      .max(30, { message: "Fullname maximum 30 characters" })
      .refine((val) => /^[a-z ]+$/.test(val), {
        message: "Fullname can only contain lowercase letters and spaces",
      }),

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
      }),

    // SCHEMA FOR PASSWORD VALIDATION
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .refine((password) => /[A-Z]/.test(password), {
        message: "Password must contain an uppercase letter",
      })
      .refine((password) => /[0-9]/.test(password), {
        message: "Password must contain a number",
      })
      .refine((password) => /[!@#$%^&*]/.test(password), {
        message: "Password must contain a special character (!@#$%^&*)",
      }),

    // SCHEMA FOR PASSWORD CONFIRM VALIDATION
    confirmPassword: z.string(),

    // SCHEMA FOR ROLE VALIDATION
    role: z
      .nativeEnum(UserRole)
      .optional()
      .refine((role) => role !== undefined, {
        message: "Role selection is required",
      }),

    // SCHEMA FOR PROFILE IMAGE VALIDATION
    profileImage: z.instanceof(File).optional(),
  })

  // SCHEMA FOR BANNED USER VALIDATION
  .refine(
    (data) => {
      const bannedUsernames = ["administrator", "author", "editor"];
      return !bannedUsernames.includes(data.username.toLowerCase());
    },
    {
      message: "Username is not available",
      path: ["username"],
    }
  )
  // SCHEMA FOR PASSWORD CONFIRM VALIDATION
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function CreateUserPage() {
  // TOAST
  const { toast } = useToast();

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

  // DEBOUNCE FETCHING USERNAME DATA
  const debouncedUsernameCheck = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 4) {
        try {
          const isAvailable = await checkUsernameAvailability(username);
          if (!isAvailable) {
            form.setError("username", {
              type: "manual",
              message: "Username is already taken",
            });
            setUsernameStatus("Username is already taken");
          } else {
            form.clearErrors("username");
            setUsernameStatus("Username is available");
          }
        } catch (error) {
          form.setError("username", {
            type: "manual",
            message: "Error checking username availability",
          });
          setUsernameStatus("Error checking username availability");
        }
      } else {
        setUsernameStatus("");
      }
    }, 500),
    [form]
  );

  useEffect(() => {
    return () => {
      debouncedUsernameCheck.cancel();
    };
  }, [debouncedUsernameCheck]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "username") {
        const username = value.username as string;
        if (username) {
          debouncedUsernameCheck(username);
        } else {
          form.clearErrors("username");
          setUsernameStatus("");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, debouncedUsernameCheck]);

  // CROP IMAGE

  const handleCroppedImage = (file: File) => {
    form.setValue("profileImage", file);
    setCroppedFile(file);
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

      // ERROR IF IMAGE NOT CROPPING
      if (!croppedFile && image) {
        toast({
          description: "Please crop the image before submitting",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();

      // ADD THE CROPPED IMAGE TO FORM DATA IF IT EXISTS
      if (croppedFile) {
        formData.append("profileImage", croppedFile);
      }

      // REMOVE CONFIRM PASSWORD AND ADD OTHER FIELD TO FORM DATA
      const { confirmPassword, profileImage, ...otherData } = values;
      Object.entries(otherData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // SEND TO API
      const result = await createUserService(formData);

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
            <form className="">
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
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Username must be lowercase, contain no spaces, and only
                      include letters, numbers, or underscores.
                    </FormDescription>
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
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Fullname must be lowercase, contain spaces, and only
                      include letters, numbers, or underscores.
                    </FormDescription>
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
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ensure your email is in the correct format and avoid using
                      temporary email domains (e.g., tempmail.com).
                    </FormDescription>
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
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 6 characters long, including one
                      uppercase letter, one number, and one special character
                      (!@#$%^&*).
                    </FormDescription>
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
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Make sure the confirmation password matches the one you
                      entered above.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ROLE */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role (required)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMINISTRATOR}>
                          ADMINISTRATOR
                        </SelectItem>
                        <SelectItem value={UserRole.AUTHOR}>AUTHOR</SelectItem>
                        <SelectItem value={UserRole.EDITOR}>EDITOR</SelectItem>
                        <SelectItem value={UserRole.SUBSCRIBER}>
                          SUBSCRIBER
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a role for the user. Role selection is required.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PROFILE PICTURE */}
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <ImageCropper
                      initialImage={image || undefined}
                      onImageCropped={handleCroppedImage}
                      {...field}
                    />
                    <FormDescription>
                      Upload an image file (PNG, JPG, JPEG, or GIF) with a
                      maximum size of 2MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <CardFooter>
            {/* SUBMIT */}
            <LoadingButton
              loading={loading}
              type="button"
              className="w-full my-4"
              onClick={handleSubmitButtonClick}
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              Submit
            </LoadingButton>
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
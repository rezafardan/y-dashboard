"use client";

import React, { useCallback, useEffect, useState } from "react";

// COMPONENT
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
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
import {
  checkUsernameAvailability,
  createUserService,
} from "@/services/userServices";

// TOAST
import { useToast } from "@/hooks/use-toast";

// DEBOUNCE
import debounce from "lodash/debounce";

// IMAGE CROPPER
import ImageCropper from "@/components/image-cropper/image-cropper";

// MODELS
import { ApiErrorResponse } from "@/models/error";
import { newUserSchema, UserRole } from "@/models/formSchema";

// ROUTING
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
  // ROUTER
  const router = useRouter();

  // TOAST
  const { toast } = useToast();

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // DEBOUNCE USERNAME
  const [usernameStatus, setUsernameStatus] = useState<string>("");

  // CROPPER
  const [image, setImage] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [isImageCropped, setIsImageCropped] = useState<Boolean>(false);

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

  // DEBOUNCE FETCH USERNAME DATA
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

  const handleCropStatusChange = (status: boolean) => {
    setIsImageCropped(status);
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
  const onSubmit = async (values: z.infer<typeof newUserSchema>) => {
    try {
      // ERROR IF IMAGE NOT CROPPING
      if (!croppedFile && !isImageCropped && image) {
        toast({
          description: "Please crop the image before submitting",
          variant: "destructive",
        });
        return;
      }

      // SETTING UP FORMDATA
      const formData = new FormData();

      // ADD THE CROPPED IMAGE TO FORMDATA IF IT EXISTS
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

      // API SERVICE
      const result = await createUserService(formData);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        duration: 4000,
      });

      // RESET FORM AND IMAGE STATES ON SUCCESS
      form.reset();
      setImage(null);
      setCroppedFile(null);
      setIsImageCropped(false);
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
        <CardTitle>Create A New User</CardTitle>
        <CardDescription>
          Fill in the required fields to create a new user. Provide a unique
          username, a fullname, a secure password, a valid email address, assign
          a role, and optionally upload a profile photo to complete the
          registration.
        </CardDescription>
        <Separator />
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="md:flex gap-6 w-full">
            {/* PROFILE PICTURE */}
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem className="flex md:flex-col items-center  justify-center md:items-start md:justify-start mt-2 mb-8">
                  <ImageCropper
                    initialImage={image || undefined}
                    onImageCropped={handleCroppedImage}
                    onCropStatusChange={handleCropStatusChange}
                    className="w-60 h-60 mb-8"
                    {...field}
                  />
                  <FormMessage className="pt-12" />
                </FormItem>
              )}
            />

            {/* USER DATA */}
            <div className="space-y-4 md:w-full">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

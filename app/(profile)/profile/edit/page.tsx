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
import { ChevronLeft, UserCheck, UserPen } from "lucide-react";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// API SERVICE
import {
  editUserProfileService,
  viewUserProfileService,
} from "@/services/userServices";

// TOAST
import { useToast } from "@/hooks/use-toast";

// IMAGE CROPPER
import ImageCropper from "@/components/image-cropper/image-cropper";

// MODELS
import { ApiErrorResponse } from "@/models/error";
import { editProfileSchema } from "@/models/formSchema";

// ROUTING
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";

export default function EditProfileDataPage() {
  // ROUTER
  const router = useRouter();

  // TOAST
  const { toast } = useToast();

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // IMAGE CROPPER
  const [image, setImage] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [isImageCropped, setIsImageCropped] = useState<boolean>();

  // EDIT BUTTON
  const [isEditing, setIsEditing] = useState(false);

  // SEND TO API
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues,
    shouldFocusError: false,
    mode: "onChange",
  });

  // FETCH USER DATA
  const fetchUserData = useCallback(async () => {
    try {
      // API SERVICE
      const result = await viewUserProfileService();

      // RESULT USER DATA FROM API SERVICE
      const userData = {
        username: result?.username || "",
        fullname: result?.fullname || "",
        email: result?.email || "",
        role: result?.role || "",
        profileImage: result?.profileImage || "",
      };

      // SEND DATA TO FORM
      form.reset(userData);

      // SET PROFILE IMAGE
      if (result?.profileImage && result.profileImage !== "null") {
        setImage(
          `${process.env.NEXT_PUBLIC_ASSETS_URL}/${result.profileImage}`
        );
      } else {
        setImage(null);
      }
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
  }, [form, toast]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // CROP IMAGE
  const handleCroppedImage = (file: File) => {
    setCroppedFile(file);
  };

  const handleCropStatusChange = (status: boolean) => {
    setIsImageCropped(status);
  };

  // BUTTON HANDLER
  // EDIT BUTTON
  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  // CANCEL EDIT BUTTON
  const handleCancelButtonClick = () => {
    setIsEditing(false);
    form.reset(); // Reset form to the initial values
  };

  // SUBMIT FORM BUTTON
  const handleSubmitButtonClick = () => {
    if (isImageCropped === false) {
      toast({
        description: "Please crop the selected image before submitting.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

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
  const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
    setIsSubmitting(true);

    try {
      // GET CURRENT DATA
      const currentValues = await viewUserProfileService();

      // CHECK CHANGED DATA
      const isChanged =
        values.username !== currentValues?.username ||
        values.fullname !== currentValues?.fullname ||
        values.email !== currentValues?.email ||
        values.role !== currentValues?.role ||
        croppedFile !== null ||
        values.password !== "";

      // NO DATA CHANGED, SHOW TOAST
      if (!isChanged) {
        toast({
          description: "No data has been changed.",
          variant: "destructive",
          duration: 4000,
        });
        return;
      }

      // SETTING UP FORMDATA
      const formData = new FormData();

      // ADD THE CROPPED IMAGE TO FORM DATA IF IT EXISTS
      if (croppedFile) {
        formData.append("profileImage", croppedFile);
      }

      // SEND PASSWORD IF CHANGED
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

      // REMOVE CONFIRM PASSWORD AND ADD OTHER FIELD TO FORM DATA
      const { confirmPassword, password, ...otherData } = values;
      Object.entries(otherData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // API SERVICE
      const result = await editUserProfileService(formData);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        duration: 4000,
      });

      // RESET FORM AND IMAGE STATES ON SUCCESS
      form.reset();
      setImage(null);
      setCroppedFile(null);
      setIsImageCropped(undefined);
      setIsEditing(false);

      // RE-FETCH DATA
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
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile Data</CardTitle>
          <CardDescription>Edit my profile data.</CardDescription>
          <Separator />
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="md:flex gap-6 w-full">
              {/* PROFILE IMAGE */}
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem className="flex md:flex-col items-center  justify-center md:items-start md:justify-start mt-2 mb-8">
                    {isEditing ? (
                      <ImageCropper
                        initialImage={image === undefined ? image : undefined}
                        onImageCropped={handleCroppedImage}
                        onCropStatusChange={handleCropStatusChange}
                        className={`w-60 h-60 ${
                          isImageCropped !== undefined ? "mb-24" : "mb-8"
                        }`}
                        {...field}
                      />
                    ) : (
                      <div className="relative w-60 h-60 bg-muted dark:bg-background aspect-square flex items-center justify-center rounded-md overflow-hidden">
                        {image && image !== null ? (
                          <div className="relative w-60 h-60 aspect-square rounded-full overflow-hidden border dark:border-secondary">
                            <img src={image} />
                          </div>
                        ) : (
                          <div className="w-60 h-60 flex aspect-square items-center justify-center rounded-full bg-muted dark:bg-background">
                            <p className="text-sm text-muted-foreground">
                              No Profile Picture
                            </p>
                          </div>
                        )}
                      </div>
                    )}
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
                      <FormLabel>New Password</FormLabel>
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
                      <FormLabel>Confirm New Password</FormLabel>
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
              </div>
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
              <UserPen />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelButtonClick}>
                Cancel
              </Button>
              <LoadingButton
                loading={isSubmitting}
                onClick={handleSubmitButtonClick}
              >
                <UserCheck className={isSubmitting ? "hidden" : ""} />
                Save Changes
              </LoadingButton>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* ALERT DIALOG */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Save Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm if you want to save the changes to the your
              profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleConfirmCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Confirm Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

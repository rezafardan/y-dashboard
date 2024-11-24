"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import debounce from "lodash/debounce";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

// ENUM FOR USER ROLE
enum UserRole {
  AUTHOR = "AUTHOR",
  EDITOR = "EDITOR",
  SUBSCRIBER = "SUBSCRIBER",
}

// VALIDATION SCHEMA
const userSchema = z
  .object({
    username: z
      .string()
      .min(4, { message: "Username minimum 4 characters" })
      .max(10, { message: "Username maximum 10 characters" })
      .refine((val) => /^[a-z0-9_]+$/.test(val), {
        message:
          "Username can only contain lowercase letters, numbers and underscores.",
      }),
    email: z
      .string()
      .email({ message: "Invalid email format" })
      .refine((email) => !email.endsWith("@tempmail.com"), {
        message: "Temporary emails are not allowed",
      }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .refine((password) => /[A-Z]/.test(password), {
        message: "Password must contain an uppercase letter",
      })
      .optional(),
    confirmPassword: z.string().optional(),
    role: z.nativeEnum(UserRole),
    profileImage: z.union([z.instanceof(File), z.string()]).optional(),
  })
  .refine((data) => !data.username.includes(" "), {
    message: "Username cannot contain spaces",
    path: ["username"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UserFormProps = {
  initialValues?: Partial<z.infer<typeof userSchema>>;
  onSubmit: (data: z.infer<typeof userSchema>) => Promise<void>;
  isLoading: boolean;
};

export const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
}) => {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: initialValues?.username || "",
      email: initialValues?.email || "",
      password: "",
      confirmPassword: "",
      role: initialValues?.role || undefined,
      profileImage: initialValues?.profileImage || undefined,
    },
  });

  const [image, setImage] = useState<string | null>(null);
  const [isCropped, setIsCropped] = useState(false);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const cropperRef = useRef<HTMLImageElement & { cropper?: Cropper }>(null);

  console.log(initialValues?.profileImage);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const cropImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], `cropped-image.png`, {
            type: "image/png",
          });
          setCroppedFile(croppedFile);
          setIsCropped(true);
          form.setValue("profileImage", croppedFile);
        }
      });
    }
  };

  const handleSubmit = form.handleSubmit((values) => {
    if (!croppedFile && image) {
      alert("Please crop the image before submitting.");
      return;
    }
    onSubmit(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="w-full flex gap-4">
        <div className="flex flex-col gap-4 w-9/12">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter username"
                    autoComplete="username"
                    value={initialValues ? initialValues?.username : ""}
                    disabled={initialValues?.username !== null}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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

        <div className="flex flex-col gap-4 w-3/12 justify-between">
          {/* Profile Image */}
          <FormField
            control={form.control}
            name="profileImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {image && !isCropped && (
                  <Cropper
                    src={image}
                    style={{ height: 200, width: 200 }}
                    initialAspectRatio={1}
                    guides={false}
                    ref={cropperRef}
                  />
                )}
                {isCropped && croppedFile && (
                  <img src={URL.createObjectURL(croppedFile)} alt="Cropped" />
                )}
                <Button type="button" onClick={cropImage}>
                  Crop Image
                </Button>
              </FormItem>
            )}
          />

          {/* Submit */}
          <LoadingButton loading={isLoading} type="submit">
            {initialValues ? "Update User" : "Create User"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

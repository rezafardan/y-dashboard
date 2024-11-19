"use client";

import React, { useCallback, useEffect } from "react";

// COMPONENT
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
import { LoadingButton } from "@/components/ui/loading-button";
import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ENUM FOR USER ROLE
enum UserRole {
  AUTHOR = "AUTHOR",
  EDITOR = "EDITOR",
  SUBSCRIBER = "SUBSCRIBER",
}

// USER SCHEMA
const newUserSchema = z
  .object({
    // SCHEMA FOR USERNAME VALIDATION
    username: z
      .string()
      .min(4, { message: "Username minimum 4 characters" })
      .max(10, { message: "Username maximum 10 characters" })
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
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = React.useState<string>("");

  const defaultValues = {
    username: "",
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
  });

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
          console.error("Error checking username availability:", error);
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
          setUsernameStatus(""); // Clear status if username is empty
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, debouncedUsernameCheck]);

  const onSubmit = async (values: z.infer<typeof newUserSchema>) => {
    try {
      setLoading(true);
      setError(null);

      // Buat FormData untuk mengirimkan data
      const formData = new FormData();

      // Hapus confirmPassword dari values
      const { confirmPassword, ...submitData } = values;

      // Masukkan data ke dalam FormData
      Object.entries(submitData).forEach(([key, value]) => {
        if (key === "profileImage" && value instanceof File) {
          // Jika profileImage adalah file, tambahkan ke FormData
          formData.append(key, value);
        } else if (value) {
          // Tambahkan data lainnya ke FormData
          formData.append(key, value as string);
        }
      });

      const result = await createUserService(formData);

      const successMessage = result.message;

      toast({
        description: successMessage,
        action: <ToastClose />,
        duration: 4000,
      });

      console.log(values);
      console.log(result);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;

      if (error?.response?.status === 403) {
        toast({
          description: errorMessage,
          action: <ToastClose />,
          duration: 4000,
          variant: "destructive",
        });
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      form.reset(defaultValues);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create A New User</CardTitle>
          <CardDescription>
            Share your ideas, stories or interesting information with the world!
            Fill in each section below with relevant details to create an
            engaging and informative blog. Make sure all input meets the
            requirements so that your blog is ready to be published.
          </CardDescription>
        </CardHeader>
        {error && <p>{error}</p>}
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex gap-4"
            >
              <div>
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
                          onChange={(e) => {
                            field.onChange(e);
                            form.trigger("username");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Username must be lowercase, contain no spaces, and only
                        include letters, numbers, or underscores.
                      </FormDescription>
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
                          onChange={(e) => {
                            field.onChange(e); // Update nilai form
                            form.trigger("email"); // Validasi langsung
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Ensure your email is in the correct format and avoid
                        using temporary email domains (e.g., tempmail.com).
                      </FormDescription>
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
                          onChange={(e) => {
                            field.onChange(e); // Update nilai form
                            form.trigger("password"); // Validasi langsung
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Password must be at least 6 characters long and contain
                        at least one uppercase letter, one number, and one
                        special character (!@#$%^&*).
                      </FormDescription>
                    </FormItem>
                  )}
                />

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
                          onChange={(e) => {
                            field.onChange(e); // Update nilai form
                            form.trigger("confirmPassword"); // Validasi langsung
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Make sure the confirmation password matches the one you
                        entered above.
                      </FormDescription>
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role (required)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.AUTHOR}>
                            AUTHOR
                          </SelectItem>
                          <SelectItem value={UserRole.EDITOR}>
                            EDITOR
                          </SelectItem>
                          <SelectItem value={UserRole.SUBSCRIBER}>
                            SUBSCRIBER
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      <FormDescription>
                        Select a role for the user. Role selection is required.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                {/* PROFILE PICTURE */}
                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select profile picture</FormLabel>
                      <AspectRatio ratio={1 / 1} className="bg-muted">
                        {field.value && (
                          <Image
                            src={URL.createObjectURL(field.value)}
                            alt="Selected Profile Picture"
                            fill
                            className="h-full w-full rounded-md object-cover"
                          />
                        )}
                      </AspectRatio>
                      <FormControl>
                        <Input
                          type="file"
                          placeholder="Select your profile picture"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            field.onChange(file); // Gabungkan `onChange` milik `react-hook-form`
                          }}
                          ref={field.ref} // Tetap gunakan `ref` dari `react-hook-form`
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Make sure the confirmation password matches the one you
                        entered above.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* SUBMIT */}
                <LoadingButton loading={loading} type="submit">
                  Submit
                </LoadingButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

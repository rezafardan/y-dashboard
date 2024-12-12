"use client";

import "./background.css";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// COMPONENT
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { ModeToggle } from "@/components/ui/mode-toggle";

// FORM HANDLER
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// API SERVICE
import { loginService } from "@/services/authServices";

import { useAuth } from "@/context/AuthContext";

// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";
import { ApiErrorResponse } from "@/schema/error";

// LOGIN SCHEMA
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default function LoginPage() {
  const { loginUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    username: "",
    password: "",
  };

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      const response = await loginService(values);
      const userData = response.user;
      const successMessage = response.message;

      sessionStorage.setItem("userData", JSON.stringify(userData));
      loginUser(userData);

      toast({
        description: successMessage,
        action: <ToastClose />,
        duration: 2000,
      });

      // REDIRECT TO HOMEPAGE
      router.push("/");
    } catch (error) {
      // ERROR HANDLER
      const apiError = error as { response?: { data?: ApiErrorResponse } };

      const errorMessage =
        apiError.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "An unexpected error occurred");

      toast({
        description: errorMessage,
        action: <ToastClose />,
        duration: 4000,
        variant: "destructive",
      });
    } finally {
      form.reset(defaultValues);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <div className="bg-gradient-blur" />
      <Card className="mx-auto max-w-sm">
        <div className="w-full pr-4 pt-4 flex justify-end">
          <ModeToggle />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username and password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-2"
              >
                {/* USERNAME */}
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <FormControl>
                          <Input
                            id="username"
                            type="text"
                            placeholder="Username"
                            autoComplete="username"
                            required
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
                        <div className="flex items-center">
                          <FormLabel htmlFor="password">Password</FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            autoComplete="on"
                            placeholder="Password"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* FORGOT PASSWORD */}
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>

                  {/* SUBMIT */}
                  <LoadingButton loading={loading} type="submit">
                    Login
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </div>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account ? Please contact{" "}
            <Link href="#" className="underline">
              administrator
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

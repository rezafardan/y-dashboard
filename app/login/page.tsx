"use client";

import React from "react";
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

// FORM HANDLER
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// API SERVICE
import { loginService } from "@/services/authServices";

// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";

// LOGIN SCHEMA
const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default function LoginFormPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

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
      const result = await loginService(values);
      const successMessage = result.message;

      toast({
        description: successMessage,
        action: <ToastClose />,
        duration: 2000,
      });

      // REDIRECT TO HOMEPAGE
      router.push("/");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;

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
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-2"
              >
                <div className="grid gap-4">
                  {/* TITLE */}
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
                            required
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
                        <div className="flex items-center">
                          <FormLabel htmlFor="password">Password</FormLabel>
                          {/* <Link
                            href="#"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </Link> */}
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

                  {/* SUBMIT */}

                  <LoadingButton loading={loading} type="submit">
                    Login
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </div>

          <div className="mt-4 text-center text-sm">
            Don't have an account ? Please contact{" "}
            <Link href="#" className="underline">
              Administrator
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

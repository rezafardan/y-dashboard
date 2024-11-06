"use client";

import React from "react";

// COMPONENT
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUserService } from "@/services/userServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// {
//   "data": [
//       {
//           "id": "cm31sst3m0002zw0xn7p6c7ua",
//           "username": "username1",
//           "email": "username1@example.com",
//           "passwordHash": "passwordUsername1",
//           "role": "ADMIN",
//           "profileImage": "profileImage1.jpg",
//           "deletedAt": "2024-11-03T16:19:56.625Z"
//       }
//   ],
//   "messsage": "Get all users success!"
// }

enum UserRole {
  ADMIN = "ADMIN",
  AUTHOR = "AUTHOR",
  USER = "USER",
}

// USER SCHEMA
const newUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username with minimum 3 character" })
    .max(10, { message: "Username maximum 8 character" }),
  email: z
    .string()
    .email()
    .min(4, { message: "Description minimum 4 character" })
    .max(28, { message: "Description maximum 28 character" }),
  passwordHash: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  profileImage: z.string().optional(),
});

export default function CreateUserPage() {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      username: "",
      email: "",
      passwordHash: "",
      role: UserRole.AUTHOR,
      profileImage: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof newUserSchema>) => {
    try {
      setLoading(true);
      const result = await createUserService(values);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
        <div className="w-full p-2 flex flex-col gap-4">
          {/* USERNAME */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Userame</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
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
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-full p-2 flex flex-col gap-4">
          {/* PASSWORD */}
          <FormField
            control={form.control}
            name="passwordHash"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordHash"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm password"
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
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>ADMIN</SelectItem>
                    <SelectItem value={UserRole.AUTHOR}>AUTHOR</SelectItem>
                    <SelectItem value={UserRole.USER}>USER</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
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
  );
}

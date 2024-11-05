"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createCategoryService } from "@/services/categoryServices";

// {
//   "data": [
//       {
//           "id": "cm31stt5w0004zw0xyqj9n6if",
//           "name": "category 1",
//           "description": "description 1",
//           "userId": "cm31sst3m0002zw0xn7p6c7ua"
//       }
//   ],
//   "message": "Get all categories success!"
// }

const newCategorySchmea = z.object({
  name: z
    .string()
    .min(3, { message: "Name with minimum 3 character" })
    .max(12, { message: "Name maximum 12 character" }),
  description: z
    .string()
    .min(10, { message: "Description minimum 10 character" })
    .max(100, { message: "Description maximum 100 character" }),
  userId: z.string().optional(),
});

export default function CreateCategoryPage() {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof newCategorySchmea>>({
    resolver: zodResolver(newCategorySchmea),
    defaultValues: {
      name: "",
      description: "",
      userId: "cm31sst3m0002zw0xn7p6c7ua",
    },
  });

  const onSubmit = async (values: z.infer<typeof newCategorySchmea>) => {
    try {
      setLoading(true);
      const result = await createCategoryService(values);
      console.log(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* CATEGORY NAME */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DESCRIPTION */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description of category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SUBMIT */}
        <LoadingButton loading={loading} type="submit">
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
}

"use client";

import React from "react";

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
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createCategoryService } from "@/services/categoryServices";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// CATEGORY SCHEMA
const newCategorySchmea = z.object({
  name: z
    .string()
    .trim() // Menghapus spasi di awal/akhir
    .min(3, { message: "Name must be at least 3 characters." })
    .max(30, { message: "Name must not exceed 30 characters." })
    .regex(/^[A-Za-z0-9\s]+$/, {
      message: "Name should only contain letters, numbers, and spaces.",
    }) // Membatasi pada huruf, angka, dan spasi
    .transform((name) =>
      name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    ), // Transformasi kapitalisasi awal setiap kata
  description: z
    .string()
    .trim() // Menghapus spasi di awal/akhir
    .min(10, { message: "Description must be at least 10 characters." })
    .max(100, { message: "Description must not exceed 100 characters." }),
  userId: z.string().optional(), // Optional untuk mendukung fleksibilitas
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
      form.reset();
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create A New Category for Blogs</CardTitle>
        <CardDescription>
          Organize your blogs effectively by creating a new category. Categories
          help readers find blogs related to specific topics easily. Provide a
          clear and descriptive name for your category to ensure it is intuitive
          and aligns with the content it represents.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
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
                  <FormDescription>
                    Provide a name for the category. Use 3-30 characters, and
                    make sure it&apos;s clear and descriptive. Only letters,
                    numbers, and spaces are allowed.
                  </FormDescription>
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
                  <FormDescription>
                    Write a description for the category. It should be 10-100
                    characters long, providing readers with an idea of what this
                    category is about.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* SUBMIT */}
            <LoadingButton loading={loading} type="submit">
              Submit
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

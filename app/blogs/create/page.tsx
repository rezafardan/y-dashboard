"use client";

import React, { Fragment } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingButton } from "@/components/ui/loading-button";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createBlogService } from "@/services/blogServices";

// DATE SETTER
import { id } from "date-fns/locale";
import { getAllCategoriesService } from "@/services/categoryServices";
import useSWR from "swr";

// ENUM FOR STATUS BLOG
enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

// BLOG SCHEMA
const newBlogSchema = z.object({
  title: z.string().min(3, { message: "Input with minimum 3 character" }),
  content: z.string().min(10, { message: "Content minimum 10 character" }),
  categoryId: z.string().min(1, { message: "Select minimum 1 option" }),
  tag: z.string().min(3, { message: "Input tag with minimun 3 character" }),
  publishedAt: z.date().optional(),
  status: z.nativeEnum(BlogStatus).optional(),
  allowComment: z.boolean().default(false).optional(),
  userId: z.string().optional(),
});

export default function CreateNewBlog() {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof newBlogSchema>>({
    resolver: zodResolver(newBlogSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      tag: "",
      publishedAt: undefined,
      status: BlogStatus.PUBLISHED,
      allowComment: true,
      userId: "cm31sst3m0002zw0xn7p6c7ua",
    },
  });

  const onSubmit = async (values: z.infer<typeof newBlogSchema>) => {
    try {
      setLoading(true);
      const result = await createBlogService(values);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetcher = () => getAllCategoriesService();
  const { data, error, isLoading } = useSWR("/category", fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
        <div className="w-full p-2 flex flex-col gap-4">
          {/* TITLE */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Input your blog title here..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CONTENT */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Input your blog title here..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="p-2 max-w-min flex flex-col gap-4">
          {/* CATEGORY */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data!.map((item, index) => {
                      return (
                        <Fragment key={index}>
                          <SelectItem value={item.id}>{item.name}</SelectItem>
                        </Fragment>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TAG */}
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag</FormLabel>
                <FormControl>
                  <Input placeholder="Input your blog tag here..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DATE PICKER */}
          <FormField
            control={form.control}
            name="publishedAt"
            render={({ field }) => (
              <FormItem className="flex w-72 flex-col gap-2">
                <FormLabel htmlFor="datetime">Date Publish</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                    displayFormat={{ hour24: "PPP HH:mm" }}
                    locale={id}
                    granularity="minute"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* STATUS */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select Status"
                        defaultValue={"PUBLISHED"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={BlogStatus.DRAFT}>
                      {BlogStatus.DRAFT}
                    </SelectItem>
                    <SelectItem value={BlogStatus.PUBLISHED}>
                      {BlogStatus.PUBLISHED}
                    </SelectItem>
                    <SelectItem value={BlogStatus.ARCHIVED}>
                      {BlogStatus.ARCHIVED}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ALLOW COMMENT */}
          <FormField
            control={form.control}
            name="allowComment"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Allow users to comment</FormLabel>
                  <FormDescription>
                    check if users are allowed to comment on this blog or
                    uncheck if users are not allowed to comment
                  </FormDescription>
                </div>
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

"use client";

import React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { LoadingButton } from "@/components/ui/loading-button";
import { id } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { createBlogService } from "@/services/blogServices";

// {
//   id: 'cm31sujsr0006zw0x8dpd7j31',
//   title: 'blog 1',
//   content: 'content 1',
//   status: 'DRAFT',
//   viewCount: 0,
//   likeCount: 0,
//   allowComment: true, /
//   publishedAt: 2024-11-03T16:21:17.880Z,
//   createdAt: 2024-11-03T16:21:17.880Z,
//   updatedAt: 2024-11-03T16:21:17.883Z,
//   deletedAt: null,
//   mainImageId: null,
//   userId: 'cm31sst3m0002zw0xn7p6c7ua',
//   categoryId: 'cm31stt5w0004zw0xyqj9n6if'
// }

// enum for status blog
enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

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

  // define isi form
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

  // define submit handler
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Input your blog title here..." {...field} />
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
                  <SelectItem value="cm31stt5w0004zw0xyqj9n6if">
                    Category 1
                  </SelectItem>
                  <SelectItem value="category2">Category 2</SelectItem>
                  <SelectItem value="category3">Category 3</SelectItem>
                  <SelectItem value="category4">Category 4</SelectItem>
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
                  check if users are allowed to comment on this blog or uncheck
                  if users are not allowed to comment
                </FormDescription>
              </div>
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

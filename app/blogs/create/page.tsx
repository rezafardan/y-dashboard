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
import { Switch } from "@/components/ui/switch";
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

import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";

import { AxiosError } from "axios";

// ENUM FOR STATUS BLOG
enum BlogStatus {
  DRAFT = "DRAFT",
  SCHEDULE = "SCHEDULE",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PUBLISH = "PUBLSIH",
  ARCHIVE = "ARCHIVE",
}

// === BLOG SCHEMA ===
// id                      String             @id @default(cuid())
// title                   String             @db.VarChar(255)
// content                 String             @db.Text
// status                  BlogStatus         @default(DRAFT)
// viewCount               Int                @default(0) @map("view_count")
// likeCount               Int                @default(0) @map("like_count")
// allowComment            Boolean            @map("allow_comment")
// schedulePulblishedAt    DateTime?          @map("schedule_published_at")
// publishedAt             DateTime?          @map("published_at")
// createdAt               DateTime           @default(now()) @map("created_at")
// updatedAt               DateTime           @updatedAt @map("edited_at")
// deletedAt               DateTime?          @map("deleted_at")
// mainImageId             String?            @map("main_image_id")
// userId                  String             @map("user_id")
// categoryId              String             @map("category_id")
// isUserActive            Boolean?           @default(true) @map("is_user_active")

interface ErrorResponse {
  message: string;
}

// BLOG SCHEMA
const newBlogSchema = z.object({
  title: z.string().min(3, { message: "Input with minimum 3 character" }),
  content: z.string().min(10, { message: "Content minimum 10 character" }),
  mainImageId: z.string().default("path://image.jpg"),
  status: z.nativeEnum(BlogStatus).optional(),
  allowComment: z.boolean().default(true).optional(),
  publishedAt: z.date().optional(),
  tag: z.string().min(3, { message: "Input tag with minimun 3 character" }),
  userId: z.string().optional(),
  categoryId: z.string().min(1, { message: "Select minimum 1 option" }),
});

export default function CreateNewBlog() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const defaultValues = {
    title: "Lorem Ipsum ea Tempuribud Sint Quis",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elitdolor ut aliquip pulvinar sit nulla elit adipiscing.",
    mainImageId: "path://image.jpg",
    status: BlogStatus.DRAFT,
    allowComment: true,
    publishedAt: undefined,
    tag: "Lorem Ipsum ea",
    userId: "cm38l6bah0000kyxi0jqe2l9c",
    categoryId: "",
  };

  const form = useForm<z.infer<typeof newBlogSchema>>({
    resolver: zodResolver(newBlogSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof newBlogSchema>) => {
    try {
      setLoading(true);

      const result = await createBlogService(values);
      const successMessage = result.message;

      toast({
        description: successMessage,
        action: <ToastClose />,
        duration: 4000,
      });
    } catch (error) {
      const errorA = error as AxiosError<ErrorResponse>;
      const errorMessage = errorA?.response?.data?.message;

      toast({
        description: errorMessage,
        action: <ToastClose />,
        duration: 4000,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      form.reset(defaultValues);
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
                        defaultValue={"DRAFT"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={BlogStatus.DRAFT}>
                      {BlogStatus.DRAFT}
                    </SelectItem>
                    <SelectItem value={BlogStatus.SCHEDULE}>
                      {BlogStatus.SCHEDULE}
                    </SelectItem>
                    <SelectItem value={BlogStatus.PENDING}>
                      {BlogStatus.PENDING}
                    </SelectItem>
                    <SelectItem value={BlogStatus.APPROVED}>
                      {BlogStatus.APPROVED}
                    </SelectItem>
                    <SelectItem value={BlogStatus.PUBLISH}>
                      {BlogStatus.PUBLISH}
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
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Allow users to comment
                  </FormLabel>
                  <FormDescription>
                    check if users are allowed to comment on this blog or
                    uncheck if users are not allowed to comment
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
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

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

// SERVICE
import { createBlogService } from "@/services/blogServices";

// DATE SETTER
import { id } from "date-fns/locale";
import { getAllCategoriesService } from "@/services/categoryServices";
import useSWR from "swr";

// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    status: undefined,
    allowComment: true,
    publishedAt: undefined,
    tag: "Lorem Ipsum ea",
    userId: "cm3obp2l400066cxcyclqg89k",
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
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;

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
    <Card>
      <CardHeader>
        <CardTitle>Create A New Blog</CardTitle>
        <CardDescription>
          Share your ideas, stories or interesting information with the world!
          Fill in each section below with relevant details to create an engaging
          and informative blog. Make sure all input meets the requirements so
          that your blog is ready to be published.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
            <div className="w-full flex flex-col gap-4">
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
                    <FormDescription>
                      Enter the title of your blog here. Minimum of 3 characters
                      for better descriptiveness and appeal
                    </FormDescription>
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
                    <FormDescription>
                      Add the main content of your blog here. At least 10
                      characters are required to provide more information to
                      readers
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="max-w-min flex flex-col gap-4">
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
                              <SelectItem value={item.id}>
                                {item.name}
                              </SelectItem>
                            </Fragment>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <FormDescription>
                      Select an appropriate category for this blog. You must
                      choose at least one category
                    </FormDescription>
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
                      <Input
                        placeholder="Input your blog tag here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Add a tag related to your blog to make it easier to find.
                      Minimum of 3 characters
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* DATE PICKER */}
              <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem className="flex w-72 flex-col gap-2">
                    <FormLabel>Date Publish</FormLabel>
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
                    <FormDescription>
                      Choose the desired date and time to publish this blog.
                      Adjust according to your schedule
                    </FormDescription>
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
                    <FormDescription>
                      Select the publication status: DRAFT for draft, SCHEDULE
                      to schedule, or PUBLISH to publish immediately
                    </FormDescription>
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
                        Check this box to allow users to comment on this blog,
                        or leave it unchecked to disable comments.
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
      </CardContent>
    </Card>
  );
}

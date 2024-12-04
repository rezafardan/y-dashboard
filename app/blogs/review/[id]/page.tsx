"use client";

import React, { useEffect, useMemo, useState } from "react";

// COMPONENT
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// SERVICE
import { reviewBlogService, getBlogByIdService } from "@/services/blogServices";

// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";

// DATE SETTER
import { id as localeId } from "date-fns/locale";

import useSWR from "swr";
import MultipleSelector from "@/components/ui/multiple-selector";

import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { generateHTML } from "@tiptap/html";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Code from "@tiptap/extension-code";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import HardBreak from "@tiptap/extension-hard-break";
import Dropcursor from "@tiptap/extension-dropcursor";
import Link from "@tiptap/extension-link";

enum BlogStatus {
  DRAFT = "DRAFT",
  SEND = "SEND",
}

// REVIEW SCHEMA
const reviewSchema = z.object({
  allowComment: z.boolean().default(true).optional(),
  publishedAt: z.date().optional(),
  reviewComment: z.string().optional(),
  status: z.nativeEnum(BlogStatus).optional(),
});

export default function ReviewBlogPage() {
  const params = useParams(); // Gunakan useParams() untuk mendapatkan id
  const id = params?.id; // Pastikan id tersedia

  // TOAST
  const { toast } = useToast();

  // LOADING BUTTON
  const [loading, setLoading] = useState(false);

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fetcher = async () => {
    if (!id) return null;
    return getBlogByIdService(id); // Replace with your API service
  };

  const {
    data: blog,
    error,
    isLoading,
  } = useSWR(id ? `/blogs/${id}` : null, fetcher);

  if (error) {
    return <p>Error fetching blog data: {error.message}</p>;
  }

  // FORM HANDLER
  const defaultValues = {
    allowComment: true,
    publishedAt: undefined,
    reviewComment: "",
    status: undefined,
  };

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues,
    shouldFocusError: false,
    mode: "all",
  });

  useEffect(() => {
    if (blog) {
      form.reset({
        allowComment: blog.allowComment ?? true,
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : undefined,
        reviewComment: "",
      });
    }
  }, [blog]);

  // SUBMIT FORM BUTTON
  const handleSubmitButtonClick = () => {
    setShowConfirmDialog(true);
  };

  // FUNC CONFIRM CREATE AFTER ALERT DIALOG
  const handleConfirmSubmit = () => {
    form.handleSubmit(onReviewSubmit)();
    setShowConfirmDialog(false);
  };

  // CANCEL BUTTON
  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
  };

  // HANDLING SUBMIT FORM
  const onReviewSubmit = async (values: z.infer<typeof reviewSchema>) => {
    try {
      setLoading(true);

      // SEND TO API
      const payload = {
        allowComment: values.allowComment,
        publishedAt: values.publishedAt
          ? new Date(values.publishedAt)
          : undefined,
        reviewComment: values.reviewComment,
      };

      // Send PATCH request
      // const result = await reviewBlogService(id, payload);

      // TOAST MESSAGE FROM API
      toast({
        // description: result.message,
        action: <ToastClose />,
        duration: 4000,
      });

      // RESET FORM
      form.reset();
    } catch (error: any) {
      // ERROR HANDLER
      const errorMessage =
        error?.response?.data?.message || "An error occurred";

      // TOAST MESSAGE FROM API
      toast({
        description: errorMessage,
        variant: "destructive",
        action: <ToastClose />,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const json = blog?.content;
  console.log(json);

  // Pastikan pengecekan data dilakukan setelah hook dipanggil.
  const output = useMemo(() => {
    // Pastikan data blog sudah ada dan tidak sedang loading
    if (!blog?.content) {
      return null; // Jika data belum ada, return null tanpa melanjutkan proses generate
    }

    // Jika data sudah ada, generate HTML
    return generateHTML(blog.content, [
      Document,
      Paragraph,
      Text,
      Heading,
      Bold,
      Italic,
      Underline,
      Strike,
      TextAlign,
      Blockquote,
      CodeBlock,
      Code,
      BulletList,
      OrderedList,
      ListItem,
      HardBreak,
      Dropcursor,
      Link,
    ]);
  }, [blog]); // Hanya memerlukan dependensi blog

  // Menampilkan loading indicator saat data masih loading
  if (isLoading) {
    return <p>Loading...</p>; // Tampilkan loading ketika data sedang diproses
  }

  // Jika tidak ada output, tampilkan pesan bahwa data belum tersedia
  if (!output) {
    return <p>No content available...</p>; // Data atau konten belum ada
  }

  console.log(output);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Review Management</CardTitle>
        <CardDescription>
          Manage and review the blog post details before final publication.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            <Card className="lg:px-32">
              <CardHeader>
                <CardTitle>{blog?.title || "Untitled Blog"}</CardTitle>
                <CardDescription>
                  Category:{" "}
                  <Badge variant="outline">
                    {blog?.category?.name || "No Category"}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Menampilkan gambar utama */}
                {blog?.mainImageId ? (
                  <img
                    src={`http://localhost:3001/${
                      blog.mainImage?.filepath || ""
                    }`}
                    alt={blog.title || "Blog Image"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center rounded-md bg-gray-100">
                    <p className="text-gray-500">No Image Available</p>
                  </div>
                )}

                {/* Menampilkan konten blog */}
                <div
                  className="prose-base mt-4"
                  dangerouslySetInnerHTML={{ __html: output }} // Render the generated HTML
                />
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full text-sm text-gray-500">
                  {/* Menampilkan jumlah like dan view */}

                  <div className="flex flex-col max-w-sm">
                    <p>Creator: {blog?.user?.username}</p>
                    <p>
                      Created At:{" "}
                      {blog?.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Not Available"}
                    </p>
                  </div>

                  <div>
                    <p>
                      Tag:{" "}
                      {blog?.tags?.map((tag: any) => tag.name).join(", ") ||
                        "No Tags"}
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <div className="flex gap-4">
              {/* DATE PICKER */}
              <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem className="flex w-72 flex-col gap-2">
                    <FormLabel>Publication Date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        displayFormat={{ hour24: "PPP HH:mm" }}
                        locale={localeId}
                        granularity="minute"
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Select the date and time for publishing the blog post.
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
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select Status"
                            defaultValue={"DRAFT"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TES">TES</SelectItem>
                        <SelectItem value="TES2">TES2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <FormDescription>
                      Select the current status of the blog post.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* ALLOW COMMENT */}
            <FormField
              control={form.control}
              name="allowComment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background dark:bg-background">
                  <div className="space-y-0.5 ">
                    <FormLabel className="text-base">
                      Allow users to comment
                    </FormLabel>
                    <FormDescription>
                      Enable this option to allow user comments on the blog
                      post.
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

            <FormField
              control={form.control}
              name="reviewComment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Input your review comments here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Provide any feedback or review for this blog post.
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* SUBMIT */}

            <LoadingButton
              loading={loading}
              type="button"
              onClick={handleSubmitButtonClick}
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              Submit
            </LoadingButton>

            <AlertDialog
              open={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Review Submission</AlertDialogTitle>
                  <AlertDialogDescription>
                    Once submitted, the blog review will be processed and stored
                    for further actions.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleConfirmCancel}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmSubmit}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

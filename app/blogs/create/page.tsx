"use client";

import React, { Fragment, useEffect, useState } from "react";

// COMPONENT
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { LoadingButton } from "@/components/ui/loading-button";
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
import { Tiptap } from "@/components/tiptap/tiptap-editor";
import MultipleSelector from "@/components/ui/multiple-selector";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newBlogSchema, BlogStatus } from "@/schema/formSchema";

// SERVICE
import { createBlogService, createCoverImage } from "@/services/blogServices";
import { getAllTagsService } from "@/services/tagServices";
import { getAllCategoriesService } from "@/services/categoryServices";
import useSWR from "swr";

// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";

// DATE SETTER
import { id } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";
import { ApiErrorResponse } from "@/schema/error";
import Image from "next/image";

export default function CreateBlogPage() {
  const { role } = useAuth();

  // TOAST
  const { toast } = useToast();

  // LOADING BUTTON
  const [loading, setLoading] = useState(false);

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // =========================================== //

  const [coverImage, setCoverImage] = useState<string | null>(null);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        console.log(file);
        const formData = new FormData();
        formData.append("coverimage", file);

        console.log(formData);

        const response = await createCoverImage(formData);
        console.log(response);
        const imageId = response.data.id; // Assume backend returns an imageId
        console.log(imageId);

        form.setValue("coverImageId", imageId);
        setCoverImage(URL.createObjectURL(file)); // Optional: Preview image
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          description: "Failed to upload image",
          variant: "destructive",
          action: <ToastClose />,
          duration: 4000,
        });
      }
    }
  };

  // FORM HANDLER
  const defaultValues = {
    title: "",
    coverImageId: undefined,
    content: "",
    status: undefined,
    tags: undefined,
    categoryId: "",
    allowComment: true,
    publishedAt: undefined,
  };

  const form = useForm<z.infer<typeof newBlogSchema>>({
    resolver: zodResolver(newBlogSchema),
    defaultValues,
    shouldFocusError: false,
    mode: "all",
  });

  // FUNC CONFIRM CREATE AFTER ALERT DIALOG
  const handleConfirmSubmit = () => {
    form.handleSubmit(onSubmit)();
    setShowConfirmDialog(false);
  };

  // CANCEL BUTTON
  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
  };

  // SUBMIT FORM BUTTON
  const handleSubmitButtonClick = () => {
    setShowConfirmDialog(true);
  };

  console.log(form.watch());
  // HANDLING SUBMIT FORM
  const onSubmit = async (values: z.infer<typeof newBlogSchema>) => {
    // CHECK VALUE
    console.log(values);
    try {
      setLoading(true);

      // SEND TO API
      const result = await createBlogService(values);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        action: <ToastClose />,
        duration: 4000,
      });

      // RESET FORM
      form.reset();
      form.setValue("tags", []);
      form.setValue("status", undefined);
    } catch (error) {
      // ERROR HANDLER
      const apiError = error as { response?: { data?: ApiErrorResponse } };

      const errorMessage =
        apiError.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "An unexpected error occurred");

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

  // Handle perubahan status dan publish date
  useEffect(() => {
    const status = form.getValues("status");
    const publishedAt = form.getValues("publishedAt");

    if (status === BlogStatus.DRAFT) {
      form.setValue("publishedAt", new Date());
    }

    // Set default publishedAt jika status adalah PUBLISH atau SCHEDULE
    if (
      (status === BlogStatus.PUBLISH || status === BlogStatus.SCHEDULE) &&
      !publishedAt
    ) {
      form.setValue("publishedAt", new Date());
    }

    // Jika status berubah menjadi SCHEDULE dan tanggal sebelumnya adalah kemarin atau lebih kecil, reset tanggal ke sekarang
    if (
      status === BlogStatus.SCHEDULE &&
      publishedAt &&
      new Date(publishedAt) < new Date()
    ) {
      form.setValue("publishedAt", new Date()); // Set tanggal ke sekarang
    }
  }, [form, form.getValues("status")]); // Hanya mengupdate ketika status berubah

  // FETCH DATA CATEGORIES AND DATA TAGS
  const fetcherCategories = () => getAllCategoriesService();
  const fetcherTags = () => getAllTagsService();
  const {
    data: categories,
    error: categoriesError,
    isLoading: isLoadingCategories,
  } = useSWR("/category", fetcherCategories);
  const {
    data: tags,
    error: tagsError,
    isLoading: isLoadingTags,
  } = useSWR("/tag", fetcherTags);

  if (isLoadingCategories) return <p>Loading...</p>;
  if (categoriesError) return <p>Error loading data categories</p>;
  if (isLoadingTags) return <p>Loading...</p>;
  if (tagsError) return <p>Error loading data tags</p>;

  return (
    <Card>
      {/* HEADER */}
      <CardHeader>
        <CardTitle>Create A New Blog</CardTitle>
        <CardDescription>
          Share your ideas, stories, or interesting information with the world!
          Fill out each section below with the necessary details to create an
          engaging and informative blog. Ensure all inputs meet the requirements
          so your blog is ready for publishing.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-4">
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
                    Enter the title of your blog. A minimum of 3 characters is
                    required for better clarity and appeal.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImageId"
              render={() => (
                <FormItem>
                  <FormLabel>Main Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {/* Image Preview */}
                      {coverImage ? (
                        <div className="relative w-full aspect-video rounded-md overflow-hidden">
                          <Image
                            loading="eager"
                            src={coverImage}
                            alt="Preview"
                            className="w-full h-full"
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-64 border border-dashed border-input rounded-md bg-background">
                          <span className="text-gray-400">
                            No image selected
                          </span>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        name="mainImageId"
                        onChange={handleImageChange}
                        placeholder="Upload your image"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Upload an image file (PNG, JPG, JPEG, or GIF) with a maximum
                    file size of 5MB.
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
                    <Tiptap content={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Add the main content of your blog here. A minimum of 1
                    character is required to provide enough information to your
                    readers.
                  </FormDescription>
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
                      {categories!.map((item, index) => {
                        return (
                          <Fragment key={index}>
                            <SelectItem value={item.id}>{item.name}</SelectItem>
                          </Fragment>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                  <FormDescription>
                    Select an appropriate category for your blog. You must
                    choose at least one category.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* TAG */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      {...field}
                      value={form.watch("tags")}
                      defaultOptions={tags}
                      placeholder={
                        role === "AUTHOR"
                          ? "Select existing tag"
                          : "Create a new tag, or select existing tag"
                      }
                      hidePlaceholderWhenSelected
                      creatable={role === "AUTHOR" ? false : true}
                      emptyIndicator={
                        <p className="text-center leading-6 text-gray-600 dark:text-gray-400">
                          No results found
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Add a relevant tag to your blog to make it easier to
                    discover. Tags must be at least 3 characters long.
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
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value={BlogStatus.DRAFT}
                        disabled={
                          form.getValues("publishedAt") &&
                          new Date(form.getValues("publishedAt") as Date) >
                            new Date()
                        }
                      >
                        {BlogStatus.DRAFT}
                      </SelectItem>
                      <SelectItem
                        value={BlogStatus.PUBLISH}
                        disabled={
                          form.getValues("publishedAt") &&
                          new Date(form.getValues("publishedAt") as Date) >
                            new Date()
                        }
                      >
                        {BlogStatus.PUBLISH}
                      </SelectItem>
                      <SelectItem value={BlogStatus.SCHEDULE}>
                        {BlogStatus.SCHEDULE}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>
                    Choose the publication status: DRAFT for a draft, SCHEDULE
                    to schedule, or PUBLISH to publish immediately.
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
                      value={field.value || new Date()} // Tampilkan tanggal sekarang jika tidak ada nilai
                      onChange={(date) => {
                        // Cek jika status PUBLISH, maka otomatis set tanggal ke sekarang
                        if (form.getValues("status") === BlogStatus.PUBLISH) {
                          field.onChange(new Date()); // Tanggal otomatis diatur ke sekarang
                        } else if (
                          form.getValues("status") === BlogStatus.SCHEDULE
                        ) {
                          if (date && date < new Date()) {
                            form.setValue("status", BlogStatus.PUBLISH); // Ubah status jadi PUBLISH
                          } else if (date && date > new Date()) {
                            form.setValue("status", BlogStatus.SCHEDULE); // Tetap SCHEDULE jika tanggal lebih besar
                          }
                          field.onChange(date);
                        }
                      }}
                      displayFormat={{ hour24: "PPP HH:mm" }}
                      locale={id}
                      granularity="minute"
                      disabled={
                        // Disable saat status DRAFT atau PUBLISH
                        !form.getValues("status") ||
                        form.getValues("status") === BlogStatus.DRAFT ||
                        form.getValues("status") === BlogStatus.PUBLISH
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Choose the date and time you want to publish this blog.
                    Adjust the schedule as needed.
                  </FormDescription>
                </FormItem>
              )}
            />

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
                      Enable this option to allow users to comment on your blog,
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
                  <AlertDialogTitle>Confirm Create Category</AlertDialogTitle>
                  <AlertDialogDescription>
                    Once the category is created, you can manage it by visiting
                    the blog categories list in the menu. Use this list to edit
                    or delete categories as needed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleConfirmCancel}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmSubmit}>
                    Confirm Create
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

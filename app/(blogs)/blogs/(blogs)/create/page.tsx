"use client";

import React, { Fragment, useEffect, useState } from "react";

// COMPONENT
import Image from "next/image";
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
import { Tiptap } from "@/components/tiptap/tiptap-editor";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { RefreshCcw } from "lucide-react";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newBlogSchema, BlogStatus } from "@/models/formSchema";

// SERVICE
import { createBlogService, createCoverImage } from "@/services/blogServices";
import { getAllTagsService } from "@/services/tagServices";
import { getAllCategoriesService } from "@/services/categoryServices";
import useSWR from "swr";
import { ApiErrorResponse } from "@/models/error";

// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";

// DATE SETTER
import { id } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { blogStatus } from "@/models/dataSchema";

export default function CreateBlogPage() {
  // CONTEXT
  const { role } = useAuth();

  // TOAST
  const { toast } = useToast();

  // LOADING BUTTON
  const [loading, setLoading] = useState(false);

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // RESET TIPTAP EDITOR
  const [shouldResetEditor, setShouldResetEditor] = useState(false);

  // =========================================== //

  const [coverImage, setCoverImage] = useState<string | null>(null);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("coverimage", file);

        const response = await createCoverImage(formData);

        const imageId = response.data.id;

        form.setValue("coverImageId", imageId);
        setCoverImage(URL.createObjectURL(file));
      } catch (error) {
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

  // HANDLING SUBMIT FORM
  const onSubmit = async (values: z.infer<typeof newBlogSchema>) => {
    // CHECK VALUE

    console.log("Clicked");
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
      form.reset(defaultValues);
      form.setValue("tags", []);
      form.setValue("status", undefined);
      setCoverImage(null);
      setShouldResetEditor(true);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
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

  const onSaveToDraft = async () => {
    // CHECK VALUE

    try {
      setLoading(true);

      const draftValues = {
        ...form.getValues(),
        status: BlogStatus.DRAFT,
      };

      console.log(draftValues);

      // SEND TO API
      const result = await createBlogService(draftValues);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        action: <ToastClose />,
        duration: 4000,
      });

      // RESET FORM
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

  console.log(form.watch());

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

  const tagSearch = async (value: string): Promise<Option[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (value.trim() === null) {
          // Jika input kosong, kembalikan semua tag
          resolve(tags || []);
          return;
        }
        // Filter tag berdasarkan nilai input
        const res =
          tags?.filter((tag: any) =>
            tag.name.toLowerCase().includes(value.toLowerCase())
          ) || [];
        resolve(res);
      }, 500); // Debouncing 500ms
    });
  };

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
          <form className="space-y-4">
            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Input your blog title here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImageId"
              render={() => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {/* Image Preview */}
                      {coverImage ? (
                        <div className="relative w-full aspect-video rounded-md overflow-hidden">
                          <Image
                            loading="eager"
                            src={coverImage}
                            alt="Cover image preview"
                            className="w-full h-full"
                            fill
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
                        name="coverImageId"
                        onChange={handleImageChange}
                      />
                    </div>
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
                    <Tiptap
                      content={field.value}
                      onChange={field.onChange}
                      reset={shouldResetEditor}
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
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    // value={field.value}
                  >
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
                      onChange={(value) => field.onChange(value)}
                      defaultOptions={tags || []}
                      onSearch={tagSearch}
                      hidePlaceholderWhenSelected
                      creatable={role === "AUTHOR" ? false : true}
                      inputProps={{ maxLength: 50 }}
                      placeholder={
                        role === "AUTHOR"
                          ? "Select existing tag"
                          : "Create a new tag, or select existing tag"
                      }
                      loadingIndicator={
                        <p className="text-center leading-6 text-gray-600 dark:text-gray-400">
                          loading...
                        </p>
                      }
                      emptyIndicator={
                        <p className="text-center leading-6 text-gray-600 dark:text-gray-400">
                          No results found
                        </p>
                      }
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
                  <Select
                    {...field}
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value) {
                        form.setValue("publishedAt", new Date());
                      }
                    }}
                    // value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={BlogStatus.PUBLISH}>
                        {BlogStatus.PUBLISH}
                      </SelectItem>
                      <SelectItem value={BlogStatus.SCHEDULE}>
                        {BlogStatus.SCHEDULE}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DATE PICKER */}
            <FormField
              control={form.control}
              name="publishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Publish</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value || new Date()}
                      onChange={(date) => {
                        // Periksa apakah `date` terdefinisi
                        if (!date) {
                          toast({
                            description: "Invalid date selection.",
                            variant: "destructive",
                          });
                          return;
                        }

                        const status = form.watch("status");
                        const today = new Date();

                        // Validasi untuk status PUBLISH
                        if (status === BlogStatus.PUBLISH && date > today) {
                          toast({
                            description: "Publish date cannot be after today.",
                            variant: "destructive",
                          });
                          return;
                        }

                        // Validasi untuk status SCHEDULE
                        if (status === BlogStatus.SCHEDULE && date < today) {
                          toast({
                            description:
                              "Scheduled date cannot be before today.",
                            variant: "destructive",
                          });
                          return;
                        }

                        field.onChange(date);
                      }}
                      displayFormat={{ hour24: "PPP HH:mm" }}
                      locale={id}
                      granularity="minute"
                      disabled={!form.getValues("status")}
                    />
                  </FormControl>
                  <FormMessage />
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
          </form>
        </Form>
      </CardContent>

      {/* SUBMIT */}
      <CardFooter className="flex justify-between">
        <LoadingButton
          loading={loading}
          type="button"
          onClick={handleSubmitButtonClick}
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          Submit
        </LoadingButton>
        <LoadingButton loading={loading} type="button" onClick={onSaveToDraft}>
          Save To Draft
        </LoadingButton>
      </CardFooter>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Create Category</AlertDialogTitle>
            <AlertDialogDescription>
              Once the category is created, you can manage it by visiting the
              blog categories list in the menu. Use this list to edit or delete
              categories as needed.
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
    </Card>
  );
}

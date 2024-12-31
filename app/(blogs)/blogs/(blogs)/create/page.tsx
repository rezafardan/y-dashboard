"use client";

import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";

// COMPONENT
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tiptap } from "@/components/tiptap/tiptap-editor";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { DateTimePicker } from "@/components/ui/datetime-picker";
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
import { ChevronLeft, ClipboardList, CloudUpload } from "lucide-react";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// API SERVICE
import { createBlogService, createCoverImage } from "@/services/blogServices";
import { getAllTagsService } from "@/services/tagServices";
import { getAllCategoriesService } from "@/services/categoryServices";
import useSWR from "swr";

// TOAST
import { useToast } from "@/hooks/use-toast";

// MODELS
import { ApiErrorResponse } from "@/models/error";
import { newBlogSchema, BlogStatus } from "@/models/formSchema";

// DATE SETTER
import { id as dateId } from "date-fns/locale";

// CONTEXT
import { useAuth } from "@/context/AuthContext";

// ROUTING
import { useRouter } from "next/navigation";

export default function CreateBlogPage() {
  // ROUTER
  const router = useRouter();

  // CONTEXT
  const { role } = useAuth();

  // TOAST
  const { toast } = useToast();

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // RESET TIPTAP EDITOR
  const [shouldResetEditor, setShouldResetEditor] = useState(false);

  // COVER IMAGE STATES
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // FORM HANDLER
  const defaultValues = {
    title: "",
    slug: "",
    coverImageId: undefined,
    content: "",
    status: undefined,
    tags: undefined,
    categoryId: "",
    allowComment: undefined,
    publishedAt: undefined,
  };

  const form = useForm<z.infer<typeof newBlogSchema>>({
    resolver: zodResolver(newBlogSchema),
    defaultValues,
    shouldFocusError: false,
    mode: "onChange",
  });

  // LISTENER IMAGE CHANGE
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // SETTING UP FORMDATA
        const formData = new FormData();

        // ADD THE COVER IMAGE TO FORMDATA
        formData.append("coverimage", file);

        // API SERVICE
        const result = await createCoverImage(formData);

        // ADD IMAGE TO FORM
        const imageId = result.data.id;
        form.setValue("coverImageId", imageId);

        // SET COVER IMAGE TO STATES
        setCoverImage(URL.createObjectURL(file));
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
          duration: 4000,
        });
      }
    }
  };

  // SUBMIT FORM BUTTON
  const handleSubmitButtonClick = () => {
    setShowConfirmDialog(true);
  };

  // CONFIRM BUTTON AFTER ALERT DIALOG
  const handleConfirmSubmit = () => {
    form.handleSubmit(onSubmit)();
    setShowConfirmDialog(false);
  };

  // CANCEL BUTTON ALERT DIALOG
  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
  };

  // CREATE SLUG FROM TITLE
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  // HANDLING SUBMIT FORM
  const onSubmit = async (values: z.infer<typeof newBlogSchema>) => {
    try {
      // Generate slug dari title
      const slug = generateSlug(values.title);

      // Tambahkan slug ke values
      const blogValues = { ...values, slug };

      // API SERVICE
      const result = await createBlogService(blogValues);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        duration: 4000,
      });

      // RESET FORM AND IMAGE STATES ON SUCCESS
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
        duration: 4000,
      });
    }
  };

  const onSaveToDraft = async () => {
    try {
      // SETTING UP DRAFT VALUE AND CHANGE BLOG STATUS TO DRAFT ON SAVE
      const draftValues = {
        ...form.getValues(),
        status: BlogStatus.DRAFT,
      };

      // API SERVICE
      const result = await createBlogService(draftValues);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        duration: 4000,
      });

      // RESET FORM
      router.push("/blogs");
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
        duration: 4000,
      });
    }
  };

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

  // DEBOUNCE FETCH TAGS DATA
  const tagSearch = async (value: string): Promise<Option[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (value.trim() === null) {
          resolve(tags || []);
          return;
        }

        const res =
          tags?.filter((tag: any) =>
            tag.name.toLowerCase().includes(value.toLowerCase())
          ) || [];
        resolve(res);
      }, 500);
    });
  };

  if (isLoadingTags) return <p>Loading...</p>;
  if (tagsError) return <p>Error loading data tags</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create A New Blog</CardTitle>
        <CardDescription>
          Share your ideas, stories, or interesting information with the world!
          Fill out each section below with the necessary details to create an
          engaging and informative blog. Ensure all inputs meet the requirements
          so your blog is ready for publishing.
        </CardDescription>
        <Separator />
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

            {/* COVER IMAGE */}
            <FormField
              control={form.control}
              name="coverImageId"
              render={() => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
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

            <div className="flex-row md:flex space-y-4 md:space-y-0 md:space-x-4">
              {/* CATEGORY */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="w-full">
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
                              <SelectItem value={item.id}>
                                {item.name}
                              </SelectItem>
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
                  <FormItem className="w-full">
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
                        inputProps={{ maxLength: 50 }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-row md:flex space-y-4 md:space-y-0 md:space-x-4">
              {/* STATUS */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
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
                  <FormItem className="w-full">
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
                              description:
                                "Publish date cannot be after today.",
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
                        locale={dateId}
                        granularity="minute"
                        disabled={!form.getValues("status")}
                      />
                    </FormControl>
                    <FormMessage />
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
                      Allow viewers to comment
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

      {/* BUTTON */}
      <CardFooter className="flex-col-reverse md:flex-row md:justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex self-end"
        >
          <ChevronLeft />
          Back
        </Button>

        <div className="flex self-end gap-2">
          <Button variant="outline" onClick={onSaveToDraft} className="flex">
            <ClipboardList />
            Save To Draft
          </Button>

          <Button
            type="button"
            onClick={handleSubmitButtonClick}
            // disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            <CloudUpload />
            Submit
          </Button>
        </div>
      </CardFooter>

      {/* ALERT DIALOG */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Create Blog</AlertDialogTitle>
            <AlertDialogDescription>
              Once the blog is created, you can manage it by visiting the blog
              list in the menu. Use this list to edit or delete blog as needed.
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

"use client";

import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";

// COMPONENT
import Link from "next/link";
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
import BlogPreviewDialog from "@/components/blog/blog-preview";

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
import { Tag } from "@/models/dataSchema";
import { LoadingButton } from "@/components/ui/loading-button";
import GlobalSkeleton from "@/components/global-skeleton";

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

  // SEND TO API
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaveToDraft, setIsSaveToDraft] = useState(false);

  // FORM HANDLER
  const defaultValues = {
    title: "",
    slug: "",
    coverImageId: undefined,
    content: "",
    status: undefined,
    tags: undefined,
    categoryId: undefined,
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

  console.log(form.watch());

  // FORM WATCH SLUG
  useEffect(() => {
    const title = form.watch("title");
    const slug = generateSlug(title);

    // SET VALUE FORM WITH GENERATE SLUG FUNCTION
    form.setValue("slug", slug, { shouldValidate: true });
  }, [form.watch("title")]);

  // HANDLING SUBMIT FORM
  const onSubmit = async (values: z.infer<typeof newBlogSchema>) => {
    setIsSubmitting(true);

    try {
      // API SERVICE
      const result = await createBlogService(values);

      // EXTRACT BLOG ID
      const blogId = result?.data?.id;
      const blogUrl = `/blogs/view/${blogId}`;

      // TOAST MESSAGE FROM API
      toast({
        description: (
          <div>
            {result.message}{" "}
            {blogId && (
              <Link href={blogUrl} className="underline">
                view blog
              </Link>
            )}
          </div>
        ),
        duration: 4000,
      });

      // RESET FORM AND IMAGE STATES ON SUCCESS
      form.reset(defaultValues);
      form.setValue("tags", []);
      form.setValue("status", "" as any);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  // HANDLING SAVE TO DRAFT
  const onSaveToDraft = async () => {
    setIsSaveToDraft(true);

    // FORM VALIDATION
    const isValid = await form.trigger([
      "title",
      "content",
      "categoryId",
      "allowComment",
    ]);

    // TOAST MESSAGE
    if (!isValid) {
      toast({
        description:
          "Please fill in all required fields before saving to draft.",
        variant: "destructive",
        duration: 4000,
      });

      setIsSaveToDraft(false);
      return;
    }

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
    } finally {
      setIsSaveToDraft(false);
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

  if (isLoadingCategories) return <GlobalSkeleton />;
  if (categoriesError) return <p>Error loading data categories</p>;
  if (isLoadingTags) return <GlobalSkeleton />;
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
          tags?.filter((tag: Tag) =>
            tag.name.toLowerCase().includes(value.toLowerCase())
          ) || [];
        resolve(res);
      }, 500);
    });
  };

  if (isLoadingTags) return <GlobalSkeleton />;
  if (tagsError) return <p>Error loading data tags</p>;

  // PREVIEW BLOG DATA
  const blogPreview = () => {
    const formData = form.getValues();
    return {
      title: formData.title || "Untitled",
      content: formData.content,
      coverImageId: formData.coverImageId,
      coverImage: coverImage ? { filepath: coverImage } : null,
      category: categories?.find((cat) => cat.id === formData.categoryId),
      tags: formData.tags || [],
      publishedAt: formData.publishedAt,
    };
  };

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
                            className="w-full h-full object-cover"
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

                          if (status === BlogStatus.PUBLISH && date > today) {
                            toast({
                              description:
                                "Publish date cannot be after today.",
                              variant: "destructive",
                            });
                            return;
                          }

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

            <div className="flex-row md:flex space-y-4 md:space-y-0 md:space-x-4">
              {/* ALLOW COMMENT */}
              <FormField
                control={form.control}
                name="allowComment"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-row items-center justify-between rounded-lg border p-4 bg-background dark:bg-background">
                    <div className="space-y-0.5 ">
                      <FormLabel className="text-sm">
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

              {/* DRAFT AND PREVIEW */}
              <div className="flex gap-2 flex-row items-center justify-end rounded-lg border p-2 bg-background dark:bg-background">
                {/* SAVE TO DRAFT */}
                <LoadingButton
                  type="button"
                  loading={isSaveToDraft}
                  variant="secondary"
                  onClick={onSaveToDraft}
                  disabled={
                    form.watch("title").trim() === "" ||
                    form.watch("content").trim() === "" ||
                    form.watch("categoryId") === ""
                  }
                  className="flex"
                >
                  <ClipboardList className={isSaveToDraft ? "hidden" : ""} />
                  Save To Draft
                </LoadingButton>

                {/* PRVIEW */}
                <BlogPreviewDialog
                  blog={blogPreview()}
                  disabled={!form.watch("content")}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>

      {/* BUTTON */}
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex"
        >
          <ChevronLeft />
          Back
        </Button>

        <LoadingButton
          type="button"
          loading={isSubmitting}
          onClick={handleSubmitButtonClick}
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          <CloudUpload className={isSubmitting ? "hidden" : ""} />
          Submit
        </LoadingButton>
      </CardFooter>

      {/* ALERT DIALOG SUBMIT*/}
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

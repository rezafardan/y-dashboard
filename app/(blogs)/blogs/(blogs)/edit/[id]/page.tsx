"use client";

import React, { Fragment, useEffect, useState } from "react";

// COMPONENT
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { ChevronLeft, ClipboardList, CloudUpload, UserPen } from "lucide-react";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// API SERVICE
import {
  createCoverImage,
  editBlogService,
  getBlogByIdService,
} from "@/services/blogServices";
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
import { useParams, useRouter } from "next/navigation";
import BlogPreviewDialog from "@/components/blog/blog-preview";

export default function EditBlogPage() {
  // ROUTER
  const router = useRouter();

  // CONTEXT
  const { role } = useAuth();

  // GET PARAMS
  const { id } = useParams();

  // TOAST
  const { toast } = useToast();

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // RESET TIPTAP EDITOR
  const [shouldResetEditor, setShouldResetEditor] = useState(false);

  // COVER IMAGE STATES
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // EDIT BUTTON
  const [isEditing, setIsEditing] = useState(false);

  // STATUS BLOG
  const [blogStatus, setBlogStatus] = useState("PUBLSIH");

  // FETCH DATA BLOG
  const fetchBlogData = async () => {
    try {
      // API SERVICE
      const result = await getBlogByIdService(id);

      // RESULT BLOG DATA FROM API SERVICE
      const blogData = {
        title: result.title || "",
        coverImageId: result.coverImageId || "",
        content: JSON.stringify(result.content) || "",
        status: result.status || "",
        categoryId: result.category?.id || "",
        tags: result.tags || [],
        allowComment: result.allowComment ?? true,
        publishedAt: result.publishedAt
          ? new Date(result.publishedAt)
          : undefined,
      };

      form.reset(blogData);

      // SET STATUS TO PUBLISH
      if (result.status === "DRAFT") {
        form.setValue("status", BlogStatus.PUBLISH);
        setBlogStatus(result.status);
      }

      // SET PREVIEW COVER IMAGE
      if (result.coverImage && result.coverImage.filepath) {
        setCoverImage(
          `${process.env.NEXT_PUBLIC_ASSETS_URL}/${result.coverImage.filepath}`
        );
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

  useEffect(() => {
    fetchBlogData();
  }, []);

  // FORM HANDLER
  const defaultValues = {
    title: "",
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

  // BUTTON HANDLER
  // EDIT BUTTON
  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  // CANCEL EDIT BUTTON
  const handleCancelButtonClick = () => {
    setIsEditing(false);
    form.reset();
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

  // HANDLING SUBMIT FORM
  const onSubmit = async (values: z.infer<typeof newBlogSchema>) => {
    try {
      // API SERVICE
      const result = await editBlogService(id, values);

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
      form.setValue("status", undefined);
      setCoverImage(null);
      setShouldResetEditor(true);
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      // REDIRECTING TO BLOG VIEW DETAIL
      router.push(`/blogs/view/${id}`);
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
        <CardTitle>Edit Blog Detail</CardTitle>
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
                      placeholder="Input your blog title here..."
                      disabled={!isEditing}
                      {...field}
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
                          <img
                            loading="eager"
                            src={coverImage}
                            alt="Preview"
                            className="w-full h-full"
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
                        disabled={!isEditing}
                        onChange={handleImageChange}
                        placeholder="Upload your image"
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
                      disabled={!isEditing}
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
                        placeholder={
                          role === "AUTHOR"
                            ? "Select existing tag"
                            : "Create a new tag, or select existing tag"
                        }
                        {...field}
                        value={form.watch("tags")}
                        onChange={(value) => field.onChange(value)}
                        defaultOptions={tags || []}
                        onSearch={tagSearch}
                        hidePlaceholderWhenSelected
                        creatable={role === "AUTHOR" ? false : true}
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
                        disabled={!isEditing}
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
                      value={field.value}
                      disabled={!isEditing}
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
                        disabled={!form.getValues("status") || !isEditing}
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
                      <FormLabel className="text-base">
                        Allow viewers to comment
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isEditing}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* DRAFT AND PREVIEW */}
              <div className="flex gap-2 flex-row items-center justify-end rounded-lg border p-2 bg-background dark:bg-background">
                {/* SAVE TO DRAFT */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSubmitButtonClick}
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
                  className={
                    blogStatus === "PUBLISH" || blogStatus === "SCHEDULE"
                      ? "hidden"
                      : "flex"
                  }
                >
                  <ClipboardList />
                  Save To Draft
                </Button>

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
      <CardFooter
        className={!isEditing ? "flex justify-between" : "justify-end"}
      >
        <Button
          variant="outline"
          onClick={() => router.back()}
          className={!isEditing ? "md:flex" : "hidden"}
        >
          <ChevronLeft />
          Back
        </Button>

        {!isEditing ? (
          <Button onClick={handleEditButtonClick}>
            <UserPen />
            Edit
          </Button>
        ) : (
          <div className="flex justify-between w-full">
            <div className="flex gap-2 self-end">
              <Button variant="outline" onClick={handleCancelButtonClick}>
                Cancel
              </Button>

              <Button type="button" onClick={handleSubmitButtonClick}>
                <CloudUpload />
                Submit
              </Button>
            </div>
          </div>
        )}
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

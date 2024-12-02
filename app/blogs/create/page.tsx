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

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// SERVICE
import { createBlogService, getAllTagsService } from "@/services/blogServices";

// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";

// DATE SETTER
import { id } from "date-fns/locale";
import { getAllCategoriesService } from "@/services/categoryServices";
import useSWR from "swr";
import MultipleSelector from "@/components/ui/multiple-selector";

// ENUM FOR STATUS BLOG
enum BlogStatus {
  DRAFT = "DRAFT",
  SEND = "SEND",
}

const tagSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: "Tag name must be at least 3 characters" })
    .max(50, { message: "Tag name cannot exceed 50 characters" }),
});

// BLOG SCHEMA
const newBlogSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Input with minimum 3 characters" })
    .max(100, { message: "Title can be up to 100 characters" }),
  content: z
    .string()
    .min(1, { message: "Content must be at least 1 character" })
    .max(10000, { message: "Content cannot exceed 10,000 characters" }),
  mainImageId: z.custom<File>((file) => {
    if (!file) {
      return false;
    }
    return file.size <= 5 * 1024 * 1024;
  }, "File size must not exceed 5MB"),
  status: z.nativeEnum(BlogStatus).optional(),
  allowComment: z.boolean().default(true).optional(),
  tags: z
    .array(tagSchema)
    .min(1, { message: "Input tag with minimun 1 tag" })
    .max(5, { message: "Input tag with maximum 5 tag" }),
  categoryId: z.string().min(1, { message: "Select minimum 1 option" }),
});

const STORAGE_KEY = "createBlogForm";

export default function CreateBlogPage() {
  // TOAST
  const { toast } = useToast();

  // IMAGE
  const [image, setImage] = useState<string | null>(null);

  // LOADING BUTTON
  const [loading, setLoading] = useState(false);

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // FORM HANDLER
  const defaultValues = {
    title: "",
    content: "",
    mainImageId: undefined,
    status: undefined,
    allowComment: true,
    tags: undefined,
    categoryId: "",
    // publishedAt: undefined,
  };

  const form = useForm<z.infer<typeof newBlogSchema>>({
    resolver: zodResolver(newBlogSchema),
    defaultValues,
    shouldFocusError: false,
    mode: "all",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          description: "File size cannot exceed 2MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  // SUBMIT FORM BUTTON
  const handleSubmitButtonClick = () => {
    setShowConfirmDialog(true);
  };

  // FUNC CONFIRM CREATE AFTER ALERT DIALOG
  const handleConfirmSubmit = () => {
    form.handleSubmit(onSubmit)();
    setShowConfirmDialog(false);
  };

  // CANCEL BUTTON
  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
  };

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      form.reset(parsedData);
      if (parsedData.mainImageId) {
        setImage(parsedData.mainImageId); // Jika ada gambar, set preview-nya
      }
    }
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // HANDLING SUBMIT FORM
  const onSubmit = async (values: z.infer<typeof newBlogSchema>) => {
    console.log(values); // Menampilkan seluruh data form
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("status", values.status || BlogStatus.DRAFT);
      formData.append("allowComment", String(values.allowComment));
      formData.append("categoryId", values.categoryId);
      formData.append("mainImageId", values.mainImageId);
      if (values.tags && values.tags.length > 0) {
        formData.append("tags", JSON.stringify(values.tags));
      }

      // SEND TO API
      const result = await createBlogService(formData);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        action: <ToastClose />,
        duration: 4000,
      });

      // RESET FORM
      form.reset();

      localStorage.removeItem(STORAGE_KEY);
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
                    Enter the title of your blog here. Minimum of 3 characters
                    for better descriptiveness and appeal
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* MAIN IMAGE */}
            <FormField
              control={form.control}
              name="mainImageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {/* Image Preview */}
                      {image ? (
                        <div className="relative w-full aspect-video rounded-md overflow-hidden">
                          <img
                            src={image}
                            alt="Preview"
                            className="object-cover w-full h-full"
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
                        onChange={(e) => {
                          handleImageChange(e);
                          field.onChange(e.target.files?.[0]);
                        }}
                        placeholder="Upload your image"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Upload an image file (PNG, JPG, JPEG, or GIF) with a maximum
                    size of 5MB.
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
                    Add the main content of your blog here. At least 1
                    characters are required to provide more information to
                    readers
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
                    Select an appropriate category for this blog. You must
                    choose at least one category
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
                      defaultOptions={tags}
                      placeholder="Input tag or Create a new tag"
                      hidePlaceholderWhenSelected
                      creatable
                      emptyIndicator={
                        <p className="text-center leading-6 text-gray-600 dark:text-gray-400">
                          No results found
                        </p>
                      }
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
            {/* <FormField
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
              /> */}

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
                      <SelectItem value={BlogStatus.SEND}>
                        {BlogStatus.SEND}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>
                    Select the publication status: DRAFT for draft, SCHEDULE to
                    schedule, or PUBLISH to publish immediately
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
                      Check this box to allow users to comment on this blog, or
                      leave it unchecked to disable comments.
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

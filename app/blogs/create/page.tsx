"use client";

import React, { Fragment, useState } from "react";

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

export default function CreateBlogPage() {
  // TOAST
  const { toast } = useToast();

  // LOADING BUTTON
  const [loading, setLoading] = useState(false);

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // =========================================== //

  // FORM HANDLER
  const defaultValues = {
    title: "",
    content: "",
    status: undefined,
    tags: undefined,
    categoryId: "",
    allowComment: true,
    publishedAt: new Date(),
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

  console.log(form.watch().content);

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
                      value={form.watch("tags")}
                      defaultOptions={tags}
                      placeholder="Input tag or Create a new tag"
                      hidePlaceholderWhenSelected
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
                      <SelectItem value={BlogStatus.DRAFT}>
                        {BlogStatus.DRAFT}
                      </SelectItem>
                      <SelectItem value={BlogStatus.PUBLISH}>
                        {BlogStatus.PUBLISH}
                      </SelectItem>
                      <SelectItem value={BlogStatus.SCHEDULE}>
                        {BlogStatus.SCHEDULE}
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background dark:bg-background">
                  <div className="space-y-0.5 ">
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

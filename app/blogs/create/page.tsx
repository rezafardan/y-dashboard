"use client";

import React, { useMemo } from "react";

// Fetching api
import axios from "axios";

// React quill rich text editor
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Form handler
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBlogFormSchema,
  CreateBlogFormSchema,
} from "@/schema/createBlogFormSchema";
import { useForm, useFormState } from "react-hook-form";

// UI component
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function CreateBlogPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [error, setError] = React.useState<string | undefined>(undefined);
  const { toast } = useToast();

  const form = useForm<CreateBlogFormSchema>({
    resolver: zodResolver(createBlogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      userId: "9f593ec8-0025-465b-b6fa-d15ede8a83ed",
      categoryId: "d86430ea-6571-4a5c-b9d2-09d979ff82ea",
      tags: "",
      mainImageId: "",
      createdAt: date,
    },
  });

  // initialize quill

  const DynamicQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

  // module for quill toolbar
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  async function onSubmit(values: CreateBlogFormSchema) {
    const { title, content, mainImageId, categoryId, tags } = values;

    console.log(values);

    const formData = {
      title,
      content,
      userId: "cm2x0th0b00008kcwlrfti706",
      mainImageId,
      categoryId: "cm2x0xuci00048kcwnrz5mtho",
      tags,
      createdAt: date ? date.toISOString() : null,
    };

    try {
      const response = await axios.post("http://localhost:3001/blog", formData);

      console.log("Blog created:", response.data); // Cek respons
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error submitting form:", error.response?.data); // Log kesalahan dari server
      } else {
        console.error("Unexpected error:", error);
      }
    }
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <section className="flex flex-col gap-4">
          {/* ===INPUT=== */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <span>Title</span>
                <FormControl>
                  <Input id="title" placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ===CONTENT=== */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <span>Contents</span>
                <FormControl>
                  <DynamicQuill modules={modules} {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <div className="flex flex-col gap-4 grow">
              {/* ===IMAGE=== */}
              <FormField
                control={form.control}
                name="mainImageId"
                render={({ field }) => (
                  <FormItem>
                    <span>Main Picture</span>
                    <FormControl>
                      <Input id="picture" type="file" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* ===IMAGE PREVIEW */}
              <Card className="h-full">
                <CardHeader>
                  <CardDescription>Main Image Preview</CardDescription>
                </CardHeader>
                <CardContent>Image</CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4 ">
              {/* ===CATEGORY=== */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <span>Categories</span>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a categories" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="d86430ea-6571-4a5c-b9d2-09d979ff82ea">
                          Category 1
                        </SelectItem>
                        <SelectItem value="category2">Category 2</SelectItem>
                        <SelectItem value="category3">Category 3</SelectItem>
                        <SelectItem value="category4">Category 4</SelectItem>
                        <SelectItem value="category5">Category 5</SelectItem>
                        <SelectItem value="category6">Category 6</SelectItem>
                        <SelectItem value="category7">Category 7</SelectItem>
                        <SelectItem value="category8">Category 8</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ===TAGS=== */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <span>Tags</span>
                    <FormControl>
                      <Input id="tags" placeholder="Tags" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* ===DATE=== */}
              <FormField
                control={form.control}
                name="createdAt"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <span>Choose Date Publish</span>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {date ? (
                                format(date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="submit"
                onClick={() => {
                  toast({ title: "Data Berhasil Terkirim" });
                }}
              >
                Submit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="outline">Save To Draft</Button>
        </section>
      </form>
    </Form>
  );
}

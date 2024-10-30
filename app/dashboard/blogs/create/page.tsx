"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import "react-quill-new/dist/quill.snow.css";

const createBlogFormSchema = z.object({
  title: z.string().min(3, {
    message: "Judul harus lebih dari 3 karakter!",
  }),
  content: z.string().min(10, {
    message: "Content harus lebih dari 10 karakter!",
  }),
  picture: z.string().optional(),
  category: z.string(),
  tags: z.string().optional(),
  date: z.date().optional(),
});

type CreateBlogFormSchema = z.infer<typeof createBlogFormSchema>;

export default function CreateBlogPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [error, setError] = React.useState<string | undefined>(undefined);

  // initialize quill
  const ReactQuill = useMemo(
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

  const form = useForm<CreateBlogFormSchema>({
    resolver: zodResolver(createBlogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: "",
      picture: "",
      date: date,
    },
  });

  async function onSubmit(values: CreateBlogFormSchema) {
    const { title, content, picture, category, tags } = values;
    console.log(values);
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
                  <ReactQuill
                    modules={modules}
                    style={{
                      height: "80%",
                    }}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <div className="flex flex-col gap-4 grow">
              {/* ===IMAGE=== */}
              <FormField
                control={form.control}
                name="picture"
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
                name="category"
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
                        <SelectItem value="politic">Politic</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="sport">Sport</SelectItem>
                        <SelectItem value="foord">Food</SelectItem>
                        <SelectItem value="culture">Culture</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="automotif">Automotif</SelectItem>
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
                name="date"
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

          <Button type="submit">Submit</Button>
          <Button variant="outline">Save To Draft</Button>
        </section>
      </form>
    </Form>
  );
}

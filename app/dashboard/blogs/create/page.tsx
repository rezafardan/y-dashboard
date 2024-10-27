"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
  picture: z.string(),
  tags: z.string(),
});

export default function CreateBlogPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      picture: "",
      tags: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <section className="grid grid-cols-[0.75fr_0.25fr] grid-rows-1 gap-4 py-2">
          <div className="h-full flex flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input id="title" placeholder="Title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <span>Contents</span>
                  <FormControl>
                    <ReactQuill modules={modules} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="h-full flex flex-col gap-4">
            <FormField
              control={form.control}
              name="picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="picture">Main Picture</FormLabel>
                  <FormControl>
                    <Input id="picture" type="file" {...field} />
                  </FormControl>
                  <FormDescription>upload images.</FormDescription>
                </FormItem>
              )}
            />

            <Label htmlFor="categories">Categories</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" id="categories">
                  Select Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Category 1</DropdownMenuItem>
                <DropdownMenuItem>Category 2</DropdownMenuItem>
                <DropdownMenuItem>Category 3</DropdownMenuItem>
                <DropdownMenuItem>Category 4</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="tags">Tags</FormLabel>
                  <FormControl>
                    <Input id="tags" placeholder="Tags" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <span>Choose Date Publish</span>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              id="date"
            />

            <Button type="submit">Submit</Button>
            <Button variant="outline">Save To Draft</Button>
          </div>
        </section>
      </form>
    </Form>
  );
}

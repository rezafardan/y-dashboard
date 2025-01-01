"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateBlogHTML } from "@/utils/generateBlogHTML";
import { Button } from "../ui/button";
import { Fullscreen } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface BlogPreviewProps {
  blog: any;
  disabled?: boolean;
}

const BlogPreviewDialog = ({ blog, disabled = false }: BlogPreviewProps) => {
  const content = useMemo(() => {
    if (!blog?.content) return "";
    try {
      return generateBlogHTML(blog.content);
    } catch (error) {
      console.error("Error in preview:", error);
      return "";
    }
  }, [blog?.content]);

  return (
    <Dialog>
      {/* TRIGGER BUTTON */}
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={disabled} className="flex gap-2">
          <Fullscreen className="h-4 w-4" />
          Preview
        </Button>
      </DialogTrigger>

      {/* DIALOG CONTAINER */}
      <DialogContent
        className="max-w-4xl max-h-[80vh] overflow-y-auto w-[90vw] rounded-md p-4 md:p-6"
        aria-describedby="preview-description"
      >
        {/* DIALOG HEADER */}
        <DialogHeader>
          {/* TITLE */}
          <DialogTitle>Blog Preview</DialogTitle>

          {/* DESCRIPTION */}
          <DialogDescription id="preview-description">
            Preview how your blog post will appear to readers. This is a draft
            view and can be edited before publishing.
          </DialogDescription>
        </DialogHeader>

        {/* CONTENT OF BLOG */}
        <Card className="m-0">
          {/* HEADER */}
          <CardHeader>
            {/* CATEGORY */}
            <Badge variant="outline" className="w-fit rounded mb-4">
              {blog?.category?.name || "No Category"}
            </Badge>

            {/* TITLE */}
            <CardTitle>{blog?.title || "Untitled Blog"}</CardTitle>

            {/* INFO */}
            <CardDescription>
              {/* INFO CONTAINER */}
              <div className="flex items-center gap-1 mt-2">
                {/* AVATAR */}
                <div>
                  <Avatar className="h-6 w-6 aspect-square">
                    <AvatarFallback className="rounded-lg">C</AvatarFallback>
                  </Avatar>
                </div>

                {/* NAME CREATOR */}
                <p className="text-[0.6rem]  md:text-xs">Creator Preview</p>

                <Separator orientation="vertical" className="h-3" />

                {/* DATE */}
                <p className="text-[0.6rem]  md:text-xs">
                  {blog?.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Not Available"}
                </p>

                <Separator orientation="vertical" className="h-3" />

                {/* TIME */}
                <p className="text-[0.6rem] md:text-xs">
                  {blog?.publishedAt
                    ? new Date(blog.publishedAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not Available"}
                </p>
              </div>
            </CardDescription>
            <Separator />
          </CardHeader>

          <CardContent>
            {/* COVER IMAGE */}
            {blog?.coverImageId ? (
              <div className="relative w-full aspect-video mb-4">
                <img
                  src={blog.coverImage?.filepath}
                  alt={blog.title || "Blog Image"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-64 flex items-center justify-center rounded-md bg-gray-100 mb-4">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}

            {/* CONTENT */}
            <div
              className="prose prose-sm md:prose-base lg:prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* TAG */}
            <div className="mt-8">
              {blog?.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {blog.tags.map((tag: any, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="mr-1 rounded"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPreviewDialog;

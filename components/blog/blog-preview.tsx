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
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={disabled} className="flex gap-2">
          <Fullscreen className="h-4 w-4" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl max-h-[80vh] overflow-y-auto w-[90vw] rounded-md"
        aria-describedby="preview-description"
      >
        <DialogHeader>
          <DialogTitle>Blog Preview</DialogTitle>
          <DialogDescription id="preview-description">
            Preview how your blog post will appear to readers. This is a draft
            view and can be edited before publishing.
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>{blog?.title || "Untitled Blog"}</CardTitle>
            <CardDescription>
              Category:{" "}
              <Badge variant="outline">
                {blog?.category?.name || "No Category"}
              </Badge>
            </CardDescription>
            <Separator />
          </CardHeader>
          <CardContent>
            {blog?.coverImageId ? (
              <div className="relative w-full aspect-video mb-4">
                <img
                  src={blog.coverImage?.filepath}
                  alt={blog.title || "Blog Image"}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="w-full h-64 flex items-center justify-center rounded-md bg-gray-100 mb-4">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}

            <div
              className="prose prose-sm md:prose-base lg:prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
          <CardFooter>
            <div className="flex flex-col md:flex-row justify-between w-full gap-4 text-sm text-gray-500">
              <div className="space-y-1">
                <p>Creator: {blog?.user?.username || "Preview"}</p>
                <p>Created: {new Date().toLocaleString()}</p>
                <p>
                  Published:{" "}
                  {blog?.publishedAt
                    ? new Date(blog.publishedAt).toLocaleString()
                    : "Not published"}
                </p>
              </div>
              {blog?.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag: any, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPreviewDialog;

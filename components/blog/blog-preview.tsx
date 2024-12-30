// BlogPreviewDialog.tsx
"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { generateHTML } from "@tiptap/html";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Code from "@tiptap/extension-code";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import HardBreak from "@tiptap/extension-hard-break";
import Dropcursor from "@tiptap/extension-dropcursor";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

interface BlogPreviewProps {
  blog: any;
}

const BlogPreviewDialog = ({ blog }: BlogPreviewProps) => {
  const output = useMemo(() => {
    if (!blog?.content) return null;
    return generateHTML(blog.content, [
      Document,
      Paragraph,
      Text,
      Heading,
      Bold,
      Italic,
      Underline,
      Strike,
      TextAlign,
      Blockquote,
      CodeBlock,
      Code,
      BulletList,
      OrderedList,
      ListItem,
      HardBreak,
      Dropcursor,
      Link,
      Image,
    ]);
  }, [blog?.content]);

  return (
    <Dialog>
      <DialogTrigger>Preview Blog</DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview Blog</DialogTitle>
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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`http://localhost:3001/${blog.coverImage?.filepath || ""}`}
                alt={blog.title || "Blog Image"}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center rounded-md bg-gray-100">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}

            <div
              className="prose-base mt-4 dark:prose-invert"
              dangerouslySetInnerHTML={output ? { __html: output } : undefined}
            />
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full text-sm text-gray-500">
              <div className="flex flex-col max-w-sm">
                <p>Creator: {blog?.user?.username}</p>
                <p>
                  Created At:{" "}
                  {blog?.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not Available"}
                </p>
                <p>Total Likes: {blog?.likeCount}</p>
                <p>Total Views: {blog?.viewCount}</p>
                <p>
                  Published Date:{" "}
                  {blog?.publishedAt
                    ? new Date(blog.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not Available"}
                </p>
              </div>

              <div>
                <p>
                  Tags:{" "}
                  {blog?.tags
                    ?.map((tag: { name: string }) => tag.name)
                    .join(", ") || "No Tags"}
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPreviewDialog;

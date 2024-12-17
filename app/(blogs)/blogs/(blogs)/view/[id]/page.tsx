"use client";

import React, { useMemo } from "react";

// COMPONENT
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useSWR from "swr";

import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
import { getBlogByIdService } from "@/services/blogServices";

interface Tag {
  name: string;
}

export default function ViewBlogPage() {
  const params = useParams(); // Gunakan useParams() untuk mendapatkan id
  const id = params?.id; // Pastikan id tersedia

  const fetcher = async () => {
    if (!id) return null;
    return getBlogByIdService(id); // Replace with your API service
  };

  const {
    data: blog,
    error,
    isLoading,
  } = useSWR(id ? `/blogs/${id}` : null, fetcher);

  // Pastikan pengecekan data dilakukan setelah hook dipanggil.
  const output = useMemo(() => {
    // Pastikan data blog sudah ada dan tidak sedang loading
    if (!blog?.content) {
      return null; // Jika data belum ada, return null tanpa melanjutkan proses generate
    }

    // Jika data sudah ada, generate HTML
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
  }, [blog?.content]); // Hanya memerlukan dependensi blog

  if (error) {
    return <p>Error fetching blog data: {error.message}</p>;
  }

  const json = blog?.content;

  // Menampilkan loading indicator saat data masih loading
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching blog data: {error.message}</p>;
  if (!blog) return <p>No content available...</p>;
  // Jika tidak ada output, tampilkan pesan bahwa data belum tersedia
  if (!output) {
    return <p>No content available...</p>; // Data atau konten belum ada
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Details</CardTitle>
        <CardDescription>
          Explore the full details of the selected blog.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Card className="lg:px-32">
          <CardHeader>
            <CardTitle>{blog?.title || "Untitled Blog"}</CardTitle>
            <CardDescription>
              Category:{" "}
              <Badge variant="outline">
                {blog?.category?.name || "No Category"}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Menampilkan gambar utama */}
            {blog?.coverImageId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`http://localhost:3001/${blog.coverImage?.filepath || ""}`}
                alt={blog.title || "Blog Image"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center rounded-md bg-gray-100">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}

            {/* Menampilkan konten blog */}
            <div
              className="prose-base mt-4 dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: output }} // Render the generated HTML
            />
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full text-sm text-gray-500">
              {/* Menampilkan jumlah like dan view */}

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
                  Tag:{" "}
                  {blog?.tags?.map((tag: Tag) => tag.name).join(", ") ||
                    "No Tags"}
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  );
}

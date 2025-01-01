"use client";

import React, { useMemo } from "react";

// COMPONENT
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, ChevronLeft, Copy, UserPen } from "lucide-react";

// SERVICE
import { getBlogByIdService } from "@/services/blogServices";
import useSWR from "swr";

// ROUTING
import { useParams, useRouter } from "next/navigation";

// UTILS PARSING JSON TO HTML
import { generateBlogHTML } from "@/utils/generateBlogHTML";

interface Tag {
  id: string;
  name: string;
}

export default function ViewBlogPage() {
  // ROUTER
  const router = useRouter();

  // GET PARAMS
  const { id } = useParams();

  // FETCH DATA BLOG
  const fetcherBlog = () => getBlogByIdService(id);

  const {
    data: blog,
    error,
    isLoading,
  } = useSWR(id ? `/blogs/${id}` : null, fetcherBlog);

  const blogContent = useMemo(() => {
    if (!blog?.content) {
      return "<p>No content available...</p>";
    }

    return generateBlogHTML(blog.content);
  }, [blog?.content]);

  const initials = blog?.user?.username
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase())
    .join("");

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <p>Error fetching blog data: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Details</CardTitle>
        <CardDescription>
          Explore the full details of the selected blog.
        </CardDescription>
        <Separator />
      </CardHeader>

      <CardContent className="p-0 flex flex-col gap-4 md:gap-0 md:flex-row overflow-visible">
        {/* MAIN CONTENT */}
        <main className="w-full md:w-2/3 pl-4 pr-4 md:pr-2">
          <Card>
            {/* Konten utama blog */}
            <CardHeader>
              {/* CATEGORY */}
              <Badge variant="secondary" className="w-fit rounded mb-2">
                {blog?.category?.name || "No Category"}
              </Badge>

              {/* TITLE */}
              <CardTitle>{blog?.title || "Untitled Blog"}</CardTitle>

              {/* INFO */}
              <CardDescription>
                <div className="flex items-center gap-1 mt-2">
                  <div>
                    <Avatar className="h-6 w-6 aspect-square">
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${blog?.user?.profileImage}`}
                        alt={blog?.user?.username}
                      />
                      <AvatarFallback className="rounded-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-xs">{blog?.user?.username}</p>
                  <Separator orientation="vertical" className="h-3" />
                  <p className="text-xs">
                    {blog?.publishedAt
                      ? new Date(blog.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Not Available"}
                  </p>
                  <Separator orientation="vertical" className="h-3" />
                  <p className="text-xs">
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
              {/* Cover image */}
              {blog?.coverImageId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`http://localhost:3001/${
                    blog.coverImage?.filepath || ""
                  }`}
                  alt={blog.title || "Blog Image"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center rounded-md bg-gray-100">
                  <p className="text-gray-500">No Image Available</p>
                </div>
              )}

              {/* Blog content */}
              <div
                className="prose-base mt-4 dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: blogContent }}
              />

              <div className="mt-8">
                {blog?.tags?.map((tag: Tag) => (
                  <Badge key={tag.id} className="mr-1 rounded">
                    {tag.name}
                  </Badge>
                )) || "No Tags"}
              </div>
            </CardContent>
          </Card>
        </main>

        {/* ASIDE */}
        <aside className="w-full md:w-1/3 h-auto pl-4 md:pl-2 pr-4">
          <Card className="p-4">
            {/* Komentar, statistik, log aktivitas, dan lainnya */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Komentar</h3>
              <ul>
                {blog?.comments?.map((comment: any) => (
                  <li key={comment.id} className="mb-3">
                    <p className="font-bold text-sm">
                      {comment.user?.username}
                    </p>
                    <p className="text-sm">{comment.content}</p>
                  </li>
                )) || <p>Tidak ada komentar.</p>}
              </ul>
            </div>

            {/* Statistik */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Statistik Blog</h3>
              <ul>
                <li>Total Views: {blog?.views || 0}</li>
                <li>Total Comments: {blog?.comments?.length || 0}</li>
                <li>Total Shares: {blog?.shares || 0}</li>
              </ul>
            </div>

            {/* Log aktivitas */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Log Aktivitas</h3>
              <ul>
                <li>
                  Dibuat pada: {new Date(blog?.createdAt).toLocaleString()}
                </li>
                <li>
                  Terakhir diedit oleh: {blog?.lastEditedBy || "Unknown"} pada{" "}
                  {new Date(blog?.updatedAt).toLocaleString()}
                </li>
              </ul>
            </div>

            {/* Link blog */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Link Blog</h3>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  readOnly
                  value={`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${blog?.slug}`}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${blog?.slug}`
                    );
                    alert("Link copied to clipboard!");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </aside>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft />
          Back
        </Button>
        <Button onClick={() => router.push(`/blogs/edit/${id}`)}>
          <UserPen />
          Edit Blog
        </Button>
      </CardFooter>
    </Card>
  );
}

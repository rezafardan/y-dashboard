"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getAllBlogsService } from "@/services/blogServices";
import useSWR from "swr";
import axios from "axios";
import { getBlogData } from "@/schema/dataSchema";
import { LoadingButton } from "@/components/ui/loading-button";

// {
//   id: 'cm31sujsr0006zw0x8dpd7j31',
//   title: 'blog 1',
//   content: 'content 1',
//   status: 'DRAFT',
//   viewCount: 0,
//   likeCount: 0,
//   allowComment: true, /
//   publishedAt: 2024-11-03T16:21:17.880Z,
//   createdAt: 2024-11-03T16:21:17.880Z,
//   updatedAt: 2024-11-03T16:21:17.883Z,
//   deletedAt: null,
//   mainImageId: null,
//   userId: 'cm31sst3m0002zw0xn7p6c7ua',
//   categoryId: 'cm31stt5w0004zw0xyqj9n6if'
// }

export default function BlogPage() {
  const fetcher = () => getAllBlogsService();
  const { data, error, isLoading } = useSWR("/blog", fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <>
      <Table>
        <TableCaption>A list of blog recent</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date Published</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
          {data!.map((blog: any) => {
            return (
              <TableRow key={blog.id}>
                <TableCell>IMAGE</TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.user.username}</TableCell>
                <TableCell>{blog.status}</TableCell>
                <TableCell>{blog.category.name}</TableCell>
                <TableCell>
                  {new Date(blog.publishedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(blog.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-4">
                    Edit
                  </Button>
                  <LoadingButton variant="destructive">Delete</LoadingButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody></TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}

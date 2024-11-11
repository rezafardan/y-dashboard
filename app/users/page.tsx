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
import { getAllUserService } from "@/services/userServices";
import useSWR from "swr";
import { LoadingButton } from "@/components/ui/loading-button";
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@radix-ui/react-toast";
import { useEffect } from "react";

export default function UsersPage() {
  const { toast } = useToast();
  const fetcher = () => getAllUserService();
  const { data, error, isLoading } = useSWR("/user", fetcher, {
    revalidateOnFocus: false, // Prevent re-fetching when the window regains focus
    revalidateOnReconnect: false, // Prevent re-fetching when reconnecting
    onErrorRetry: () => {}, // Disable retries on error
  });

  useEffect(() => {
    if (error?.response?.status === 403) {
      const errorMessage = error?.response?.data?.message;
      toast({
        description:
          errorMessage || "You do not have permission to perform this action.",
        action: <ToastClose />,
        duration: 8000,
        variant: "destructive",
      });
    }
  }, [error, toast]); // Only trigger when `error` changes

  // Error handling and loading state
  if (isLoading) return <p>Loading...</p>;

  if (error) {
    const errorMessage =
      error?.response?.data?.message || "An unexpected error occurred.";
    return <p>{errorMessage}</p>;
  }

  return (
    <>
      <Table>
        <TableCaption>A list of user recent</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
          {data!.map((item: any) => {
            return (
              <TableRow key={item.id}>
                <TableCell>IMAGE</TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleString()}
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

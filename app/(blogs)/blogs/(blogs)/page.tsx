"use client";

import React, { useState } from "react";

// COMPONENT
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CircleChevronLeft,
  CircleChevronRight,
  MoreHorizontal,
  Pencil,
  Trash,
  View,
} from "lucide-react";

// TOAST
import { useToast } from "@/hooks/use-toast";

// DATA TABLE
import useSWR, { mutate } from "swr";
import { MainTable } from "@/components/main-table/main-table";
import { DataTableColumnHeader } from "@/components/main-table/data-table-column-header";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

// SERVICE
import { deleteBlogService, getAllBlogsService } from "@/services/blogServices";

// MODELS
import { BlogDataResponse, User } from "@/models/dataSchema";
import { ApiErrorResponse } from "@/models/error";

// ROUTING
import { useRouter } from "next/navigation";

// TABLE HEADER
const columns: ColumnDef<BlogDataResponse>[] = [
  // TITLE
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="max-w-40 truncate md:max-w-sm">
        {row.getValue("title")}
      </div>
    ),
  },

  // STATUS
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status");

      if (status === "DRAFT") {
        return <Badge variant="destructive">{status}</Badge>;
      }

      if (status === "PUBLISH") {
        return <Badge variant="default">{status}</Badge>;
      }

      return <Badge variant="outline">{row.getValue("status")}</Badge>;
    },
  },

  // CATEGORY NAME
  {
    accessorKey: "category.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.original.category?.name || "No Category";
      return <div>{category}</div>;
    },
  },

  // CREATOR
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Creator" />
    ),
    cell: ({ row }) => {
      const user = row.getValue("user") as User;
      return <div>{user.username}</div>;
    },
  },

  // CREATED AT
  {
    accessorKey: "publishedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published At" />
    ),
    cell: ({ row }) => {
      const publishedAt = row.getValue("publishedAt");
      const status = row.getValue("status");

      if (status === "DRAFT" || !publishedAt) {
        return <div>DRAFT</div>;
      }

      const formattedDate = new Date(publishedAt as string | number);

      return (
        <div>
          {formattedDate.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}{" "}
          {formattedDate.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },

  // VIEW COUNT
  {
    accessorKey: "viewCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Views" />
    ),
    cell: ({ row }) => <div>{row.getValue("viewCount")}</div>,
  },

  // ACTIONS
  {
    id: "actions",
    cell: ({ row }) => {
      const blog = row.original;
      return <BlogActionCell blog={blog} />;
    },
  },
];

const BlogActionCell = ({ blog }: { blog: BlogDataResponse }) => {
  // ROUTER
  const router = useRouter();

  // TOAST
  const { toast } = useToast();

  // STATE ALERT DIALOG
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // FUNC DELETE BUTTON
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  // CANCEL BUTTON
  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  // FUNC CONFIRM DELETE AFTER ALERT DIALOG
  const handleDeleteConfirm = async () => {
    try {
      // SERVICE API
      const response = await deleteBlogService(blog.id);

      // TOAST
      toast({
        description: response.message,
        duration: 4000,
      });

      // REFRESH TABLE
      mutate((prevBlogs: BlogDataResponse[] | undefined) => {
        if (Array.isArray(prevBlogs)) {
          return prevBlogs.filter((item) => item.id !== blog.id);
        }
        return [];
      });
    } catch (error) {
      // ERROR HANDLER
      const apiError = error as { response?: { data?: ApiErrorResponse } };
      const errorMessage =
        apiError.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "An unexpected error occurred");

      // TOAST
      toast({
        description: errorMessage,
        duration: 4000,
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 border">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            router.push(`/blogs/view/${blog.id}`);
          }}
        >
          <View />
          View Blog Detail
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            router.push(`/blogs/edit/${blog.id}`);
          }}
        >
          <Pencil />
          Edit Blog
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDeleteClick}>
          <Trash />
          Delete Blog
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* ALERT DIALOG */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Blog Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog? This action is
              irreversible and will permanently remove the blog and its
              associated data from our servers. Please proceed with caution.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
};

export default function BlogsPage() {
  // DATA FECTHING
  const { data: blogs, error } = useSWR<BlogDataResponse[]>(
    "/api/blog",
    getAllBlogsService
  );

  // STATE SORTING DATA
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // STATE COLUMN FILTER
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data: blogs ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  if (error) {
    let errorMessage = "An unexpected error occured";

    if (error?.response) {
      errorMessage =
        error.response.data?.message || "An error occured while fetching data.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return <div className="text-red-500 text-center mt-20">{errorMessage}</div>;
  }
  return (
    <div className="w-full">
      {/* SEARCH */}
      <div className="flex items-center mb-4">
        <Input
          placeholder="Search title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      {/* DATA TABLE */}
      <MainTable table={table} columns={columns.length} />

      {/* PAGINATION */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <CircleChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <CircleChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

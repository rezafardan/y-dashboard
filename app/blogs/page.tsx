"use client";

import { DataTableColumnHeader } from "@/components/main-table/data-table-column-header";
import { MainTable } from "@/components/main-table/main-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { blogDataResponseApi } from "@/schema/dataSchema";
import { deleteBlogService, getAllBlogsService } from "@/services/blogServices";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import React from "react";
import useSWR from "swr";

const columns: ColumnDef<blogDataResponseApi>[] = [
  // Title
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="max-w-32 truncate sm:max-w-72 md:max-w-[31rem]">
        {row.getValue("title")}
      </div>
    ),
  },

  // Status
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("status")}</Badge>
    ),
  },

  // Category Name
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

  // Allow Comment
  // {
  //   accessorKey: "allowComment",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Allow Comment
  //       <ArrowUpDown />
  //     </Button>
  //   ),
  //   cell: ({ row }) => <div>{row.getValue("allowComment") ? "Yes" : "No"}</div>,
  // },

  // Like Count
  // {
  //   accessorKey: "likeCount",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Likes
  //       <ArrowUpDown />
  //     </Button>
  //   ),
  //   cell: ({ row }) => <div>{row.getValue("likeCount")}</div>,
  // },

  // View Count

  // Published At
  // {
  //   accessorKey: "publishedAt",
  //   header: "Published At",
  //   cell: ({ row }) => {
  //     const publishedAt = row.getValue("publishedAt");
  //     return (
  //       <div>
  //         {publishedAt ? new Date(publishedAt).toLocaleString() : "Draft"}
  //       </div>
  //     );
  //   },
  // },

  // Updated At
  // {
  //   accessorKey: "updatedAt",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Updated At
  //       <ArrowUpDown />
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const updatedAt = new Date(row.getValue("updatedAt"));
  //     return (
  //       <div>
  //         {updatedAt.toLocaleDateString("id-ID", {
  //           day: "2-digit",
  //           month: "long",
  //           year: "numeric",
  //         })}{" "}
  //         {updatedAt.toLocaleTimeString("id-ID", {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         })}
  //       </div>
  //     );
  //   },
  // },

  // Tags (Array)
  // {
  //   accessorKey: "tags",
  //   header: "Tags",
  //   cell: ({ row }) => {
  //     const tags = row.getValue("tags");
  //     return <div>{tags.length ? tags.join(", ") : "No Tags"}</div>;
  //   },
  // },

  // isUserActive
  // {
  //   accessorKey: "isUserActive",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Creator Status" />
  //   ),
  //   cell: ({ row }) => (
  //     <div>{row.getValue("isUserActive") ? "Active" : "Inactive"}</div>
  //   ),
  // },

  // User ID
  {
    accessorKey: "user.username", // Mengakses username dari objek user
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username Creator" />
    ),
    cell: ({ row }) => {
      const username = row.original.user?.username || "No Username";
      return <div>{username}</div>;
    },
  },

  // Created At
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));
      return (
        <div>
          {createdAt.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}{" "}
          {createdAt.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },

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
    enableHiding: false,
    cell: ({ row }) => {
      const blog = row.original;

      const handleDelete = async () => {
        if (window.confirm("Are you sure yo want to delete this blog ?")) {
          try {
            await deleteBlogService(blog.id);
            alert("Blog deleted successfully!");
          } catch (error) {
            console.error(error);
            alert("Error deleting blog.");
          }
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(blog.id)}
            >
              Copy Blog ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              Delete Blog
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function BlogsListPage() {
  const {
    data: blogs,
    error,
    // mutate,
  } = useSWR<blogDataResponseApi[]>("/api/blog", getAllBlogsService);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: blogs ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
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
      <div className="flex items-center mb-4">
        <Input
          placeholder="Filter title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="space-y-4">
          <MainTable table={table} columns={columns.length} />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

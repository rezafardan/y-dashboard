// "id": "cm3jg9y2z0003o20f0leezvi3",
// "name": "MUSIC",
// "description": "DESCRIPTION OF MUSIC CATEGORY",
// "user": {
//     "id": "cm3jb3f36000055qq6fckrve1",
//     "username": "administrator",
//     "email": "administrator@email.com",
//     "passwordHash": "$2b$10$23gm2HZrtBOY1Kj8P4vZJOeeX4mMSNhfnKRgCKYk61o1Git1rKjZy",
//     "role": "ADMINISTRATOR",
//     "profileImage": "profileImageAdministrator.jpg",
//     "createdAt": "2024-11-15T22:24:09.762Z",
//     "updatedAt": "2024-11-15T22:24:09.762Z",
//     "deletedAt": null
// },
// "createdAt": "2024-11-16T00:49:12.393Z",
// "updatedAt": "2024-11-16T00:49:12.393Z",
// "isUserActive": true

"use client";

import { MainTable } from "@/components/main-table/main-table";
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
import { Category } from "@/schema/dataSchema";
import {
  deleteCategoryService,
  getAllCategoriesService,
} from "@/services/categoryServices";
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

// "id": "cm3jg9y2z0003o20f0leezvi3",
// "name": "MUSIC",
// "description": "DESCRIPTION OF MUSIC CATEGORY",
// "user": {
//     "id": "cm3jb3f36000055qq6fckrve1",
//     "username": "administrator",
//     "email": "administrator@email.com",
//     "passwordHash": "$2b$10$23gm2HZrtBOY1Kj8P4vZJOeeX4mMSNhfnKRgCKYk61o1Git1rKjZy",
//     "role": "ADMINISTRATOR",
//     "profileImage": "profileImageAdministrator.jpg",
//     "createdAt": "2024-11-15T22:24:09.762Z",
//     "updatedAt": "2024-11-15T22:24:09.762Z",
//     "deletedAt": null
// },
// "createdAt": "2024-11-16T00:49:12.393Z",
// "updatedAt": "2024-11-16T00:49:12.393Z",
// "isUserActive": true

const columns: ColumnDef<Category>[] = [
  // Title
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },

  // Status
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Status
  //       <ArrowUpDown />
  //     </Button>
  //   ),
  //   cell: ({ row }) => <div>{row.getValue("status")}</div>,
  // },

  // Category Name
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Description
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const description = row.original.description || "No Description";
      return <div>{description}</div>;
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

  // Created At
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown />
      </Button>
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

  // User ID
  // {
  //   accessorKey: "user.username", // Mengakses username dari objek user
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Username Creator
  //       <ArrowUpDown />
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const username = row.original.user?.username || "No Username";
  //     return <div>{username}</div>;
  //   },
  // },

  // isUserActive
  // {
  //   accessorKey: "isUserActive",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       User Active
  //       <ArrowUpDown />
  //     </Button>
  //   ),
  //   cell: ({ row }) => (
  //     <div>{row.getValue("isUserActive") ? "Active" : "Inactive"}</div>
  //   ),
  // },

  //   {
  //     accessorKey: "user.username",
  //     header: ({ column }) => (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Views
  //         <ArrowUpDown />
  //       </Button>
  //     ),
  //     cell: ({ row }) => <div>{row.getValue("user.username")}</div>,
  //   },

  // ACTIONS
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original;

      const handleDelete = async () => {
        if (window.confirm("Are you sure yo want to delete this category ?")) {
          try {
            await deleteCategoryService(category.id);
            alert("Category deleted successfully!");
          } catch (error) {
            console.error(error);
            alert("Error deleting category.");
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
              onClick={() => navigator.clipboard.writeText(category.id)}
            >
              Copy Category ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function CategorysListPage() {
  const {
    data: category,
    error,
    // mutate,
  } = useSWR<Category[]>("/api/category", getAllCategoriesService);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: category ?? [],
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
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
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

      <MainTable table={table} columns={columns.length} />

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

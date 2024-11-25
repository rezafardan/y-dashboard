"use client";

import React from "react";

// COMPONENT
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

// DATA TABLE
import useSWR from "swr";
import { MainTable } from "@/components/main-table/main-table";
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
import { DataTableColumnHeader } from "@/components/main-table/data-table-column-header";

// SERVICE
import {
  deleteCategoryService,
  getAllCategoriesService,
} from "@/services/categoryServices";

// SCHEMA
import { Category } from "@/schema/dataSchema";
import { useToast } from "@/hooks/use-toast";

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
  // CATEGORY NAME
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },

  // DESCRIPTION
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.original.description || "No Description";
      return <div>{description}</div>;
    },
  },

  // CREATED AT
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

  // CREATEOR
  {
    accessorKey: "user.username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Creator" />
    ),
    cell: ({ row }) => <div>{row.getValue("user.username")}</div>,
  },

  // ACTIONS
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original;

      const { toast } = useToast();

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
          placeholder="Search category..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <MainTable table={table} columns={columns.length} />

      <div className="flex items-center justify-end space-x-2 py-4">
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

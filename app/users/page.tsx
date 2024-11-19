"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
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

import { userDataResponseApi } from "@/schema/dataSchema";
import { getAllUserService, deleteUserService } from "@/services/userServices";
import useSWR from "swr";
import { MainTable } from "@/components/main-table/main-table";

const columns: ColumnDef<userDataResponseApi>[] = [
  // PROFILE IMAGE
  {
    accessorKey: "profileImage", // Pastikan field ini ada pada data user
    header: "Profile Image",
    cell: ({ row }) => {
      const profileImage = row.getValue("profileImage");
      return (
        <div>
          {profileImage ? (
            <img
              src={profileImage as string} // URL gambar profil
              alt="Profile"
              width={40} // Lebar gambar
              height={40} // Tinggi gambar
              className="rounded-full" // Mengatur sudut gambar menjadi bulat
            />
          ) : (
            <span>No Profile Image</span>
          )}
        </div>
      );
    },
  },
  // USERNAME
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },

  // EMAIL
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },

  // ROLE
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
  },

  // CREATED AT
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

  // ACTIONS
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this user?")) {
          try {
            await deleteUserService(user.id);
            alert("User deleted successfully!");
          } catch (error) {
            alert("Error deleting user.");
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
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function DataTableDemo() {
  const {
    data: users,
    error,
    mutate,
  } = useSWR<userDataResponseApi[]>("/api/users", getAllUserService);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: users ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  if (error) {
    // Ambil pesan error
    let errorMessage = "An unexpected error occurred";

    // Cek jika error adalah instance dari AxiosError
    if (error?.response) {
      // Jika error.response ada, kita coba akses message dari response API
      errorMessage =
        error.response.data?.message ||
        "An error occurred while fetching data.";
    } else if (error instanceof Error) {
      // Jika bukan axios, kita gunakan message dari error object
      errorMessage = error.message;
    }

    return <div className="text-red-500 text-center mt-20">{errorMessage}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
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

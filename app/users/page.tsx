"use client";

import React, { useState } from "react";

// COMPONENT
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { MoreHorizontal } from "lucide-react";

// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";

// DATA TABLE
import useSWR, { mutate } from "swr";
import { MainTable } from "@/components/main-table/main-table";
import { DataTableColumnHeader } from "@/components/main-table/data-table-column-header";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// SERVICE
import {
  getAllUserService,
  softDeleteUserService,
  permanentDeleteUserService,
  restoreSoftDeleteUserService,
} from "@/services/userServices";

// SCHEMA
import { UserDataResponse } from "@/schema/dataSchema";
import { ApiErrorResponse } from "@/schema/error";
import { useRouter } from "next/navigation";

// TABLE HEADER
const columns: ColumnDef<UserDataResponse>[] = [
  // PROFILE IMAGE
  {
    accessorKey: "profileImage",
    header: "Profile Image",
    cell: ({ row }) => {
      const profileImage = row.getValue("profileImage");
      const userName = row.getValue("username");

      if (typeof userName !== "string") {
        return null;
      }

      const initials = userName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("");

      return (
        <div>
          <Avatar className="h-10 w-10">
            {profileImage ? (
              <AvatarImage
                src={`http://localhost:3001/${profileImage}`} // CHANGE URL API ON PRODUCTION
                alt="Profile"
              />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
        </div>
      );
    },
  },

  // USERNAME
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },

  // EMAIL
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },

  // ROLE
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
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

  // USER STATUS
  {
    accessorKey: "deletedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Status" />
    ),
    cell: ({ row }) => {
      const deletedAt = row.getValue("deletedAt");
      const status = deletedAt ? "Inactive" : "Active";
      const variant = deletedAt ? "destructive" : "default";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },

  // ACTIONS
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return <UserActionCell user={user} />;
    },
  },
];

const UserActionCell = ({ user }: { user: UserDataResponse }) => {
  const router = useRouter();

  // TOAST
  const { toast } = useToast();

  // STATE ALERT DIALOG
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // STATE DELETE SOFT OR PERMANENT
  const [deleteType, setDeleteType] = useState<"soft" | "permanent">("soft");

  // STATE DATA USER DELETE
  const [userToDelete, setUserToDelete] =
    React.useState<UserDataResponse | null>(null);

  // FUNC SOFT DELETE BUTTON
  const handleSoftDeleteClick = (user: UserDataResponse) => {
    setUserToDelete(user);
    setDeleteType("soft");
    setShowDeleteDialog(true);
  };

  // FUNC PERMANENT DELETE BUTTON
  const handlePermanentDeleteClick = (user: UserDataResponse) => {
    setUserToDelete(user);
    setDeleteType("permanent");
    setShowDeleteDialog(true);
  };

  // CANCEL BUTTON
  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  // FUNC RESTORE USER SOFT DELETE
  const handleRestoreClick = async (user: UserDataResponse) => {
    try {
      // SERVICE API
      const response = await restoreSoftDeleteUserService(user.id);

      // TOAST
      toast({
        description: response.message,
        action: <ToastClose />,
        duration: 4000,
      });

      // AUTO REFRESH AFTER ACTIONS
      mutate((prevUsers: UserDataResponse[] | undefined) => {
        if (Array.isArray(prevUsers)) {
          return prevUsers.map((u) =>
            u.id === user.id ? { ...u, status: "active" } : u
          );
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
        action: <ToastClose />,
        duration: 4000,
        variant: "destructive",
      });
    }
  };

  // FUNC CONFIRM DELETE AFTER ALERT DIALOG
  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        let response;
        if (deleteType === "soft") {
          // SERVICE API
          response = await softDeleteUserService(userToDelete.id);
        } else {
          // SERVICE API
          response = await permanentDeleteUserService(userToDelete.id);
        }

        // TOAST
        toast({
          description: response.message,
          action: <ToastClose />,
          duration: 4000,
        });

        // REFRESH TABLE
        mutate((prevUsers: UserDataResponse[] | undefined) => {
          if (Array.isArray(prevUsers)) {
            if (deleteType === "permanent") {
              return prevUsers.filter((user) => user.id !== userToDelete.id);
            }
            return prevUsers.map((user) =>
              user.id === userToDelete.id
                ? { ...user, status: "inactive" }
                : user
            );
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
          action: <ToastClose />,
          duration: 4000,
          variant: "destructive",
        });
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
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            router.push(`/users/view/${user.id}`);
          }}
        >
          View Detail
        </DropdownMenuItem>
        {user.deletedAt !== null && (
          <DropdownMenuItem onClick={() => handleRestoreClick(user)}>
            Restore User
          </DropdownMenuItem>
        )}

        {user.deletedAt !== null ? null : (
          <DropdownMenuItem onClick={() => handleSoftDeleteClick(user)}>
            Soft Delete User
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => handlePermanentDeleteClick(user)}>
          Permanent Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* ALERT DIALOG */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteType === "soft"
                ? "Soft Delete Confirmation"
                : "Permanent Delete Confirmation"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteType === "soft" ? (
                <>This action will change the user status to inactive.</>
              ) : (
                <>
                  This action cannot be undone. It will permanently delete the
                  user and remove their data from our servers.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              {deleteType === "soft"
                ? "Confirm Soft Delete"
                : "Confirm Permanent Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
};

export default function UsersPage() {
  // DATA FECTHING
  const { data: users, error } = useSWR<UserDataResponse[]>(
    "/api/user",
    getAllUserService
  );

  // STATE SORTING DATA
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // STATE COLUMN FILTER
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data: users ?? [],
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
    let errorMessage = "An unexpected error occurred";

    if (error?.response) {
      errorMessage =
        error.response.data?.message ||
        "An error occurred while fetching data.";
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
          placeholder="Search username..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
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

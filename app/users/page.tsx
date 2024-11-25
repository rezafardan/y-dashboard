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
  VisibilityState,
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

      const { toast } = useToast();
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [deleteType, setDeleteType] = useState<"soft" | "permanent">(
        "soft"
      );
      const [userToDelete, setUserToDelete] =
        React.useState<UserDataResponse | null>(null);

      const handleSoftDeleteClick = (user: UserDataResponse) => {
        setUserToDelete(user);
        setDeleteType("soft");
        setShowDeleteDialog(true);
      };

      const handlePermanentDeleteClick = (user: UserDataResponse) => {
        setUserToDelete(user);
        setDeleteType("permanent");
        setShowDeleteDialog(true);
      };

      const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
      };

      const handleRestoreClick = async (user: UserDataResponse) => {
        try {
          const response = await restoreSoftDeleteUserService(user.id);

          toast({
            description: response.message,
            action: <ToastClose />,
            duration: 4000,
          });

          mutate((prevUsers: UserDataResponse[] | undefined) => {
            if (Array.isArray(prevUsers)) {
              return prevUsers.map((u) =>
                u.id === user.id ? { ...u, status: "active" } : u
              );
            }
            return [];
          });
        } catch (error) {
          toast({
            description: "Error restoring user",
            action: <ToastClose />,
            duration: 4000,
            variant: "destructive",
          });
        }
      };

      const handleDeleteConfirm = async () => {
        if (userToDelete) {
          try {
            let response;
            if (deleteType === "soft") {
              response = await softDeleteUserService(userToDelete.id);
            } else {
              response = await permanentDeleteUserService(userToDelete.id);
            }

            toast({
              description: response.message,
              action: <ToastClose />,
              duration: 4000,
            });

            mutate((prevUsers: UserDataResponse[] | undefined) => {
              if (Array.isArray(prevUsers)) {
                if (deleteType === "permanent") {
                  return prevUsers.filter(
                    (user) => user.id !== userToDelete.id
                  );
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
            console.log(error);
            toast({
              description: `Error performing ${deleteType} delete`,
              action: <ToastClose />,
              duration: 4000,
              variant: "destructive",
            });
          } finally {
            setShowDeleteDialog(false);
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

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
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
                      This action cannot be undone. It will permanently delete
                      the user and remove their data from our servers.
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
    },
  },
];

export default function UsersPage() {
  const { data: users, error } = useSWR<UserDataResponse[]>(
    "/api/users",
    getAllUserService
  );

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

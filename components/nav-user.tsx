"use client";

import { UserPen, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

import { useRouter } from "next/navigation";
import { logoutService } from "@/services/authServices";
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "./ui/toast";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { ApiErrorResponse } from "@/schema/error";

export function NavUser({
  user,
}: {
  user: {
    username: string;
    role: string;
    profileImage: string;
  };
}) {
  const { logoutUser } = useAuth();
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { toast } = useToast();

  const initials = user.username
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const handleLogout = async () => {
    try {
      const response = await logoutService();
      const successMessage = response.message;

      toast({
        description: successMessage,
        action: <ToastClose />,
        duration: 2000,
      });

      logoutUser();
      router.push("/login");
    } catch (error) {
      // ERROR HANDLER
      const apiError = error as { response?: { data?: ApiErrorResponse } };

      const errorMessage =
        apiError.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "An unexpected error occurred");

      toast({
        description: errorMessage,
        action: <ToastClose />,
        duration: 4000,
        variant: "destructive",
      });

      console.error("An error occured during logout: ", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative h-8 w-8 rounded-full aspect-square"
        >
          <Avatar className="h-8 w-8 aspect-square">
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${user.profileImage}`}
              alt={user.username}
            />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${user.profileImage}`}
                alt={user.username}
              />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.username}</span>
              <span className="truncate text-xs">{user.role}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserPen />
            Edit Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

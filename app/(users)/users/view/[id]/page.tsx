"use client";

import { useEffect, useState } from "react";

// COMPONENT
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, UserPen } from "lucide-react";

// SERVICE
import { getUserByIdService } from "@/services/userServices";

// TOAST
import { useToast } from "@/hooks/use-toast";

// ROUTING
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

// MODELS
import { UserDataResponse } from "@/models/dataSchema";
import { ApiErrorResponse } from "@/models/error";

export default function ViewUserPage() {
  // ROUTER
  const router = useRouter();

  // GET PARAMS
  const { id } = useParams();

  // TOAST
  const { toast } = useToast();

  // FETCH USER DATA
  const [userData, setUserData] = useState<UserDataResponse | null>(null);
  const fetchUserData = async () => {
    try {
      const result = await getUserByIdService(id);

      setUserData(result);
    } catch (error) {
      // ERROR HANDLER
      const apiError = error as { response?: { data?: ApiErrorResponse } };
      const errorMessage =
        apiError.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "An unexpected error occurred");

      // TOAST MESSAGE FROM API
      toast({
        description: errorMessage,
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile Detail</CardTitle>
        <CardDescription>
          Review and manage detailed user information.
        </CardDescription>
        <Separator />
      </CardHeader>

      <CardContent className="md:flex gap-6 w-full">
        {/* PROFILE IMAGE */}
        <div className="flex items-center justify-center md:justify-normal mt-2 mb-4">
          {userData?.profileImage ? (
            <div className="relative w-60 h-60 aspect-square rounded-full overflow-hidden border dark:border-secondary">
              <img
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${userData?.profileImage}`}
                alt={userData?.username || "User Image"}
              />
            </div>
          ) : (
            <div className="w-60 h-60 flex aspect-square items-center justify-center rounded-full bg-muted dark:bg-background">
              <p className="text-sm text-muted-foreground">
                No Profile Picture
              </p>
            </div>
          )}
        </div>

        {/* USER DATA */}
        <div className="space-y-4 md:w-full">
          <div>
            <Label>Username</Label>
            <Input value={userData?.username || "Unavailable"} disabled />
          </div>
          <div>
            <Label>Full Name</Label>
            <Input value={userData?.fullname || "Unavailable"} disabled />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={userData?.email || "Unavailable"} disabled />
          </div>
          <div>
            <Label>Role</Label>
            <Input value={userData?.role || "Unavailable"} disabled />
          </div>
        </div>
      </CardContent>

      {/* BUTTON */}
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft />
          Back
        </Button>
        <Button onClick={() => router.push(`/users/edit/${id}`)}>
          <UserPen />
          Edit User
        </Button>
      </CardFooter>
    </Card>
  );
}

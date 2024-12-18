"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getUserByIdService } from "@/services/userServices";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";

export default function ViewUserPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const fetcher = async () => {
    if (!id) return null;
    return getUserByIdService(id);
  };

  const {
    data: user,
    error,
    isLoading,
  } = useSWR(id ? `/user/${id}` : null, fetcher);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">
          Error fetching user data: {error.message}
        </p>
      </div>
    );
  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">No content available...</p>
      </div>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>
          View detailed information about the selected user.
        </CardDescription>
        <Separator />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Image */}
        <div className="flex justify-center">
          {user?.profileImage ? (
            <div className="relative w-48 h-48 rounded-full overflow-hidden border border-gray-300">
              <img
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${user.profileImage}`}
                alt={user.username || "User Image"}
              />
            </div>
          ) : (
            <div className="w-48 h-48 flex items-center justify-center rounded-full bg-gray-100 border border-gray-300">
              <p className="text-gray-500">No Image Available</p>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="space-y-4">
          <div>
            <label>Username</label>
            <Input
              value={user.username || "Not Found"}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <label>Full Name</label>
            <Input
              value={user.fullname || "Not Found"}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <label>Email</label>
            <Input
              value={user.email || "Not Found"}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <label>Role</label>
            <Input value={user.role || "Not Found"} disabled className="mt-1" />
          </div>
        </div>
      </CardContent>

      {/* Buttons */}
      <CardFooter className="flex justify-between mt-4">
        <Button
          variant="outline"
          className="px-6"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button className="px-6" disabled>
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}

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
import { getUserByIdService } from "@/services/userServices";
import Image from "next/image";
import { useParams } from "next/navigation";
import useSWR from "swr";

export default function EditUserPage() {
  const params = useParams(); // Gunakan useParams() untuk mendapatkan id
  const id = params?.id; // Pastikan id tersedia

  const fetcher = async () => {
    if (!id) return null;
    return getUserByIdService(id); // Replace with your API service
  };

  const {
    data: user,
    error,
    isLoading,
  } = useSWR(id ? `/user/${id}` : null, fetcher);
  console.log(user);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching blog data: {error.message}</p>;
  if (!user) return <p>No content available...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>
          Explore the full details of the selected blog.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button>Back To User List</Button>
        <Card className="lg:px-32">
          <CardHeader>
            <CardTitle></CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <Input value={user.username || "Not Found"} />
            <Input value={user.fullname || "Not Found"} />
            <Input value={user.email || "Not Found"} />
            <Input value={user.role || "Not Found"} />
            {user?.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={
                  `${process.env.NEXT_PUBLIC_ASSETS_URL}/${user.profileImage}` ||
                  "Not Found"
                }
                alt={user.title || "User Image"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center rounded-md bg-gray-100">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}
            <Button>Edit</Button>
            <Button>Back To User List</Button>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </CardContent>
    </Card>
  );
}

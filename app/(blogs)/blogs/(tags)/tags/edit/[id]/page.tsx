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
import { getTagByIdService } from "@/services/tagServices";
import { useParams } from "next/navigation";
import useSWR from "swr";

export default function EditTagPage() {
  const params = useParams(); // Gunakan useParams() untuk mendapatkan id
  const id = params?.id; // Pastikan id tersedia

  console.log(id);

  const fetcher = async () => {
    if (!id) return null;
    return getTagByIdService(id); // Replace with your API service
  };

  const {
    data: tag,
    error,
    isLoading,
  } = useSWR(id ? `/tag/${id}` : null, fetcher);
  console.log(tag);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching blog data: {error.message}</p>;
  if (!tag) return <p>No content available...</p>;

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
            <Input value={tag.name || "Not Found"} disabled />
            <Button>Edit</Button>
            <Button>Back To User List</Button>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </CardContent>
    </Card>
  );
}

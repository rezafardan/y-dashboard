"use client";

import React from "react";
import { UserForm } from "@/components/forms/user-form";
import { getAllUserService, editUserService } from "@/services/userServices";
import { useParams } from "next/navigation";

export default function EditUserPage() {
  const { id } = useParams();
  const userId = id;

  // Data fetched in server
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  console.log(user);

  React.useEffect(() => {
    const fetchUser = async () => {
      const data = await getAllUserService(userId);
      setUser(data);
    };
    fetchUser();
  }, [userId]);

  const handleUpdateUser = async (data: any) => {
    setIsLoading(true);
    try {
      await editUserService(userId, data);
      alert("User updated successfully!");
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <UserForm
      initialValues={user}
      onSubmit={handleUpdateUser}
      isLoading={isLoading}
    />
  );
}

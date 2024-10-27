"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import CKEditorComponent from "@/components/CKEditorComponent";

export default function CreateUserPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [content, setContent] = useState("");

  return (
    <section className="flex flex-col gap-4 py-2">
      <div className="h-full flex flex-col gap-4">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Title" />
        <Label htmlFor="content">Contents</Label>
        <Input id="" placeholder="Role" />
        <Button>Submit</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </section>
  );
}

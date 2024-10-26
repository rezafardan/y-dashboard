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
import React from "react";
import { Separator } from "@/components/ui/separator";

export default function CreateBlogPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <section className="grid grid-cols-[0.75fr_0.25fr] grid-rows-1 gap-4 py-2">
      <div className="h-full flex flex-col gap-4">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Title" />
        <Label htmlFor="content">Contents</Label>
        <Textarea id="content" placeholder="Input Contents Here" />
      </div>
      <div className="h-full flex flex-col gap-4">
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" />
        <Label htmlFor="categories">Categories</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" id="categories">
              Select Categories
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Category 1</DropdownMenuItem>
            <DropdownMenuItem>Category 2</DropdownMenuItem>
            <DropdownMenuItem>Category 3</DropdownMenuItem>
            <DropdownMenuItem>Category 4</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Label htmlFor="tags">Tags</Label>
        <Input id="tags" placeholder="Tags" />
        <Label htmlFor="date-picker">Choose Date Publish</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <Button>Submit</Button>
        <Button variant="outline">Save To Draft</Button>
      </div>
    </section>
  );
}

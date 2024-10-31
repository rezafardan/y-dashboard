import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getBlogs } from "@/services/blogServices";

export default async function BlogPage() {
  const blogs = await getBlogs();

  console.log(blogs);

  return (
    <>
      <Input id="search" type="search" placeholder="Search blog ..." />
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Createt At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
          {blogs.map((blog) => {
            return (
              <TableRow key={blog.id}>
                <TableCell className="font-medium">{blog.id}</TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.userId}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline">Edit</Button>
                  <Button variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody></TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}

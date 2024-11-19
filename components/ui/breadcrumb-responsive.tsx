"use client";

import * as React from "react";
import { usePathname } from "next/navigation"; // Use usePathname hook from next/navigation

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [query]);

  return matches;
};

const ITEMS_TO_DISPLAY = 3;

export default function BreadcrumbResponsive() {
  const [isMounted, setIsMounted] = React.useState(false); // State to track if component is mounted
  const pathname = usePathname(); // Use usePathname hook to get the current path
  const [currentPath, setCurrentPath] = React.useState<string>(pathname || ""); // Set initial path

  // Use useEffect to ensure this runs after mount
  React.useEffect(() => {
    setIsMounted(true); // Set to true after component is mounted
  }, []);

  // Check if the component is mounted and pathname is available
  React.useEffect(() => {
    if (isMounted && pathname) {
      setCurrentPath(pathname); // Set the current path after mounting
    }
  }, [isMounted, pathname]);

  const pathParts = currentPath.split("/").filter(Boolean); // Split the path to create breadcrumb items

  // Capitalize the first letter of each breadcrumb label
  const items = [
    { href: "/", label: "Home" },
    ...pathParts.map((part, index) => ({
      href: "/" + pathParts.slice(0, index + 1).join("/"),
      label: part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(), // Capitalize only the first letter
    })),
  ];

  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList className="text-xs">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

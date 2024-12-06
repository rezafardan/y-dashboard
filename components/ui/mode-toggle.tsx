"use client";

import * as React from "react";
import { Moon, Sun, HandMetal } from "lucide-react";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  const [isPulse, setIsPulse] = React.useState(false);
  const [isSpinning, setIsSpinning] = React.useState(false);

  const handleThemeChange = (theme: string) => {
    setIsPulse(true);

    setTimeout(() => {
      setIsPulse(false);
      setIsSpinning(true);
      setTheme(theme);

      setTimeout(() => setIsSpinning(false), 1000);
    }, 100);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative overflow-hidden"
        >
          <Sun
            className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 ${
              isPulse && "animate-pulse opacity-50"
            } ${isSpinning && "hidden"}`}
          />
          <Moon
            className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 ${
              isPulse && "animate-pulse opacity-50"
            } ${isSpinning && "hidden"}`}
          />
          <HandMetal
            className={`absolute h-[1.2rem] w-[1.2rem] ${
              isSpinning ? "animate-spin" : "hidden"
            }`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

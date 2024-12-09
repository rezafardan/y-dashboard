import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define the props expected by the Dropzone component
interface DropzoneProps {
  onChange: React.Dispatch<React.SetStateAction<File | null>>;
  className?: string;
  fileExtension?: string;
}

// Create the Dropzone component receiving props
export function Dropzone({
  onChange,
  className,
  fileExtension,
  ...props
}: DropzoneProps) {
  // Initialize state variables using the useState hook
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to file input element
  const [fileInfo, setFileInfo] = useState<string | null>(null); // Information about the uploaded file
  const [error, setError] = useState<string | null>(null); // Error message state

  // Function to handle drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Function to handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    if (files.length > 0) {
      handleFile(files[0]); // Only process the first file
    }
  };

  // Function to handle file input change event
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  // Function to handle processing of uploaded files
  const handleFile = (file: File) => {
    // Check file extension
    if (
      fileExtension &&
      !file.type.startsWith(fileExtension.replace("*", ""))
    ) {
      setError(`Invalid file type. Expected: .${fileExtension}`);
      return;
    }

    const fileSizeInKB = Math.round(file.size / 1024); // Convert to KB

    onChange(file);

    // Display file information
    setFileInfo(`Uploaded file: ${file.name} (${fileSizeInKB} KB)`);
    setError(null); // Reset error state
  };

  // Function to simulate a click on the file input element
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card
      className={`border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50 ${className}`}
      {...props}
    >
      <CardContent
        className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center text-muted-foreground">
          <span className="font-medium">Drag Files to Upload or </span>
          <Button
            variant="ghost"
            size="sm"
            className="flex h-8 space-x-2 px-2 text-xs bg-background ml-1"
            onClick={handleButtonClick}
          >
            Click Here
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={fileExtension}
            onChange={handleFileInputChange}
            className="hidden"
            multiple
          />
        </div>
        {fileInfo && <p className="text-muted-foreground">{fileInfo}</p>}
        {error && <span className="text-red-500">{error}</span>}
      </CardContent>
    </Card>
  );
}

"use client";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Underline,
  Image,
  Link2,
  Undo,
  Redo,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "../ui/input";
import { useCallback, useState } from "react";
import { Separator } from "../ui/separator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type Props = {
  editor: Editor | null;
};

export const Toolbar = ({ editor }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [url, setUrl] = useState("");

  if (!editor) {
    return null;
  }

  // Fungsi untuk upload gambar
  const handleUploadImage = (editor: Editor) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event: Event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result;

          // Tambahkan gambar ke editor
          editor
            .chain()
            .focus()
            .setImage({ src: base64Image as string })
            .run();
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const handleSetLink = useCallback(() => {
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
    setIsDialogOpen(false);
    setUrl(""); // Reset URL input
  }, [editor, url]);

  return (
    <div className="border border-input bg-background rounded-md p-1 flex gap-1 overflow-auto scrollbar-hidden">
      <div className="flex gap-1 items-center">
        <Toggle
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo
            className={`h-4 w-4 ${
              editor.can().undo()
                ? "text-black dark:text-white"
                : "text-gray-400"
            }`}
          />
        </Toggle>
        <Toggle
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo
            className={`h-4 w-4 ${
              editor.can().redo()
                ? "text-black dark:text-white"
                : "text-gray-400"
            }`}
          />
        </Toggle>
        <Separator orientation="vertical" className="h-4" />
      </div>

      {/* Text Formatting */}
      <div className="flex gap-1 items-center">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-4" />
      </div>

      {/* Headings */}
      <div className="flex gap-1 items-center">
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-4" />
      </div>

      {/* Lists */}
      <div className="flex gap-1 items-center">
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-4" />
      </div>

      {/* Alignment */}
      <div className="flex gap-1 items-center">
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-4" />
      </div>

      {/* Additional Features */}
      <div className="flex gap-1 items-center">
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("code")}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-4" />

        {/* Insert Link Button */}
        <Toggle
          size="sm"
          onClick={() => setIsDialogOpen(true)} // Buka dialog
          pressed={editor.isActive("link")}
          title="Insert Link"
        >
          <Link2 className="h-4 w-4" />
        </Toggle>

        {/* Dialog for Adding Link */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
              <DialogDescription>Add a link to your content</DialogDescription>
            </DialogHeader>

            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSetLink}>Add Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toggle
          size="sm"
          onClick={() => handleUploadImage(editor)}
          title="Upload Image"
        >
          <Image className="h-4 w-4" />
        </Toggle>
      </div>
    </div>
  );
};

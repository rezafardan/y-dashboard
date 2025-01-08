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
  Heading3,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
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
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { createImageContent } from "@/services/blogServices";
import { Dropzone } from "@/components/ui/dropzone";

type Props = {
  editor: Editor | null;
};

export const Toolbar = ({ editor }: Props) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false); // Dialog untuk link
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false); // Dialog untuk upload image
  const [contentImage, setContentImage] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  if (!editor) {
    return null;
  }

  // Fungsi untuk upload gambar
  const handleUploadImage = async () => {
    if (!contentImage) {
      alert("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("contentimage", contentImage);

    try {
      // Upload ke backend
      const response = await createImageContent(formData);

      const { filepath, id } = response.data;

      editor
        .chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: {
            src: `${process.env.NEXT_PUBLIC_ASSETS_URL}/${filepath}`,
            alt: contentImage.name,
            id,
          },
        })
        .run();

      // Reset state dan tutup dialog
      setContentImage(null);
      setIsImageDialogOpen(false);
    } catch (error) {
      alert("Failed to upload image. Please try again.");
    }
  };
  const handleSetLink = useCallback(() => {
    // Jika URL kosong, hapus link
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      // Jika URL tidak kosong, tambahkan atau perbarui link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }

    // Reset URL dan tutup dialog setelah eksekusi
    setIsLinkDialogOpen(false);
    setUrl("");
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

        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
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

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "justify" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("justify").run()
          }
          title="Align Justify"
        >
          <AlignJustify className="h-4 w-4" />
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
          onClick={() => {
            // Jika ada link aktif, isi URL input dengan href saat ini
            const currentLink = editor.getAttributes("link").href;
            if (currentLink) {
              setUrl(currentLink); // Isi URL input dengan nilai link saat ini
            } else {
              setUrl(""); // Reset jika tidak ada link aktif
            }
            setIsLinkDialogOpen(true); // Buka dialog
          }}
          pressed={editor.isActive("link")}
          title="Insert Link"
        >
          <Link2 className="h-4 w-4" />
        </Toggle>

        {/* Dialog for Adding Link */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert or Edit Link</DialogTitle>
              <DialogDescription>
                Add, update, or remove a link from your content.
              </DialogDescription>
            </DialogHeader>

            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsLinkDialogOpen(false)}
              >
                Cancel
              </Button>

              {editor.isActive("link") && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .unsetLink()
                      .run();
                    setIsLinkDialogOpen(false);
                    setUrl("");
                  }}
                >
                  Remove Link
                </Button>
              )}

              <Button onClick={handleSetLink}>
                {editor.isActive("link") ? "Update Link" : "Add Link"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog for Image Upload */}
        <Toggle
          size="sm"
          pressed={false}
          onClick={() => setIsImageDialogOpen(true)}
          title="Upload Image"
        >
          <Image className="h-4 w-4" />
        </Toggle>

        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
              <DialogDescription>
                Select an image file to upload.
              </DialogDescription>
            </DialogHeader>

            <Dropzone
              onChange={setContentImage}
              className="w-full"
              fileExtension="image/*"
            />

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsImageDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUploadImage} disabled={!contentImage}>
                Upload & Insert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

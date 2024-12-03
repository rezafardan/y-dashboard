"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Toolbar } from "./tiptap-toolbar";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Code from "@tiptap/extension-code";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import HardBreak from "@tiptap/extension-hard-break";
import Dropcursor from "@tiptap/extension-dropcursor";
import Link from "@tiptap/extension-link";

import History from "@tiptap/extension-history";

import Image from "@tiptap/extension-image";
import { useEffect } from "react";

export const Tiptap = ({
  onChange,
  content,
}: {
  onChange: (value: string) => void;
  content: string;
}) => {
  const editor = useEditor({
    extensions: [
      // Core Extensions
      Document,
      Paragraph,
      Text,
      HardBreak,

      // Text Formatting
      Bold,
      Italic,
      Underline,
      Strike,
      Code,

      // Headings
      Heading.configure({
        levels: [1, 2, 3],
      }),

      // Lists
      BulletList,
      OrderedList,
      ListItem,

      // Additional Features
      Blockquote,
      CodeBlock,

      // Layout and Styling
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Dropcursor,

      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      History.configure({
        depth: 100,
        newGroupDelay: 250,
      }),
    ],
    content: content ? JSON.parse(content) : "",
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[480px] rounded-md border border-input bg-background px-3 py-2 ring-offset-background" +
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" +
          "[&_ol]:list-decimal [&_ul]:list-disc " +
          "[&_ol]:pl-5 [&_ul]:pl-5 " +
          "[&_ol]:list-outside [&_ul]:list-outside " +
          "prose prose-sm max-w-full w-full" +
          "[&_p]:leading-tight [&_p]:my-0 ",
      },
    },
    onUpdate({ editor }) {
      const jsonContent = editor.getJSON();
      onChange(JSON.stringify(jsonContent));
    },
  });

  return (
    <div className="flex flex-col justify-stretch gap-2">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
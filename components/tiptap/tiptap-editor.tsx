"use client";

import { BubbleMenu, useEditor, EditorContent } from "@tiptap/react";
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

import {
  Bold as IBold,
  Italic as IItalic,
  Strikethrough as IStrikethrough,
  Underline as IUnderline,
} from "lucide-react";

import { Toggle } from "../ui/toggle";
import { useEffect, useCallback } from "react";

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: { default: null },
    };
  },
  renderHTML({ node }) {
    return [
      "img",
      {
        src: node.attrs.src,
        alt: node.attrs.alt,
        id: node.attrs.id || "",
      },
    ];
  },
});

export const Tiptap = ({
  onChange,
  content,
  reset,
}: {
  onChange: (value: string) => void;
  content: string;
  reset: boolean;
}) => {
  const handleUpdate = useCallback(
    ({ editor }: any) => {
      const jsonContent = editor.getJSON();
      onChange(JSON.stringify(jsonContent));
    },
    [onChange]
  );

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      HardBreak,
      Bold,
      Italic,
      Underline,
      Strike,
      Code,
      Heading,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Dropcursor,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
      }),
      CustomImage,
      History.configure({
        depth: 100,
        newGroupDelay: 250,
      }),
    ],
    content: content ? JSON.parse(content) : "",
    editorProps: {
      attributes: {
        class: [
          "min-h-96", // Minimum height
          "px-4", // Padding X
          "py-0", // Padding Y
          "bg-background", // Background color
          "rounded-md", // Rounded corners
          "border", // Border styling
          "prose-sm", // Small typography
          "prose-slate", // Slate color scheme
          "prose-headings:font-bold", // Bold headings
          "prose-h1:text-3xl", // H1 size
          "prose-h2:text-2xl", // H2 size
          "prose-h3:text-xl", // H3 size
          "prose-h4:text-lg", // H4 size
          "prose-h5:text-base", // H5 size
          "prose-h6:text-sm", // H6 size
          "prose-p:my-4", // Paragraph spacing
          "prose-lead:text-lg prose-lead:leading-relaxed", // Lead text
          "prose-lead:leading-snug", // Adjusted leading
          "prose-li:my-1", // List item spacing
          "prose-ul:list-disc prose-ul:pl-6", // Unordered list
          "prose-ol:list-decimal prose-ol:pl-6", // Ordered list
          "prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic", // Blockquote
          "prose-img:rounded-md prose-img:shadow-sm prose-img:p-2 prose-img:border prose-img:border-secondary prose-img:mb-4 prose-img:cursor-pointer", // Images
          "prose-table:table-auto prose-table:border prose-table:border-collapse", // Tables
          "prose-th:border prose-th:p-2 prose-th:text-left", // Table headers
          "prose-td:border prose-td:p-2", // Table cells
          "prose-code:font-mono prose-code:bg-secondary prose-code:p-2 prose-code:rounded-sm", // Inline code
          "prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto", // Code blocks
          "prose-a:text-blue-800 prose-a:underline prose-a:hover:text-blue-800 prose-a:cursor-pointer", // Links
          "prose-strong:font-bold", // Bold text
          "prose-em:italic", // Italic text
          "prose-del:line-through", // Strikethrough text
          "prose-hr:border-gray-300", // Horizontal rule
          "focus:outline-none", // Remove outline on focus
        ].join(" "),
      },
    },
    onUpdate: handleUpdate,
    immediatelyRender: true,
  });

  useEffect(() => {
    if (!editor) return;

    const updateContent = () => {
      try {
        const currentContent = editor.getJSON();
        const newContent = content ? JSON.parse(content) : null;

        if (reset) {
          editor.commands.clearContent(true);
        } else if (
          newContent &&
          JSON.stringify(currentContent) !== JSON.stringify(newContent)
        ) {
          editor.commands.setContent(newContent, false, {
            preserveWhitespace: true,
          });
        }
      } catch (error) {
        console.error("Error updating editor content:", error);
      }
    };

    updateContent();
  }, [reset, content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col w-full gap-2 leading-">
      <Toolbar editor={editor} />
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        shouldShow={({ editor, view, state, from, to }) => {
          return from !== to && editor.isEditable;
        }}
      >
        <div className="flex gap-1 p-1 rounded-lg border bg-background">
          <Toggle
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
            size="sm"
          >
            <IBold className="h-4 w-4" />
          </Toggle>
          <Toggle
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
            size="sm"
          >
            <IItalic className="h-4 w-4" />
          </Toggle>
          <Toggle
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("underline") ? "is-active" : ""}
            size="sm"
          >
            <IUnderline className="h-4 w-4" />
          </Toggle>
          <Toggle
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
            size="sm"
          >
            <IStrikethrough className="h-4 w-4" />
          </Toggle>
        </div>
      </BubbleMenu>
      <EditorContent editor={editor} className="w-full" />
    </div>
  );
};

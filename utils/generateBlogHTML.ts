// utils/generateBlogHTML.ts

import { generateHTML } from "@tiptap/html";
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
import Image from "@tiptap/extension-image";

// Fungsi untuk menghasilkan HTML dari konten blog
export const generateBlogHTML = (content: any) => {
  return generateHTML(content, [
    Document,
    Paragraph,
    Text,
    Heading,
    Bold,
    Italic,
    Underline,
    Strike,
    TextAlign,
    Blockquote,
    CodeBlock,
    Code,
    BulletList,
    OrderedList,
    ListItem,
    HardBreak,
    Dropcursor,
    Link,
    Image,
  ]);
};

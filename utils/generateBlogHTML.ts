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

export const generateBlogHTML = (content: string) => {
  try {
    const parsedContent =
      typeof content === "string" ? JSON.parse(content) : content;

    if (!parsedContent || !parsedContent.type) {
      return "";
    }

    return generateHTML(parsedContent, [
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
  } catch (error) {
    console.error("Error generating HTML:", error);
    return "";
  }
};

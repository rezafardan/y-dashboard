import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import Component from "./Component";

export default Node.create({
  name: "reactComponent",

  group: "block",

  content: "inline*",

  addAttributes() {
    return {
      customAttribute: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "react-component",
        getAttrs: (node) => {
          if (typeof node === "string") return {};
          const element = node as HTMLElement;
          return {
            customAttribute: element.getAttribute("data-custom-attribute"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "react-component",
      {
        ...mergeAttributes(HTMLAttributes),
        "data-custom-attribute": HTMLAttributes.customAttribute,
      },
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});

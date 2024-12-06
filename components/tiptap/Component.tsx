import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React from "react";

export default ({ node }: { node: any }) => {
  const { customAttribute } = node.attrs;

  return (
    <NodeViewWrapper className="border bg-black">
      <label contentEditable={false}>React Component: {customAttribute}</label>
      <NodeViewContent className="content is-editable" />
    </NodeViewWrapper>
  );
};

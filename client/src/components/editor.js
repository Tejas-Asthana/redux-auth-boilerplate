import React, { useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import Bold from "../imgs/bold.svg";
import Italic from "../imgs/italics.svg";
import Underline from "../imgs/underline.svg";
import Strikethrough from "../imgs/strikethrough.svg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function EditorBox({ newMessage, setNewMessage }) {
  return (
    <div>
      <Editor
        toolbar={{
          inline: {
            inDropdown: false,
            options: [
              "bold",
              "underline",
              "italic",
              "strikethrough",
              "monospace",
            ],
          },
          blockType: {
            className: "d-none",
          },
          fontSize: {
            className: "d-none",
          },
          fontFamily: {
            className: "d-none",
          },
          list: {
            inDropdown: false,
            options: ["unordered", "ordered"],
          },
          textAlign: {
            isDropdown: false,
            options: ["left"],
          },
          colorPicker: {
            className: "d-none",
          },
          embedded: {
            className: "d-none",
          },
          link: {
            className: "d-none",
            options: ["link"],
          },
          image: {
            className: "d-none",
          },
          remove: {
            className: "d-none",
          },
          history: {
            className: "d-none",
          },
        }}
        editorState={newMessage}
        toolbarClassName="editor-toolbar"
        wrapperClassName="editor-wrapper"
        editorClassName="editor-input"
        onEditorStateChange={(editorState) => setNewMessage(editorState)}
        mention={{
          separator: " ",
          trigger: "@",
          suggestions: [
            { text: "APPLE", value: "apple", url: "apple" },
            { text: "BANANA", value: "banana", url: "banana" },
            { text: "CHERRY", value: "cherry", url: "cherry" },
            { text: "DURIAN", value: "durian", url: "durian" },
            {
              text: "EGGFRUIT",
              value: "eggfruit",
              url: "eggfruit",
            },
            { text: "FIG", value: "fig", url: "fig" },
            {
              text: "GRAPEFRUIT",
              value: "grapefruit",
              url: "grapefruit",
            },
            {
              text: "HONEYDEW",
              value: "honeydew",
              url: "honeydew",
            },
          ],
        }}
      />
    </div>
  );
}

export default EditorBox;

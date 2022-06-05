import React from "react";
import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function EditorBox({ friends, newMessage, setNewMessage }) {
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
          suggestions: friends.map((friend) => {
            return { text: friend.username, value: friend.username };
          }),
        }}
      />
    </div>
  );
}

export default EditorBox;

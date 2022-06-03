import React from "react";
import { format } from "timeago.js";

export default function Message({ message, own }) {
  return (
    <div className={own === true ? "msg slf px-3" : "px-3 msg"}>
      <div
        className="messageText"
        dangerouslySetInnerHTML={{ __html: message.text }}
      />
      <div className="messageBottom text-secondary">
        {format(message.createdAt)}
      </div>
    </div>
  );
}

import React from "react";
import { format } from "timeago.js";
import Document from "../imgs/document.svg";

export default function Message({ message, own }) {
  return (
    <div className={own === true ? "msg slf px-3" : "px-3 msg"}>
      <div
        className="messageText"
        dangerouslySetInnerHTML={{ __html: message.text }}
      />
      {message.fileName ? (
        <a
          href={"http://localhost:5000/api/files/" + message.fileName}
          download
          className="text-black document-message"
        >
          <div className="document-icon m-auto" role="button">
            <img src={Document} />
          </div>

          {message.fileName}
        </a>
      ) : null}

      <div className="messageBottom text-secondary">
        {format(message.createdAt)}
      </div>
    </div>
  );
}

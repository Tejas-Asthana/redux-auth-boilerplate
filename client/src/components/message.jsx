import axios from "axios";
import React, { useState, useEffect } from "react";
import { format } from "timeago.js";

import Document from "../imgs/document.svg";

export default function Message({ message, own }) {
  // const [result, setResult] = useState(null);

  // let pattern =
  //   /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;

  // useEffect(async () => {
  //   if (message?.link) {
  //     const res = await axios.get(
  //       "http://localhost:5000/api/metaData/" + message?.link
  //     );
  //     setResult(res.data);
  //     console.log(res.data);
  //   }
  // }, []);

  return (
    <div className={own === true ? "msg slf px-3" : "px-3 msg"}>
      <div
        className="messageText"
        dangerouslySetInnerHTML={{ __html: message.text }}
      />

      {/* {result ? <div className="" style={{ minHeight: "300px" }}></div> : null} */}

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

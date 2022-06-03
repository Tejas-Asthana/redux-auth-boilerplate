import React, { useEffect, useState } from "react";
import axios from "axios";

function Conversations({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios("http://localhost:5000/api/user/" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation text-left">
      <span className="conversationName text-white">{user?.username}</span>
    </div>
  );
}

export default Conversations;

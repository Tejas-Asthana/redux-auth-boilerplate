import React, { useEffect, useState } from "react";
import axios from "axios";

function Conversations({ conversation, setCurrentFriend, currentUser }) {
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
    <div
      onClick={() => setCurrentFriend(user)}
      className={"friend-list-item text-left "}
    >
      {user?.username}
    </div>
  );
}

export default Conversations;

import React, { useState, useEffect } from "react";
import axios from "axios";

function Friends({ onlineUsers, conversations, setCurrentChat, friends, id }) {
  const [onlineFriends, setOnlineFriends] = useState([]);
  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
    console.log(onlineFriends);
  }, [friends, onlineUsers]);

  const handleClick = async (friendId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/conversations/find/${friendId}/${id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ul type="none" className="text-left p-0 mx-0 my-2 ">
      {friends.length > 0 ? (
        friends.map((friend, indx) => {
          const flag = onlineFriends.find((user) => user._id === friend._id)
            ? true
            : false;
          return (
            <li
              key={indx}
              className="friend-list-item"
              onClick={() => handleClick(friend._id)}
              role="button"
            >
              {flag ? (
                <span className="dot online" />
              ) : (
                <span className="dot offline" />
              )}
              {friend.username}
            </li>
          );
        })
      ) : (
        <div>You have no friends</div>
      )}
    </ul>
  );
}

export default Friends;

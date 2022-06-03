import React from "react";
import axios from "axios";

function Friends({ setConversations, friends, id }) {
  const selectConversation = async (friendId) => {
    // const config = {
    //   headers: {
    //     "x-auth-token": props.token,
    //   },
    // };
    const res = await axios.get(
      `http://localhost:5000/api/conversations/find/${friendId}/${id}`
      // config
    );
    let data = [];
    data.push(res.data);
    setConversations([...data]);
  };

  return (
    <ul type="none" className="text-left p-0 mx-0 my-2 ">
      {friends.map((friend, indx) => {
        return (
          <li
            key={indx}
            // onClick={() => {
            //   selectConversation(friend._id);
            // }}
            className="friend-list-item"
          >
            {friend.username}
          </li>
        );
      })}
    </ul>
  );
}

export default Friends;

import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";

let Messenger = (props) => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  // const getConversations = async () => {
  //   const config = {
  //     headers: {
  //       "x-auth-token": props.user.token,
  //     },
  //   };
  //   await axios
  //     .get(`http://localhost:5000/api/conversations/${props.user._id}`, config)
  //     .then((res) => {
  //       setConversations(res.data);
  //       console.log(conversations);
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // };

  // useEffect(() => {
  //   getConversations();
  // }, [props.user._id]);

  // useEffect(() => {
  //   const getMessages = async () => {
  //     try {
  //       const res = await axios.get("/messages/" + currentChat?._id);
  //       setMessages(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getMessages();
  // }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: props.user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== props.user._id
    );

    // socket.current.emit("sendMessage", {
    //   senderId: user._id,
    //   receiverId,
    //   text: newMessage,
    // });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages/",
        message
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  return props.isAuthenticated ? (
    <>
      <h1>Blank Page</h1>
    </>
  ) : (
    <>{props.history.push("/login")}</>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, {})(Messenger);

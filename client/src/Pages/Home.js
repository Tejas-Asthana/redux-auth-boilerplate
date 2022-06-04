import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { EditorState } from "draft-js";
import { convertToHTML } from "draft-convert";
import { socket } from "../components/socket.jsx";

import Friends from "../components/friends.js";
import Conversation from "../components/conversation.js";
import Message from "../components/message.jsx";
import SearchUser from "../components/search.js";
import EditorBox from "../components/editor.js";
import { getConversations } from "../actions/conversations";
import { getFriends } from "../actions/user";
import { logout } from "../actions/auth";

import "../App.css";
import Send from "../imgs/send.svg";
import Upload from "../imgs/upload.svg";
import Mention from "../imgs/mention.svg";
import LinkSvg from "../imgs/link.svg";

let App = (props) => {
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contentHtml, setContentHtml] = useState("");
  const [newMessage, setNewMessage] = useState(EditorState.createEmpty());
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  // const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    setConversations(props.conversations);

    socket.on("getMessage", (data) =>
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      })
    );
  }, []);

  useEffect(() => {
    console.log(onlineUsers);
  }, [onlineUsers]);

  const helper = () => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  };

  useEffect(() => helper(), [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.emit("addUser", props.user._id);
    socket.on("getUsers", (users) =>
      setOnlineUsers(
        props.user.friends.filter((f) => users.some((u) => u.userId === f))
      )
    );
  }, [props.user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/messages/" + currentChat?._id
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = {
      sender: props.user._id,
      text: contentHtml,
      conversationId: currentChat._id,
    };

    console.log(contentHtml);

    const receiverId = currentChat.members.find(
      (member) => member !== props.user._id
    );

    socket.emit("sendMessage", {
      senderId: props.user._id,
      receiverId,
      text: msg.text,
    });

    const config = {
      headers: {
        "x-auth-token": props.token,
      },
      data: msg,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages/",
        config
      );
      console.log(config);
      setMessages([...messages, res.data]);
      console.log(messages);
      setNewMessage(EditorState.createEmpty());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    props.getFriends();
    props.getConversations();
  }, []);

  useEffect(() => {
    const html = convertToHTML(newMessage.getCurrentContent());
    setContentHtml(html);
  }, [newMessage]);

  useEffect(
    () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages]
  );

  return props.isAuthenticated ? (
    <>
      <div className="App">
        <div className="container-fluid">
          <div className="wrapper row p-0">
            <div className="col-4 ">
              <div className="text-left text-white">
                <div className="row align-items-center justify-content-between px-3 mt-3">
                  <h2>Hi {props.user.username} 👋 </h2>
                  <button
                    onClick={() => props.logout()}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#fff",
                    }}
                  >
                    <u> Logout </u>
                  </button>
                </div>
              </div>
              <SearchUser />
              <div className="conversation-wrapper">
                <h1 className="conversation-h1 text-left text-white">
                  Messages
                </h1>
                <ul type="none" className="p-0 m-0">
                  {conversations.length > 0 ? (
                    conversations.map((c, indx) => (
                      <li
                        role="button"
                        key={indx}
                        onClick={() => setCurrentChat(c)}
                      >
                        <Conversation
                          conversation={c}
                          currentUser={props.user}
                        />
                      </li>
                    ))
                  ) : (
                    <div className="text-secondary">
                      Start a new conversation
                    </div>
                  )}
                </ul>
              </div>
              <div className="friends-wrapper mt-5">
                <h1 className="friends-h1 text-left text-white">Friends</h1>
                <Friends
                  onlineUsers={onlineUsers}
                  conversations={props.conversations}
                  setCurrentChat={setCurrentChat}
                  friends={props.friends}
                  id={props.user._id}
                />
              </div>
            </div>
            <div className="col-8  ">
              {/* <div className="chat-msgs-window">
                <div className="p-0 m-0"> */}
              <div className="d-flex chat-wrapper flex-column">
                {currentChat ? (
                  <>
                    <div className="p-2 show-messages">
                      {messages.map((m) => (
                        <div ref={scrollRef}>
                          <Message
                            message={m}
                            own={m.sender === props.user._id}
                          />
                        </div>
                      ))}
                    </div>
                    <div
                      className="chat-input"
                      onClick={() =>
                        document.querySelector(".editor-input").focus()
                      }
                    >
                      <EditorBox
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                      />
                      <div className="row m-0 bg-white ">
                        <div>
                          <input
                            type="file"
                            id="actual-upload-btn"
                            className="bg-white"
                            hidden
                          />

                          <label id="actual-upload-btn" for="actual-upload-btn">
                            <img src={Upload} />
                          </label>
                        </div>
                        <div className="pl-2">
                          <img
                            style={{ width: "30px", marginTop: "4px" }}
                            src={Mention}
                            role="button"
                          />
                        </div>
                        <div className="pl-2">
                          <img
                            style={{ width: "17px", marginTop: "10px" }}
                            src={LinkSvg}
                            role="button"
                          />
                        </div>
                        <div className="ml-auto pr-1">
                          <button
                            className="chatSubmitButton"
                            onClick={handleSubmit}
                          >
                            <img style={{ width: "30px" }} src={Send} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <span className="text-secondary h1">No message to show</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>{props.history.push("/login")}</>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  friends: state.friends,
  messages: state.messages,
  conversations: state.conversations,
  user: state.auth.user,
  error: state.error,
});

export default connect(mapStateToProps, {
  getConversations,
  getFriends,
  logout,
})(App);

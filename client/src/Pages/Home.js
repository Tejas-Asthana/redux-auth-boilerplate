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
import Uploaded from "../imgs/uploaded.svg";
import Mention from "../imgs/mention.svg";
import LinkSvg from "../imgs/link.svg";

let App = (props) => {
  const [currentFriend, setCurrentFriend] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contentHtml, setContentHtml] = useState("");
  const [newMessage, setNewMessage] = useState(EditorState.createEmpty());
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [file, setFile] = useState(null);
  // const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    setConversations(props.conversations);

    socket.on("getMessage", (data) =>
      setArrivalMessage({
        fileName: data.fileName,
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
      currentChat?.members?.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  };

  useEffect(() => helper(), [arrivalMessage, currentChat]);

  useEffect(() => {
    try {
      socket.emit("addUser", props.user._id);
      socket.on(
        "getUsers",
        (users) =>
          setOnlineUsers(
            props.user.friends.filter((f) => users.some((u) => u.userId === f))
          )
        // setOnlineUsers(users)
      );
    } catch (err) {
      console.log(err);
    }
  }, [props.user]);

  const getMessages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/messages/" + currentChat._id
      );
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  // getMessages();

  useEffect(() => {
    getMessages();
  }, [currentFriend, conversations, currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(contentHtml);

    const receiverId = currentChat?.members.find(
      (member) => member !== props.user._id
    );

    socket.emit("sendMessage", {
      senderId: props.user._id,
      receiverId,
      text: contentHtml,
      fileName: file?.name,
    });

    const msg = {
      sender: props.user._id,
      text: contentHtml,
      conversationId: currentChat?._id,
      fileName: file?.name,
    };

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
      setMessages([...messages, res.data]);
      console.log(messages);
      setNewMessage(EditorState.createEmpty());
    } catch (err) {
      console.log(err);
    }

    if (file) {
      const data = new FormData();
      const fileName = file?.name;
      data.append("name", fileName);
      data.append("file", file);

      try {
        const res = await axios.post("http://localhost:5000/api/upload/", data);
        setFile(null);
      } catch (err) {
        if (err) throw err;
      }
    }
  };

  useEffect(() => {
    props.getFriends();
  }, [currentChat]);

  useEffect(() => {
    props.getConversations();
  }, [currentFriend]);

  useEffect(() => {
    const html = convertToHTML(newMessage.getCurrentContent());
    setContentHtml(html);
  }, [newMessage]);

  useEffect(
    () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages]
  );

  const helperCreateChat = async (c) => {
    console.log(c);
    if (!c._id) {
      try {
        const config = {
          data: {
            senderId: props.auth?.user?._id,
            receiverId: currentFriend?._id,
          },
        };
        const res = await axios.post(
          "http://localhost:5000/api/conversations",
          config
        );
        setCurrentChat(res.data);
      } catch (err) {
        throw err;
      }
    } else setCurrentChat(c);
  };

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
              <SearchUser friends={props.friends} />
              <div className="conversation-wrapper">
                <h1 className="conversation-h1 text-white">Messages</h1>
                <ul type="none" className="p-0 m-0">
                  {conversations.length > 0 ? (
                    conversations.map((c, indx) => (
                      <li
                        role="button"
                        key={indx}
                        onClick={() => helperCreateChat(c)}
                        className={
                          currentFriend?._id === c.members[0] ||
                          currentFriend?._id === c.members[1]
                            ? "chat-selected"
                            : ""
                        }
                      >
                        <Conversation
                          conversation={c}
                          setCurrentFriend={setCurrentFriend}
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
                <h1 className="friends-h1 text-white">Friends</h1>
                <Friends
                  setCurrentFriend={setCurrentFriend}
                  onlineUsers={onlineUsers}
                  conversations={props.conversations}
                  helperCreateChat={helperCreateChat}
                  friends={props.friends}
                  id={props.user._id}
                />
              </div>
            </div>
            <div className="col-8  ">
              {/* <div className="chat-msgs-window">
                <div className="p-0 m-0"> */}
              <div className="d-flex chat-wrapper flex-column">
                {currentFriend || currentChat ? (
                  <>
                    <h1 className="text-white">
                      {currentFriend &&
                      onlineUsers.find((user) => user === currentFriend._id) ? (
                        <div>
                          <span className="dot mb-1 online" />
                          {currentFriend?.username} &nbsp;
                          <span className="text-secondary h6">
                            <i>( online )</i>
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="dot mb-1 offline" />
                          {currentFriend?.username} &nbsp;
                          <span className="text-secondary h6">
                            <i> ( offline )</i>
                          </span>
                        </div>
                      )}
                    </h1>
                    <div className="p-2 show-messages">
                      {currentChat && currentFriend ? (
                        messages.map((m) => (
                          <div ref={scrollRef}>
                            <Message
                              message={m}
                              own={m.sender === props.user._id}
                            />
                          </div>
                        ))
                      ) : (
                        <div
                          style={{ maxWidth: "400px", margin: "auto" }}
                          className="text-secondary text-center h4"
                        >
                          Send {currentFriend?.username} a message
                        </div>
                      )}
                    </div>
                    {currentFriend ? (
                      <div
                        className="chat-input"
                        onClick={() =>
                          document.querySelector(".editor-input").focus()
                        }
                      >
                        <EditorBox
                          friends={props.friends}
                          newMessage={newMessage}
                          setNewMessage={setNewMessage}
                        />
                        <div className="row m-0 bg-white ">
                          <div>
                            <input
                              type="file"
                              id="actual-upload-btn"
                              className="bg-white"
                              name="file"
                              onChange={(e) => setFile(e.target.files[0])}
                              hidden
                            />

                            <label
                              id="actual-upload-btn"
                              for="actual-upload-btn"
                            >
                              {file ? (
                                <img src={Uploaded} />
                              ) : (
                                <img src={Upload} />
                              )}
                            </label>
                          </div>
                          {/* <div className="pl-2">
                            <img
                              style={{ width: "30px", marginTop: "4px" }}
                              src={Mention}
                              role="button"
                            />
                          </div> */}
                          {/* <div className="pl-2">
                            <img
                              style={{ width: "17px", marginTop: "10px" }}
                              src={LinkSvg}
                              role="button"
                            />
                          </div> */}
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
                    ) : (
                      <div></div>
                    )}
                  </>
                ) : (
                  <div
                    style={{ maxWidth: "400px", margin: "auto" }}
                    className="text-secondary text-center h4"
                  >
                    Select from Messages or start a new conversation by clicking
                    on a friend
                  </div>
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

import React, { useState, useEffect } from "react";
import "./App.css";
import { Button, FormHelperText, InputLabel, Input } from "@material-ui/core";
import { FormControl, IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import Message from "./Message";
import { db, auth } from "./firebase.js";
import Header from "./Header";
import firebase from "firebase";
import FlipMove from "react-flip-move";
import Sidebar from "./Sidebar";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      username: "Guest",
      message: "Please enter a message",
    },
  ]);
  const [username, setUsername] = useState("guest");
  const [user, setUser] = useState(null);
  const [currentChat, setCurrentChat] = useState("MainChat");
  const [chatName, setChatName] = useState("Main Chat");

  useEffect(() => {
    console.log("Loading Chat", currentChat);
    //run once when the app loads
    db.collection("chats")
      .doc(currentChat)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, message: doc.data() }))
        );
      });
  }, [currentChat]);

  const sendMessage = async (event) => {
    //DB Logic
    event.preventDefault();
    if (input === "CLR") {
      setMessages([
        {
          username: null,
          message: "Deleting Conversation...",
        },
      ]);

      await messages.map(({ message, id }) =>
        db
          .collection("chats")
          .doc(currentChat)
          .collection("messages")
          .doc(id)
          .delete()
          .catch(function (error) {
            console.error("Error removing document: ", error);
          })
      );

      await db.collection("chats").doc(currentChat).collection("messages").add({
        username: "Welcome",
        message: "Please enter a message",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      console.log("USERNMAEHEY", username ? username : "no username :(");
      await db.collection("chats").doc(currentChat).collection("messages").add({
        message: input,
        username: username,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    setInput("");
  };

  const handleNewUser = (updatedUser) => {
    if (updatedUser) {
      console.log("HANDLER", updatedUser);
      console.log("displayname", updatedUser?.user);
      setUsername(updatedUser.user);
      setUser(updatedUser);
    } else {
      console.log("No User Here", updatedUser);
      setUsername(null);
      setUser(null);
    }
    setCurrentChat("MainChat");
    setChatName("Main Chat");
  };

  const handleChat = async (chat) => {
    setCurrentChat(chat.id);
    setChatName(chat.chatName);
    console.log("UPDATE CHAT", currentChat, chat.id);
  };

  return (
    <div className="app">
      <Header usernameHandler={handleNewUser} />

      <div className="app__main">
        <div className="app__left">
          <Sidebar currentUser={user} updateChat={handleChat} />
        </div>

        <div className="app__right">
          <h1>{chatName}</h1>
          {/* <p className="app__description">Enter "CLR" to clear the chat</p> */}

          <div className="app__messages">
            <FlipMove>
              {messages.map(({ message, id }) => (
                <Message key={id} username={username} message={message} />
              ))}
            </FlipMove>
          </div>
          <form onSubmit={sendMessage} className="app__form">
            <FormControl className="app__formControl">
              <Input
                className="app__input"
                type="text"
                placeholder="Enter a message..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />

              <IconButton
                disabled={!input}
                variant="contained"
                color="primary"
                type="submit"
                onClick={sendMessage}
                className="app__submit"
              >
                <SendIcon className="app__sendIcon" />
              </IconButton>
            </FormControl>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { db, auth } from "./firebase.js";
import firebase from "firebase";

function Sidebar({ currentUser, updateChat }) {
  const [users, setUsers] = useState([]);
  // const [chatId, setChatId] = useState(null);

  useEffect(() => {
    //On component load, load all users from db and populate users state variable. Sort by convo timestamp if one exists
    db.collection("users")
      .orderBy("id", "asc")
      .onSnapshot((snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.data().id,
            user: doc.data().user,
          }))
        );
      });
  }, []);

  const handleMainChat = async () => {
    updateChat({
      id: "MainChat",
      chatName: "Main Chat",
    });
  };

  const handleChat = async (clickedUser) => {
    //TODO: useState is an async func. Therefore, anything that awaits a state change should be placed
    //in a useEffect that is dependant on the respective state variable! Otherwise code will run BEFORE
    //State is updated

    //user contains a username (user.user) and id (user.id)
    console.log("handlechat currentUser", currentUser);
    console.log("handlechat clickedUser", clickedUser);
    //Check if chat with user already exists
    let convoExists = false;

    //If convo exists this will work
    await db
      .collection("users")
      .doc(currentUser.id)
      .collection("chats")
      .where("chatUser", "==", clickedUser.user)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // Conversation Exists! Open the convo
          console.log(doc.id, " => ", doc.data());
          console.log("chat id  => ", doc.data().id);
          convoExists = true;
          console.log("Convo exists!", convoExists);
          updateChat({
            id: doc.data().id,
            chatName: doc.data().chatUser,
          });
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });

    if (!convoExists) {
      console.log("No convo exists!", convoExists);
      let convoId = "";
      //CREATE NEW CHAT DOC WITH USERS FIELD
      await db
        .collection("chats")
        .add({
          users: [currentUser.user, clickedUser.user],
        })
        .then((docRef) => {
          console.log("Document created with ID: ", docRef.id);
          convoId = docRef.id;
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
      //DISPLAY FIRST WELCOME MESSAGE
      await db.collection("chats").doc(convoId).collection("messages").add({
        username: "Welcome",
        message: "Please enter a message",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      //Refer to new convo id in users database
      let chatUsers = [currentUser, clickedUser];
      console.log(chatUsers);

      await db.collection("users").doc(currentUser.id).collection("chats").add({
        chatUser: clickedUser.user,
        id: convoId,
      });

      await db.collection("users").doc(clickedUser.id).collection("chats").add({
        chatUser: currentUser.user,
        id: convoId,
      });

      //Set chat name to clicked users name
      let chatName = clickedUser.user;
      console.log("chat name > ", chatName);

      //call updateChat and pass in new chat id and chat name
      updateChat({
        id: convoId,
        chatName: chatName,
      });
    }

    // .doc().collection("chats");
    //   .where(doc.chatUser == clickedUser)
    // If yes, open the chat
    // If no, open a new chat
  };

  return (
    <div className="sidebar">
      <h2>Chats</h2>
      <ul className="sidebar__ul">
        <li className="sidebar__li" onClick={() => handleMainChat()}>
          <h3>Main Chat</h3>
        </li>
      </ul>
      <h2>Start a new chat</h2>
      <ul className="sidebar__ul">
        {users.map(
          (u) =>
            u.id !== currentUser.id && (
              <li
                key={u.id}
                className="sidebar__li"
                onClick={() => handleChat(u)}
              >
                <h3>{u.user}</h3>
              </li>
            )
        )}
      </ul>
    </div>
  );
}

export default Sidebar;

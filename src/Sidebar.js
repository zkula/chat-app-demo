import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { db, auth } from "./firebase.js";

function Sidebar() {
  const [users, setUsers] = useState([
    {
      user: "Zach",
      id: 1,
    },
    {
      user: "Brandon",
      id: 2,
    },
    {
      user: "Erika",
      id: 3,
    },
  ]);

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

  return (
    <div className="sidebar">
      <h2>Chats</h2>
      <ul className="sidebar__ul">
        <li className="sidebar__li">
          <h3>Main Chat</h3>
        </li>
      </ul>
      <h2>Start a new chat</h2>
      <ul className="sidebar__ul">
        {users.map((user) => (
          <li key={user.id} className="sidebar__li">
            <h3>{user.user}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;

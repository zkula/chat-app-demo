import React, { useState, useEffect } from "react";
import "./Header.css";
import { auth, db } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import firebase from "firebase";

/*FROM MATERIAL UI - STYLING MODAL */
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Header({ usernameHandler }) {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false); //for sign up modal
  const [name, setName] = useState("NAME");

  /* For Modal */
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  /*For Sign Up, Sign In, and User Info*/
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [openSignIn, setOpenSignIn] = useState(false);

  // CURRENT ISSUE -> SOMETIMES USER NOT SENT THROUGH PROPERLY WHEN NEW USER CREATED.
  //USER.DISPLAYNAME IS SENDING AS NULL WHEN THE OBJECT ACTUALLY HAS A USERNAME THERE. WTF?

  // useEFFECT -> Runs a piece of code based on a specific condition
  useEffect(() => {
    console.log("firebase -> ", firebase.auth());
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        // setUser(authUser);
        console.log("AUTHUSER", authUser, authUser.uid, authUser.displayName);
        // console.log("Username", name);
        if (authUser.displayName && authUser.uid) {
          setUser({
            id: authUser.uid,
            // user: name,
            user: authUser.displayName,
          });
        }
      } else {
        //user has logged out
        setUser(null);
      }
    });
    return () => {
      //Perform some cleanup actions before refiring the useEffect
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    usernameHandler(user);
  }, [user]);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        console.log("signup auth user -> ", authUser);
        db.collection("users").doc(authUser.user.uid).set({
          user: username,
          id: authUser.user.uid,
        });
        setUser({
          id: authUser.user.uid,
          user: username,
        });
        // setName(username);
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        console.log("USER SIGN IN -> ", authUser);
        setUser({
          user: authUser.user.displayName,
          id: authUser.user.uid,
        });
      })
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  const signOut = (u) => {
    if (u) {
      auth.signOut();
    }
    console.log("USER SIGNED OUT");
    setUser(null);
  };

  return (
    <div className="header">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=399&h=399"
                alt=""
              ></img>
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="loginButton" type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      {/*Sign In Modal */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=399&h=399"
                alt=""
              ></img>
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="loginButton" type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="header__left">
        <img
          src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=399&h=399"
          alt="FB"
        />
        {/* <input type="text" /> */}
      </div>
      <div className="header__right">
        <div className="header__rightUser">
          <p>Welcome</p>
          <h4>{user ? user.user : "Guest"}</h4>
        </div>
        <div className="header__rightLogin">
          {/*Conditional Sign Out If user exists */}
          {user ? (
            <Button className="logoutButton" onClick={(user) => signOut(user)}>
              Logout
            </Button>
          ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;

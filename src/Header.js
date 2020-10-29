import React, {useState, useEffect} from 'react'
import "./Header.css"
import { auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";

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
  

function Header({usernameHandler}) {
   const [user, setUser] = useState(null);
   const [open, setOpen] = useState(false); //for sign up modal

   /* For Modal */
   const classes = useStyles();
   const [modalStyle] = useState(getModalStyle);
 
   /*For Sign Up, Sign In, and User Info*/
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [email, setEmail] = useState("");
   const [openSignIn, setOpenSignIn] = useState(false);
 
   //useEFFECT -> Runs a piece of code based on a specific condition
   useEffect(() => {
     const unsubscribe = auth.onAuthStateChanged((authUser) => {
       if (authUser) {
         //user has logged in
         console.log("USER",authUser);
         setUser(authUser);
         usernameHandler(user);
       } else {
         //user has logged out
         setUser(null);
       }
     });
     return () => {
       //Perform some cleanup actions before refiring the useEffect
       unsubscribe();
     };
   }, [user, username]);

   const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
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
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };


    // const signOut = () => {
    //     if (user) {
    //       auth.signOut();
    //     }
    //     setUser (null);
    //   };

    return (
        <div className="header">

        <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
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
                src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
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
                <img src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=399&h=399" alt="FB"/>
                <input type="text"/>
            </div>
            <div className="header__right">
                    
                 <div className="header__rightUser">
                    <p>Welcome</p>
                    <h4>
                        {user? user.displayName: 'Guest'}
                    </h4>
           
                </div>   
                <div className="header__rightLogin">
                  {/*Conditional Sign Out If user exists */}
                {user ? (
                    <Button className="logoutButton" onClick={() => auth.signOut()}>Logout</Button>
                ) : (
                <div className="app__loginContainer">
                    <Button onClick={() => setOpen(true)}>Sign Up</Button>
                    <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                </div>
                 )}
                </div>    
           
                
                
            </div>
        </div>
    )
}

export default Header

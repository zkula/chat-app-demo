import React, {useState, useEffect} from 'react';
import './App.css';
import { Button, FormHelperText, InputLabel, Input } from '@material-ui/core';
import { FormControl, IconButton } from '@material-ui/core';
import  SendIcon from '@material-ui/icons/Send';
import Message from "./Message"
import {db,auth} from "./firebase.js"
import Header from './Header';
import firebase from 'firebase'
import FlipMove from 'react-flip-move';


function App() {
const [input, setInput] = useState('');
const[messages,setMessages] = useState([{
  username:'Guest',
  message: 'Please enter a message',
}]);
const[username, setUsername] = useState('');
const[isDeleting, setIsDeleting] = useState(false);

useEffect(()=> {
  
    //run once when the app loads
  db.collection('messages')
  .orderBy('timestamp', 'desc')
  .onSnapshot(snapshot => {
    if(isDeleting === false){
      setMessages(snapshot.docs.map(doc=> ({id: doc.id, message: doc.data()})))
    }
  })
  
  
},[])

const sendMessage = (event) => {
  //DB Logic
  event.preventDefault();
  if(input === "CLR"){
    setIsDeleting(true);

    setMessages([{
      username: null,
      message: 'Deleting Conversation...',
    }])

    messages.map(({message, id})=>(
      db.collection("messages").doc(id).delete().catch(function(error) {
        console.error("Error removing document: ", error);
      })
     ))

     setIsDeleting(false);

     db.collection('messages').add({
      username:'Welcome',
      message: 'Please enter a message',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })


  }else {
    db.collection('messages').add({
      message: input,
      username: username,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    
  }
  
  setInput('');
  
}

const handleUsername = (user) => {
  console.log("HANDLER", user);
  setUsername(user.displayName);
}

  return (
    <div className="app">
      <Header usernameHandler = {handleUsername}/>
      <h1>Main Chat</h1>
      {/* <p className="app__description">Enter "CLR" to clear the chat</p> */}
        
      <div className="app__core">
        <div className="app__messages">
        <FlipMove>
          {messages.map(({message, id})=>(
            <Message key={id} username={username} message={message} />
           ))}
        </FlipMove>
        
        </div>
        <form onSubmit={sendMessage} className="app__form">
        <FormControl className="app__formControl">
        

          <Input className="app__input" type="text" placeholder="Enter a message..." value={input} onChange={event => setInput(event.target.value)} className="app__input"/>   


        <IconButton
          disabled={!input} variant='contained' color='primary' type="submit" onClick={sendMessage} className="app__submit">
            <SendIcon />
        </IconButton>

      </FormControl>
    </form>
      </div>  
      

      
      
    
      
    </div>
  );
}

export default App;

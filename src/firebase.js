import firebase from "firebase"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkJ8YpadZtPiag-oM-lGSrKTEfmsdqgyU",
  authDomain: "chat-app-a62fe.firebaseapp.com",
  databaseURL: "https://chat-app-a62fe.firebaseio.com",
  projectId: "chat-app-a62fe",
  storageBucket: "chat-app-a62fe.appspot.com",
  messagingSenderId: "76776129293",
  appId: "1:76776129293:web:80c17d764f7deff8536644",
  measurementId: "G-6JQZP93C79"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  
  export { db, auth };

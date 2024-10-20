import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCidCKWJqPDBe3MLfkXn2Q64welapLlZqU",
    authDomain: "dailychecks-6e1a4.firebaseapp.com",
    projectId: "dailychecks-6e1a4",
    storageBucket: "dailychecks-6e1a4.appspot.com",
    messagingSenderId: "391372631659",
    appId: "1:391372631659:web:798281424cfac7548acb2e"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
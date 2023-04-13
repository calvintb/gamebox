import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCxkEpY6LJ9FbYzES_U1PwspMUvYpKXAhE",
    authDomain: "gamebox-49a20.firebaseapp.com",
    projectId: "gamebox-49a20",
    storageBucket: "gamebox-49a20.appspot.com",
    messagingSenderId: "642607547473",
    appId: "1:642607547473:web:489525b258e92f3837a470"
  };

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)


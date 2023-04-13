import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
import { getAuth, createUserWithEmailAndPassword, User, signInWithEmailAndPassword } from "firebase/auth";



const firebaseConfig = {
    apiKey: "AIzaSyCxkEpY6LJ9FbYzES_U1PwspMUvYpKXAhE",
    authDomain: "gamebox-49a20.firebaseapp.com",
    projectId: "gamebox-49a20",
    storageBucket: "gamebox-49a20.appspot.com",
    messagingSenderId: "642607547473",
    appId: "1:642607547473:web:489525b258e92f3837a470"
  };

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)
export const auth = getAuth(app);

export const createAccount = (email:string, password:string) => {createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    type authUser = User & {
      accessToken: string,
    }
    const user = userCredential.user as authUser;
    if (user && user.accessToken) window.localStorage.setItem("token", user.accessToken);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });}

  export const loginUser = (email:string, password:string) => {signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      type authUser = User & {
        accessToken: string,
      }
      const user = userCredential.user as authUser;
      if (user && user.accessToken) window.localStorage.setItem("token", user.accessToken);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });}
import { initializeApp } from "firebase/app";
import { getFirestore, collection, where, getDocs, getDoc, setDoc, doc } from "@firebase/firestore"
import { getAuth, createUserWithEmailAndPassword, User, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, child, get, set, query} from "firebase/database";



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

export const createAccount = (email:string, password:string, username:string) => {createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    type authUser = User & {
      accessToken: string,
    }
    const user = userCredential.user as authUser;
    if (user && user.accessToken) {
      window.localStorage.setItem("token", user.accessToken)
      setUser(email, username)
    };
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

    export const setUser = async (email:string, username:string) => {
      const user = auth.currentUser?.uid
      const userRef = collection(firestore, 'users')
      await setDoc(doc(userRef, user), {
        username: username, email: email});
    }

    export const getUser = async () => {  
      const user = auth.currentUser?.uid

      const docRef = doc(firestore, "users", `${user}`);
      const docSnap = await getDoc(docRef);
      

      const querySnapshot = await getDocs(collection(firestore, "users"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }

    

  
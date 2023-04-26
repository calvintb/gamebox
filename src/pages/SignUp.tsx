import { useEffect, useState } from "react"
import { auth, createAccount, database } from "../firebase_setup/firebase";
import { useNavigate } from "react-router-dom";
import { push, ref } from "firebase/database";

type gameUser = {
    username: string,
    id: string
  }


export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [authenticated, setAuthenticated] = useState(false)
    const navigate = useNavigate();

    

    function addUser () {
        const userRef = ref(database, "/users");
        const user = {
          username,
          id: auth.currentUser?.uid
        };
        push(userRef, user);
    };

    useEffect(()=>{
        if (authenticated) {
            addUser()
        }
    }, [authenticated]);

    useEffect(()=>{
        const authObserver = auth.onAuthStateChanged((user) => {
            if (user && !authenticated && username) {
                setAuthenticated(true)
            }
        })

        if (window.localStorage.getItem("token")){
            navigate("/game", {
                replace: true
            })}
    }, []);

        return(
        <div>
            This is the Sign Up Page
            <form onSubmit={(e)=>{e.preventDefault(); addUser(); createAccount(email, password, username);navigate("/game", {
                replace: true
            })}}>
                <input value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <input value={username} onChange={(e)=>setUsername(e.target.value)}/>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}
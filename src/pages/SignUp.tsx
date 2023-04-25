import { useEffect, useState } from "react"
import { createAccount, setUser } from "../firebase_setup/firebase";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();


    useEffect(()=>{
        if (window.localStorage.getItem("token")){
            navigate("/game", {
                replace: true
            })}
        });

        return(
        <div>
            This is the Sign Up Page
            <form onSubmit={(e)=>{e.preventDefault(); createAccount(email, password, username);navigate("/game", {
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
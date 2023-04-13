import { useState } from "react"
import { loginUser } from "../firebase_setup/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        if (window.localStorage.getItem("token")){
        navigate("/game", {
                    replace: true
                })}
            });
            
    return(
        <div>
            This is the Login Page
            <form onSubmit={(e)=>{e.preventDefault();loginUser(email, password)}}>
                <input value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
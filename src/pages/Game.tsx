import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, getUser } from "../firebase_setup/firebase";


export const Game = () => {

    const authObserver = auth.onAuthStateChanged((user) => {
    if (user) {
        getUser()
    }
    })
    const navigate = useNavigate();
    

    return(
        <div>
            This is the Game Page
        </div>
    )
}
import { useNavigate } from "react-router-dom";
import { database } from "../firebase_setup/firebase";
import { push, ref } from "firebase/database";
import { useState } from "react";
import { CreateRoom } from "../components/createRoom";
import "../index.css"

export const Home = () => {
    const [showCreateRoom, setShowCreateRoom] = useState(false)
    
    const navigate = useNavigate();

    

    return(
        <>
        <h1>Gamebox Home</h1>
        {!showCreateRoom &&
            <div className="super-container">
                <button className="vertical-center" onClick={() => setShowCreateRoom(true)}>Host Game</button>
                <button className="vertical-center" onClick={() => navigate('/signUp')}>Join Game</button>
            </div>
        }
        {showCreateRoom &&
            <CreateRoom/>
        }
            
        </>
        
    )
}
import { useNavigate } from "react-router-dom";
import { database } from "../firebase_setup/firebase";
import { push, ref } from "firebase/database";
import { useState } from "react";
import { CreateRoom } from "../components/createRoom";

export const Home = () => {
    const [showCreateRoom, setShowCreateRoom] = useState(false)
    
    const navigate = useNavigate();

    

    return(
        <>
        {!showCreateRoom &&
            <div>
                <button onClick={() => setShowCreateRoom(true)}>Host Game</button>
                <button onClick={() => navigate('/signUp')}>Join Game</button>
            </div>

        }
        {showCreateRoom &&
            <CreateRoom/>
        }
            
        </>
        
    )
}
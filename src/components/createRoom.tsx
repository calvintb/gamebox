import { useState } from "react"
import { database } from "../firebase_setup/firebase";
import { onValue, push, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";

export const CreateRoom = () => {
    const [roomCode, setRoomCode] = useState("")
    const [host, setHost] = useState("")
    const navigate = useNavigate();

    
    async function createRoom(){
        const roomRef = ref(database, "/rooms");
        const room = {
          roomCode: roomCode,
          host: host
        };
        const result = await push(roomRef, room);
        onValue(result, (snapshot)=> {
            const data = snapshot.val()
            navigate('/game', {state: {roomId:data.id}})
        })
    }
    return (
        <div>
            <input placeholder="roomcode..." value={roomCode} onChange={(e) => setRoomCode(e.target.value)}></input>
            <input placeholder="player name..." value={host} onChange={(e) => setHost(e.target.value)}></input>
            <button onClick={() => {createRoom(); }}>Host</button>
        </div>
    )
}
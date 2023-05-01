import { useEffect, useState } from "react"
import { database } from "../firebase_setup/firebase";
import { equalTo, onValue, orderByChild, push, query, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";

export const CreateRoom = () => {
    const [roomCode, setRoomCode] = useState("")
    const [data, setData] = useState();
    const [host, setHost] = useState("")
    const navigate = useNavigate();

    const randomCode = () => {
        let code = '';
        const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const codeLength = 6;
      
        for (let i = 0; i < codeLength; i++) {
          code += alpha.charAt(Math.floor(Math.random() * alpha.length));
        }
      
        return code;
    };

    // on load check get random code not in database
    useEffect(() => {
        const code = randomCode()
        const roomRef = ref(database, 'rooms/');
        const roomQuery = query(roomRef, orderByChild('roomCode'), equalTo(code));
        
        const listener = onValue(roomQuery, (snapshot) => {
            // in the super unlikly chance the code is the same as one that exists, generate a new one
          if (!snapshot.val()) {
            setRoomCode(code)
          }
          else {
            setRoomCode(randomCode())
          }
        });
        
        return () => {
          listener(); // Clean up the listener when the component unmounts
        };
      }, []);
    
    
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
            {/* <input placeholder="roomcode..." value={roomCode} onChange={(e) => setRoomCode(e.target.value)}></input> */}
            <input placeholder="player name..." value={host} onChange={(e) => setHost(e.target.value)}></input>
            <button onClick={() => {createRoom(); }}>Host</button>
        </div>
    )
}
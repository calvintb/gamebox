import { useState, useEffect } from "react"
import { Question } from "../components/Question"
import { PlayerCard } from "../components/PlayerCard"
import { Timer } from "../components/Timer";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, database } from "../firebase_setup/firebase";
import { equalTo, get, getDatabase, onValue, orderByChild, orderByKey, query, ref, remove } from "firebase/database";
import {User, Room} from "../lib/types"

export const Game = () => {
    const [data, setData] = useState();
    const [room, setRoom] = useState<Room>();
    const [users, setUsers] = useState<User[]>([]);
    const [timer, setTimer] = useState("05");
    const [response, setResponse] = useState("");
    // const [roomId, setRoomId] = useState("");

    const navigate = useNavigate();

    const location = useLocation();



    useEffect(() => {
        if(!location.state){
          navigate('/')
        }
        const roomId = location.state.roomId;

        const userRef = ref(database, `/rooms/${roomId}/users`);
        
        onValue(userRef, (snapshot) => {
          const users = snapshot.val();
          const newUserList: User[] = [];
    
          for (let id in users) {
            newUserList.push({ id, ...users[id] });
          };
    
          setUsers(newUserList);
        });
    }, [database]);

    useEffect(() => {
      if(!location.state){
        navigate('/')
      }
      const roomId = location.state.roomId;

      const roomRef = ref(database, `/rooms/${roomId}`)
      onValue(roomRef, (snapshot) => {
        const newRoom: Room = snapshot.val()
        setRoom(newRoom)
      })

    }, [])

    const leaveGame = () => {
      window.localStorage.setItem("token", "");
      
      const leavingUser = ref(database, `/rooms/${location.state.roomId}/users/${location.state.user}`)
      remove(leavingUser)
      navigate('/')
      //Also remove user from game room list in RTDB

    }

    return(
      <main>
        <>
        {room &&
          <>
            <h1>ROOM CODE: {room.roomCode}</h1>
            <h2>HOST: {room.host}</h2> 
          </>
        }       
        <Question prompt={"What food should you not bring to a potluck."}/>
        
        <input type="text" value={response} onChange={(e)=>setResponse(e.target.value)}/>
        <button>SUBMIT RESPONSE</button>
        <Timer timer={timer} update={setTimer}/>
        <button>START GAME</button> <button onClick={() => {leaveGame()}}>Leave</button>
        </>
        

        <div className=".player-card-label">
          {users.map((user, index) => {
          return <PlayerCard key={index + user.name} name={user.name} geolocation={user.location}/>
          })}
        </div>
          

      </main>

    )
}

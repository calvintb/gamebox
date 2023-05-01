import { useState, useEffect } from "react"
import { Question } from "../components/Question"
import { PlayerCard } from "../components/PlayerCard"
import { Timer } from "../components/Timer";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, database } from "../firebase_setup/firebase";
import { get, getDatabase, onValue, orderByChild, query, ref } from "firebase/database";
import {User} from "../lib/types"

export const Game = () => {
    const [data, setData] = useState();
    // const [users, setUsers] = useState<gameUser[]>([]);

    const [users, setUsers] = useState<User[]>([]);
    const [timer, setTimer] = useState("05");
    const [response, setResponse] = useState("");

    const navigate = useNavigate();

    const {state} = useLocation();
    const roomId = state.roomId;

    useEffect(() => {
        const userRef = ref(database, `/rooms/${roomId}/users`);
        
        onValue(userRef, (snapshot) => {
          const users = snapshot.val();
          const newUserList: User[] = [];
    
          for (let id in users) {
            newUserList.push({ id, ...users[id] });
          };
          console.log(newUserList)
    
          setUsers(newUserList);
        });
    }, [database]);


    return(
      <main>
        <>        
        <Question prompt={"What food should you not bring to a potluck."}/>
        
        <input type="text" value={response} onChange={(e)=>setResponse(e.target.value)}/>
        <button>SUBMIT RESPONSE</button>
        <Timer timer={timer} update={setTimer}/>
        <button>START GAME</button>
        </>
        


        <div>
          {users.map((user) => {
          return <PlayerCard key={user.id} name={user.name} geolocation={user.location}/>
          })}
        </div>
       
  
          
          

      </main>

    )
}

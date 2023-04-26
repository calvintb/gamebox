import { useState } from "react"
import { Question } from "../components/Question"
import { PlayerCard } from "../components/player_card"
import { Timer } from "../components/Timer";

type User = {
    id: string;
    name: string;
    location: string;
}

export const Game = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [timer, setTimer] = useState("05");
    const [response, setResponse] = useState("");


    return(
        <>        
        <h1>
            This is the Game Page
        </h1>
        <Question prompt={"What food should you not bring to a potluck."}/>
        {users.map(user => {
            <PlayerCard name={user.name} geolocation={user.location}/>
        })}
        <input type="text" value={response} onChange={(e)=>setResponse(e.target.value)}/>
        <button>SUBMIT RESPONSE</button>
        <Timer timer={timer} update={setTimer}/>
        <button>START GAME</button>
        </>
    )
}
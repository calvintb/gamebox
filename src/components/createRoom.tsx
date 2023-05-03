import { useEffect, useState } from "react"
import { database } from "../firebase_setup/firebase";
import { equalTo, onValue, orderByChild, push, query, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from '@react-spring/web'

export const CreateRoom = () => {

  const [click, setClick] = useState(false);

  function isClicked() {
      if(click){
          return 1200;
      }else {
          return 100;   
      }
  }

  const [springs, api] = useSpring(() => ({     
    from: { x: 700 },
  }))

  const handleClick = () => {
      setClick(!click);
      api.start({
          from: {
            x: springs.x,
          },
          to: {
            x: isClicked(),
          },
      })
  }

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
            navigate('/game', {state: {roomId:result.key, host:true}})
        })
    }
    return (
        <div>
            <div>
            {/* <input placeholder="roomcode..." value={roomCode} onChange={(e) => setRoomCode(e.target.value)}></input> */}
            <input className="margin-center" placeholder="player name..." value={host} onChange={(e) => setHost(e.target.value)}></input>
            <button className="margin-center" onClick={() => {createRoom(); }}>Host</button>
            </div>
            <br></br>
            <br></br>
            <animated.button onClick={handleClick} style={{...springs}}>click me</animated.button>
        </div>
    )
}
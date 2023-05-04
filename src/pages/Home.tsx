import { useNavigate } from "react-router-dom";
import { database } from "../firebase_setup/firebase";
import { push, ref } from "firebase/database";
import { useState } from "react";
import { CreateRoom } from "../components/createRoom";
import "../index.css"
import { useSpring, animated } from '@react-spring/web'

export const Home = () => {

    const [springs1, api1] = useSpring(() => ({     
        from: { x: 1500, y: 100, rotate: 0},
        to: { x: -100, rotate: 1000},
        loop: true,
        config: {duration: 7000},
      }))


      const [springs2, api2] = useSpring(() => ({     
        from: { x: -100, y: 200, rotate: 0},
        to: { x: 1500, rotate: 1000},
        loop: true,
        config: {duration: 10000},
      }))
    
      const [springs3, api3] = useSpring(() => ({     
        from: { x: 0, y: -600, rotate: 0},
        to: { x: 1700, y: 400, rotate: 1000},
        loop: true,
        config: {duration: 9000},
      }))

      const [springs4, api4] = useSpring(() => ({     
        from: { x: -100, y: -450, rotate: 0},
        to: { x: 1500, y: -450, rotate: 1000},
        loop: true,
        config: {duration: 5000},
      }))

      const [springs5, api5] = useSpring(() => ({     
        from: { x: 1500, y: 100, rotate: 1000},
        to: { x: 0, y: -700, rotate: 0},
        loop: true,
        config: {duration: 6000},
      }))

    const [showCreateRoom, setShowCreateRoom] = useState(false)
    
    const navigate = useNavigate();

    

    return(
        <>
        <h1>Gamebox Home</h1>
        {!showCreateRoom &&
            <>
            <div className="super-container">
                <button className="vertical-center" onClick={() => setShowCreateRoom(true)}>Host Game</button>
                <button className="vertical-center" onClick={() => navigate('/signUp')}>Join Game</button>
            </div>
            <animated.div
            //onClick={handleClick}
            style={{
              width: 100,
              height: 100,
              background: 'red',
              borderRadius: 8,
              ...springs1,
            }}
          ></animated.div>
          <animated.div
            //onClick={handleClick}
            style={{
              width: 100,
              height: 100,
              background: 'yellow',
              borderRadius: 10,
              ...springs2,
            }}
          ></animated.div>
          <animated.div
            //onClick={handleClick}
            style={{
              width: 100,
              height: 100,
              background: 'purple',
              borderRadius: 10,
              ...springs3,
            }}
          ></animated.div>
          <animated.div
            //onClick={handleClick}
            style={{
              width: 70,
              height: 70,
              background: '#66FF00',
              borderRadius: 10,
              ...springs4,
            }}
          ></animated.div>
          <animated.div
            //onClick={handleClick}
            style={{
              width: 70,
              height: 70,
              background: '#AFEEEE',
              borderRadius: 10,
              ...springs5,
            }}
          ></animated.div>
          </>
        }
        {showCreateRoom &&
            <>
            <CreateRoom/>
            <animated.div
            //onClick={handleClick}
            style={{
              width: 100,
              height: 100,
              background: 'red',
              borderRadius: 8,
              ...springs1,
            }}
          ></animated.div>
            </>
        }
            
        </>
        
    )
}
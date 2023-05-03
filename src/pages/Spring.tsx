import { useSpring, animated } from '@react-spring/web'
import { useState } from 'react'


export const Spring = () => {

    const [reverse, setReverse] = useState(false);
    const [springs, api] = useSpring(() => ({     
        from: { x: 1500, rotate: 0},
        to: { x: -100, rotate: 1000},
        loop: true,
        config: {duration: 10000},
      }))
    

    const [springs2, api2] = useSpring(() => ({     
        from: { x: 1500, rotate: 1000},
        to: { x: -100, rotate: 0},
        loop: true,
        config: {duration: 10000},
    }))

    const [springs3, api3] = useSpring(() => ({     
        from: { x: 1550, },
        to: { x: -200, },
        loop: true,
        config: {duration: 10000},
    }))


    // const handleClick = () => {
    //     if(reverse){
    //         api.start({
    //             from: {
    //             x: 1000,
    //             },
    //             to: {
    //             x: 0,
    //             },
    //         })
    //     } else {
    //         api.start({
    //             from: {
    //             x: 0,
    //             },
    //             to: {
    //             x: 1000,
    //             },
    //         })
    //     }
    //     setReverse(!reverse)
    //}

    return (
        <div>
        <animated.div
        //onClick={handleClick}
        style={{
          width: 100,
          height: 100,
          background: 'blue',
          borderRadius: 8,
          ...springs2,
        }}
      />
        <animated.div
        //onClick={handleClick}
        style={{
          width: 80,
          height: 80,
          background: '#ff6d6d',
          borderRadius: 8,
          ...springs,
        }}
      />
      <animated.div
        //onClick={handleClick}
        style={{
          width: 50,
          height: 50,
          background: 'green',
          borderRadius: 8,
          ...springs2,
        }}
      />
      <animated.h1
        style={{
            ...springs3
        }}
      >Loading</animated.h1>
      </div>
    )
}
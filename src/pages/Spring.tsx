import { useSpring, animated } from '@react-spring/web'
import { useState } from 'react'


export const Spring = () => {

    const [reverse, setReverse] = useState(false);

    // const getFrom = () => {
    //     if (reverse) {
    //         return {
    //             x: 1000 ,
                
    //           }
    //     }
      
    //     if (!reverse) {
    //       return {
    //         x: 0 ,
    //       }
    //     }   
    //     setReverse(!reverse)
    // }

    // const getTo = () => {
    //     if (reverse) {
    //         return {
    //             x: 0 ,
    //         }
    //     }
      
    //     if (!reverse) {
    //         return {
    //             x: 1000 ,
    //         }
    //     }   
    // }

    const [springs, api] = useSpring(() => ({     
        from: {x: reverse? 0: 1000},
        to: { x: reverse? 1000: 0},
        //reset: true,
        loop: true,
        onStart: setReverse(!reverse),
        onResolve: setReverse(!reverse),
        config: {duration: 1000},
      }))
    
  
    
    // const [styles, api] = useSpring(() => ({ x: 0 }))

    // api.start({
    // x: 1,
    // })
    

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
          width: 80,
          height: 80,
          background: 'green',
          borderRadius: 8,
          ...springs,
        }}
      />
      </div>
    )
}
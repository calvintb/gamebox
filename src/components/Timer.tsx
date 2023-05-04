import React, { useRef, useEffect} from 'react'

type Props = {
    timer: string,
    update: Function
}

export const Timer = ({timer, update} : Props) => {
    const Ref = useRef(null);
    let id: NodeJS.Timer;


    const getTimeRemaining = (e:Date) => {
        const total = Date.parse(e.toString()) - Date.parse((new Date()).toString());
        const seconds = Math.floor((total / 1000) % 60)
        return {total, seconds};
    }

    const startTimer = (e:Date) => {
        let {total, seconds} = getTimeRemaining(e);
        console.log("UPDATE")
        if (total >= 0) {
            update(seconds > 9 ? seconds: '0' + seconds);
        }
        if (total == 0){
            clearInterval(id);
        }
    }

    const clearTimer = (e:Date) => {
        update(timer);

        id = setInterval(() => {
            startTimer(e);
        }, 1000)
        if (timer == "00"){
            clearInterval(id);
        }
        return () => {
            console.log("I got unmounted");
            clearInterval(id);
          }
    }
    

    const getDeadTime = () => {
        let endtime = new Date();
        endtime.setSeconds(endtime.getSeconds() + Number(timer));
        return endtime;
    }

    useEffect(()=>{
        clearTimer(getDeadTime());
        return () => {
            clearInterval(id);
        }
    },[]);


    return (
        <h2 style={{textAlign:"center"}}>{timer}</h2>
    )}
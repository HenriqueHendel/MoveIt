import { createContext, ReactNode, useEffect, useState, useContext } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextProps {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void
}

interface CountdownProviderProps {
    children: ReactNode
}

export const CountdownContext = createContext({} as CountdownContextProps)

let countDownTimeout: NodeJS.Timeout

export function CountdownContextProvider({children}: CountdownProviderProps){
    const {startNewChallenge} = useContext(ChallengesContext)

    const [time, setTime] = useState(0.1*60);
    const [isActive, setIsActive] = useState(false)
    const [hasFinished, setHasFinished] = useState(false)

    const minutes = Math.floor(time / 60);
    const seconds = time % 60

    const startCountdown = () =>{
        setIsActive(true)
    }

    const resetCountdown = () => {
        clearTimeout(countDownTimeout)
        setIsActive(false)
        setTime(0.1 * 60)
        setHasFinished(false)
    }

    useEffect(()=>{
        if(isActive && time > 0){
            countDownTimeout = setTimeout(()=>{
                setTime(time => time-1)
            }, 1000)
        }else if(isActive && time === 0) {
            setHasFinished(true)
            setIsActive(false)
            startNewChallenge()
        }
    }, [isActive, time])


    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountdown,
            resetCountdown
        }}>
            {children}
        </CountdownContext.Provider>
    )
}
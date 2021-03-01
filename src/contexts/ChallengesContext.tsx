import {useState, createContext, ReactNode, useEffect} from 'react'
import challenges from '../../challenges.json'

interface IChallengeProps {
    type: string
    description: string
    amount: number
}

interface ContextProps {
    level: number
    currentExperience: number
    challengesCompleted: number
    activeChallenge: IChallengeProps
    experienceToNextLevel: number
    levelUp: () => void
    startNewChallenge: () => void
    resetChallenge: () => void
    completeChallenge: () => void
}

interface ChallengeProviderProps {
    children: ReactNode
}

export const ChallengesContext = createContext({} as ContextProps)

export function ChallengesProvider({children}: ChallengeProviderProps) {
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0)
    const [challengesCompleted, setChallengesCompleted] = useState(0)
    const [activeChallenge, setActiveChallenge] = useState(null)

    useEffect(()=>{
        Notification.requestPermission();
    }, [])

    function levelUp(){
        setLevel(level + 1)
    }

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]

        setActiveChallenge(challenge)

        new Audio('/notification.mp3').play()

        if(Notification.permission === 'granted'){
            new Notification('Novo desafio!', {
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge(){
        setActiveChallenge(null)
    }

    function completeChallenge(){
        if(!activeChallenge){
            return;
        }

        const {amount} = activeChallenge;

        let finalExperience = currentExperience + amount;

        if(finalExperience >= experienceToNextLevel){
            finalExperience = finalExperience - experienceToNextLevel
            levelUp();
        }

        setCurrentExperience(finalExperience)
        setActiveChallenge(null)
        setChallengesCompleted(challengesCompleted + 1)
    }

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    return (
        <ChallengesContext.Provider value={{
            level, 
            levelUp, 
            currentExperience, 
            challengesCompleted,
            startNewChallenge,
            activeChallenge,
            resetChallenge,
            experienceToNextLevel,
            completeChallenge
        }}>
            {children}
        </ChallengesContext.Provider>
    )
}
import {useState, createContext, ReactNode} from 'react'
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

    function levelUp(){
        setLevel(level + 1)
    }

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]

        setActiveChallenge(challenge)
    }

    function resetChallenge(){
        setActiveChallenge(null)
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
            experienceToNextLevel
        }}>
            {children}
        </ChallengesContext.Provider>
    )
}
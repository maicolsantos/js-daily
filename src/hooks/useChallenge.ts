import { useEffect, useState } from 'react'
import { Challenge } from '../types/challenge'
import { getChallengeOfTheDay } from '../data/challenges'

export function useChallenge(): Challenge | null {
  const [challenge, setChallenge] = useState<Challenge | null>(null)

  useEffect(() => {
    getChallengeOfTheDay().then(setChallenge)
  }, [])

  return challenge
}

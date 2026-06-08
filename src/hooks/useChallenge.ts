import { useMemo } from 'react'
import { challenges } from '../data/challenges'
import { Challenge } from '../types/challenge'

function dateHash(dateStr: string): number {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0
  }
  return hash
}

export function useChallenge(): Challenge {
  return useMemo(() => {
    const today = new Date().toDateString()
    const idx = dateHash(today) % challenges.length
    return challenges[idx]
  }, [])
}

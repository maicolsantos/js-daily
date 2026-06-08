import { Challenge } from '../types/challenge'

function hashString(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  }
  return h
}

interface Meta {
  total: number
  chunkSize: number
  totalChunks: number
}

// in-memory cache: chunkIndex → Challenge[]
const chunkCache = new Map<number, Challenge[]>()
let meta: Meta | null = null

function getDataBase(): string {
  if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
    return chrome.runtime.getURL('data/')
  }
  return '/data/'
}

async function loadMeta(): Promise<Meta> {
  if (meta) return meta
  const res = await fetch(`${getDataBase()}meta.json`)
  meta = await res.json() as Meta
  return meta
}

async function loadChunk(chunkIdx: number): Promise<Challenge[]> {
  if (chunkCache.has(chunkIdx)) return chunkCache.get(chunkIdx)!
  const res = await fetch(`${getDataBase()}chunk-${chunkIdx}.json`)
  const data = await res.json() as Challenge[]
  chunkCache.set(chunkIdx, data)
  return data
}

export async function getChallengeOfTheDay(): Promise<Challenge> {
  const m = await loadMeta()
  const idx = hashString(new Date().toDateString()) % m.total
  const chunkIdx = Math.floor(idx / m.chunkSize)
  const posInChunk = idx % m.chunkSize
  const chunk = await loadChunk(chunkIdx)
  return chunk[posInChunk]
}

export async function getChallengeById(id: string): Promise<Challenge | undefined> {
  const m = await loadMeta()
  for (let i = 0; i < m.totalChunks; i++) {
    const chunk = await loadChunk(i)
    const found = chunk.find(c => c.id === id)
    if (found) return found
  }
  return undefined
}

// legacy sync export removed — use getChallengeOfTheDay() instead
export const allChallenges: Challenge[] = [] // stub, not used at runtime
export const challenges: Challenge[] = []    // stub for any lingering imports

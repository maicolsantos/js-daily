import { useState, useEffect, useCallback } from 'react'
import { StorageData } from '../types/challenge'

const DEFAULT_STORAGE: StorageData = {
  streak: 0,
  lastSolvedDate: '',
  solvedIds: [],
  code: {},
}

function isChromeStorageAvailable(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.storage?.local
}

async function storageGet(): Promise<StorageData> {
  if (!isChromeStorageAvailable()) {
    const raw = sessionStorage.getItem('js-daily')
    return raw ? JSON.parse(raw) : DEFAULT_STORAGE
  }
  return new Promise((resolve) => {
    chrome.storage.local.get(['jsdaily'], (result: Record<string, StorageData>) => {
      resolve(result.jsdaily ?? DEFAULT_STORAGE)
    })
  })
}

async function storageSet(data: StorageData): Promise<void> {
  if (!isChromeStorageAvailable()) {
    sessionStorage.setItem('js-daily', JSON.stringify(data))
    return
  }
  return new Promise((resolve) => {
    chrome.storage.local.set({ jsdaily: data }, resolve)
  })
}

export function useStorage() {
  const [data, setData] = useState<StorageData>(DEFAULT_STORAGE)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    storageGet().then((d) => {
      setData(d)
      setLoaded(true)
    })
  }, [])

  const update = useCallback(async (partial: Partial<StorageData>) => {
    const next = { ...data, ...partial }
    setData(next)
    await storageSet(next)
  }, [data])

  const saveCode = useCallback(async (challengeId: string, code: string) => {
    const next: StorageData = { ...data, code: { ...data.code, [challengeId]: code } }
    setData(next)
    await storageSet(next)
  }, [data])

  const markSolved = useCallback(async (challengeId: string) => {
    const today = new Date().toDateString()
    const alreadySolved = data.solvedIds.includes(challengeId)
    if (alreadySolved) return

    const lastDate = data.lastSolvedDate
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const newStreak = lastDate === yesterday || lastDate === today ? data.streak + 1 : 1

    const next: StorageData = {
      ...data,
      streak: newStreak,
      lastSolvedDate: today,
      solvedIds: [...data.solvedIds, challengeId],
    }
    setData(next)
    await storageSet(next)
  }, [data])

  return { data, loaded, update, saveCode, markSolved }
}

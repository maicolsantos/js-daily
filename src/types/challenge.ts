export interface Example {
  input: string
  output: string
  explanation?: string
}

export interface TestCase {
  input: any[]
  expected: any
  label: string
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Challenge {
  id: string
  title: string
  slug: string
  difficulty: Difficulty
  description: string
  examples: Example[]
  constraints: string[]
  starterCode: string
  starterCodeTS: string
  testCases: TestCase[]
  solution: string
}

export interface StorageData {
  streak: number
  lastSolvedDate: string
  solvedIds: string[]
  code: Record<string, string>
}

export interface TestResult {
  passed: boolean
  label: string
  input: any[]
  expected: any
  received: any
  error?: string
}

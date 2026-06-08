import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public', 'data')
mkdirSync(outDir, { recursive: true })

const raw = JSON.parse(readFileSync(join(root, 'src', 'data', 'merged_problems.json'), 'utf8'))

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function parseExamples(examples) {
  return (examples ?? []).map(ex => {
    const text = ex.example_text ?? ''
    const inputMatch = text.match(/Input:\s*(.+?)(?:\n|$)/s)
    const outputMatch = text.match(/Output:\s*(.+?)(?:\n|$)/s)
    const explanationMatch = text.match(/Explanation:\s*(.+?)(?:\n|$)/s)
    return {
      input: inputMatch ? inputMatch[1].trim() : text,
      output: outputMatch ? outputMatch[1].trim() : '',
      ...(explanationMatch ? { explanation: explanationMatch[1].trim() } : {}),
    }
  })
}

function parseTestCases(examples) {
  try {
    return (examples ?? []).map((ex, i) => {
      const text = ex.example_text ?? ''
      const inputMatch = text.match(/Input:\s*(.+?)(?:\n|$)/s)
      const outputMatch = text.match(/Output:\s*(.+?)(?:\n|$)/s)
      return {
        label: `Example ${i + 1}`,
        input: [inputMatch ? inputMatch[1].trim() : ''],
        expected: outputMatch ? outputMatch[1].trim() : '',
      }
    })
  } catch { return [] }
}

const challenges = raw.questions
  .filter(p => p.code_snippets?.javascript && p.code_snippets?.typescript)
  .map(p => ({
    id: slugify(p.title),
    title: p.title,
    slug: p.problem_slug ?? slugify(p.title),
    difficulty: (p.difficulty?.toLowerCase() ?? 'medium'),
    description: p.description ?? '',
    examples: parseExamples(p.examples),
    constraints: p.constraints ?? [],
    starterCode: p.code_snippets.javascript,
    starterCodeTS: p.code_snippets.typescript,
    testCases: parseTestCases(p.examples),
    solution: p.solution ?? '',
  }))

const CHUNK_SIZE = 100
const totalChunks = Math.ceil(challenges.length / CHUNK_SIZE)

for (let i = 0; i < totalChunks; i++) {
  const chunk = challenges.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
  writeFileSync(join(outDir, `chunk-${i}.json`), JSON.stringify(chunk))
}

writeFileSync(join(outDir, 'meta.json'), JSON.stringify({
  total: challenges.length,
  chunkSize: CHUNK_SIZE,
  totalChunks,
}))

console.log(`✓ ${challenges.length} challenges → ${totalChunks} chunks in public/data/`)

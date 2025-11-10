import { describe, it, expect } from 'vitest'

import { buildPrefixRange } from './utils'

describe('buildPrefixRange', () => {
  it('lowercases and trims input', () => {
    const { start, end } = buildPrefixRange('  HeLLo  ')
    expect(start).toBe('hello')
    expect(end).toBe('hello\uf8ff')
  })

  it('handles empty string', () => {
    const { start, end } = buildPrefixRange('')
    expect(start).toBe('')
    expect(end).toBe('\uf8ff')
  })

  it('handles whitespace-only string', () => {
    const { start, end } = buildPrefixRange('   ')
    expect(start).toBe('')
    expect(end).toBe('\uf8ff')
  })
})

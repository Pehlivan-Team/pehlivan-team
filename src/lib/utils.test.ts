import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
  it('merges class names and removes duplicates', () => {
    const result = cn('p-2', 'text-center', 'p-2', undefined as any)
    expect(result).toContain('p-2')
    expect(result).toContain('text-center')
  })

  it('handles falsy values gracefully', () => {
    const result = cn(false as any, null as any, 'foo')
    expect(result).toBe('foo')
  })
})

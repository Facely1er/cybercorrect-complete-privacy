import { describe, it, expect, vi } from 'vitest'
import { cn } from '../cn'

// Mock clsx and tailwind-merge
vi.mock('clsx', () => ({
  default: vi.fn((...inputs) => {
    const result: string[] = []
    inputs.forEach(input => {
      if (Array.isArray(input)) {
        result.push(...input.filter(Boolean))
      } else if (typeof input === 'object' && input !== null) {
        Object.entries(input).forEach(([key, value]) => {
          if (value) result.push(key)
        })
      } else if (input) {
        result.push(String(input))
      }
    })
    return result.join(' ')
  })
}))

vi.mock('tailwind-merge', () => ({
  twMerge: vi.fn((classes) => classes)
}))

describe('cn utility function', () => {
  it('should combine class names', () => {
    const result = cn('class1', 'class2', 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle empty inputs', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should filter out falsy values', () => {
    const result = cn('class1', null, 'class2', undefined, 'class3', false)
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const isDisabled = false
    
    const result = cn(
      'base-class',
      isActive && 'active-class',
      isDisabled && 'disabled-class'
    )
    
    expect(result).toBe('base-class active-class')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle objects with boolean values', () => {
    const result = cn({
      'class1': true,
      'class2': false,
      'class3': true
    })
    
    expect(result).toBe('class1 class3')
  })

  it('should handle mixed input types', () => {
    const result = cn(
      'base-class',
      ['array-class1', 'array-class2'],
      {
        'object-class1': true,
        'object-class2': false
      },
      'string-class'
    )
    
    expect(result).toBe('base-class array-class1 array-class2 object-class1 string-class')
  })

  it('should handle nested arrays', () => {
    const result = cn([
      'nested1',
      ['nested2', 'nested3'],
      'nested4'
    ])
    
    expect(result).toBe('nested1 nested2 nested3 nested4')
  })

  it('should handle complex conditional logic', () => {
    const variant: 'primary' | 'secondary' = 'primary'
    const size: 'large' | 'small' = 'large'
    const disabled = false
    
    const result = cn(
      'btn',
      {
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
        'btn-large': size === 'large',
        'btn-small': size === 'small',
        'btn-disabled': disabled
      }
    )
    
    expect(result).toBe('btn btn-primary btn-large')
  })

  it('should handle undefined and null values gracefully', () => {
    const result = cn(
      'class1',
      undefined,
      null,
      'class2',
      false,
      0,
      ''
    )
    
    expect(result).toBe('class1 class2')
  })

  it('should work with template literals', () => {
    const prefix = 'my'
    const suffix = 'class'
    
    const result = cn(`${prefix}-${suffix}`, 'additional-class')
    
    expect(result).toBe('my-class additional-class')
  })

  it('should handle empty strings', () => {
    const result = cn('class1', '', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('should handle whitespace-only strings', () => {
    const result = cn('class1', '   ', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('should be called with clsx and twMerge', async () => {
    const clsx = vi.mocked(await import('clsx')).default
    const twMerge = vi.mocked(await import('tailwind-merge')).twMerge
    
    cn('test-class')
    
    expect(clsx).toHaveBeenCalledWith(['test-class'])
    expect(twMerge).toHaveBeenCalled()
  })
})

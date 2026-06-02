import { type ClassValue } from 'react'

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ')
}
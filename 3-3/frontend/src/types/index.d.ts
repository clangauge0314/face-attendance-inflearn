import 'react'

declare global {
  interface Window {
    electronAPI?: {
      minimize?: () => void
      maximize?: () => void
      close?: () => void
    }
  }
}

declare module 'react' {
  interface CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag'
  }
}

declare module '*.css'


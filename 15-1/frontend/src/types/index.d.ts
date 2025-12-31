import 'react'

declare global {
  interface Window {
    electronAPI?: {
      minimize?: () => void
      maximize?: () => void
      close?: () => void
      onNavigateToAdmin?: (callback: () => void) => void
      removeNavigateToAdminListener?: (callback: () => void) => void
    }
  }
}

declare module 'react' {
  interface CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag'
  }
}

declare module '*.css'
import ThemeToggle from './theme-toggle'
import { useThemeStore } from '../../stores/theme-store'

const Layout = () => {
  const { isDark } = useThemeStore()

  return (
    <>
      <div
        className={`h-screen overflow-hidden bg-cover px-4 pt-12 transition-colors duration-200 ${
          isDark
            ? 'bg-linear-to-b from-[#06070f] via-[#0c1224] to-[#121a30] text-slate-100'
            : 'bg-linear-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900'
        }`}
      >
        <ThemeToggle />
      </div>
    </>
  )
}

export default Layout


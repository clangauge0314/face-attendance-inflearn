import { motion } from 'framer-motion'
import { Shield, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  buttonHover,
  buttonTap,
  containerVariants,
  itemVariants,
  pageVariants,
} from '../constants/animations'
import { getThemeClasses } from '../constants/theme'
import { useThemeStore } from '../stores/theme-store'

export const AdminLoginPage = () => {
  const { isDark } = useThemeStore()
  const theme = getThemeClasses(isDark)
  const navigate = useNavigate()

  return (
    <motion.div
      className="flex min-h-[calc(100vh-3rem)] items-center justify-center px-4 py-10 sm:px-6 sm:py-12 lg:py-16"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      <div className="w-full max-w-lg">
        <motion.div
          className={`relative rounded-3xl border ${theme.card.border} ${theme.card.bg} p-6 shadow-2xl ${theme.card.shadow} backdrop-blur sm:p-8`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <button
            onClick={() => navigate('/')}
            className={`absolute right-4 top-4 rounded-lg p-2 transition-colors ${
              isDark ? 'hover:bg-slate-800' : 'hover:bg-zinc-100'
            }`}
          >
            <X size={20} className={isDark ? 'text-slate-400' : 'text-zinc-600'} />
          </button>

          <motion.div className="mb-8" variants={itemVariants}>
            <div className={`mb-4 flex items-center gap-2.5 ${theme.text.icon}`}>
              <Shield size={18} className="shrink-0 text-red-500" />
              <span className="text-xs font-medium uppercase tracking-[0.5em]">Admin</span>
            </div>
            <h2 className={`mb-3 text-2xl font-semibold leading-tight sm:text-3xl ${theme.text.header}`}>
              관리자 인증
            </h2>
            <p className={`text-sm leading-relaxed ${theme.text.sub}`}>
              관리자 계정으로 로그인하여 시스템을 관리하세요.
            </p>
          </motion.div>

          <motion.form className="mb-6 flex flex-col gap-6" variants={itemVariants}>
            <div className="grid gap-5 sm:grid-cols-2">
              <motion.label className="flex flex-col gap-2.5" variants={itemVariants}>
                <span className={`text-sm font-semibold ${theme.text.label}`}>관리자 아이디</span>
                <input
                  className={`
                    rounded-2xl
                    border ${theme.input.border}
                    ${theme.input.bg}
                    px-3 py-2.5 text-sm outline-none transition-all
                    sm:px-5 sm:py-3.5 sm:text-base
                    ${theme.input.placeholder}
                    ${theme.input.text}
                    ${theme.input.focusBorder}
                    focus:ring-2 ${theme.input.focusRing}
                  `}
                  placeholder="admin"
                  type="text"
                  required
                  autoFocus
                />
              </motion.label>
              <motion.label className="flex flex-col gap-2.5" variants={itemVariants}>
                <span className={`text-sm font-semibold ${theme.text.label}`}>접속 비밀번호</span>
                <input
                  className={`
                    rounded-2xl
                    border ${theme.input.border}
                    ${theme.input.bg}
                    px-3 py-2.5 text-sm outline-none transition-all
                    sm:px-5 sm:py-3.5 sm:text-base
                    ${theme.input.placeholder}
                    ${theme.input.text}
                    ${theme.input.focusBorder}
                    focus:ring-2 ${theme.input.focusRing}
                  `}
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </motion.label>
            </div>

            <motion.button
              type="submit"
              className={`
                mt-2 w-full rounded-2xl py-4 text-base font-semibold transition-all active:scale-[0.98]
                bg-linear-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400
              `}
              whileHover={buttonHover}
              whileTap={buttonTap}
              variants={itemVariants}
            >
              관리자 로그인
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { BadgePlus, Lock } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  buttonHover,
  buttonTap,
  containerVariants,
  itemVariants,
  pageVariants,
} from '../constants/animations'
import { getThemeClasses } from '../constants/theme'
import { useThemeStore } from '../stores/theme-store'
import { useAuth } from '../hooks/useAuth'

const SignupPage = () => {
  const [name, setName] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isDark } = useThemeStore()
  const theme = getThemeClasses(isDark)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsLoading(true)

    try {
      await signup({ 
        organizationType: 'company',
        organizationId: undefined,
        name, 
        userId, 
        password 
      })

      toast.success('회원가입 성공')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.message || '회원가입 실패')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <motion.div
      className='flex min-h-[calc(100vh-3rem)] items-center justify-center px-4 py-10 sm:px-6 sm:py-12 lg:py-16'
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      <div className='w-full max-w-3xl'>
        <motion.div
          className={`rounded-3xl border ${theme.card.border} ${theme.card.bg} p-6 shadow-2xl ${theme.card.shadow} backdrop-blur sm:p-8`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className='mb-8' variants={itemVariants}>
            <div className={`mb-4 flex items-center gap-2.5 ${theme.text.icon}`}>
              <BadgePlus size={18} className='shrink-0' />
              <span className='text-xs font-medium uppercase tracking-[0.5em]'>Create Account</span>
            </div>
            <h2 className={`mb-3 text-2xl font-semibold leading-tight sm:text-3xl ${theme.text.header}`}>회원가입</h2>
            <p className={`text-sm leading-relaxed ${theme.text.sub}`}>
              얼굴 인식 출입 시스템을 사용하기 위한 계정을 생성하세요.
            </p>
          </motion.div>

          <motion.form className='mb-6 flex flex-col gap-6' onSubmit={handleSubmit} variants={itemVariants}>
            <div className='grid gap-5 sm:grid-cols-2'>
              <motion.label className='flex flex-col gap-2.5' variants={itemVariants}>
                <span className={`text-sm font-semibold ${theme.text.label}`}>이름</span>
                <input
                  className={`
                    rounded-2xl border ${theme.input.border} ${theme.input.bg}
                    px-3 py-2.5 text-sm outline-none transition-all
                    sm:px-5 sm:py-3.5 sm:text-base
                    ${theme.input.placeholder} ${theme.input.text}
                    ${theme.input.focusBorder} focus:ring-2 ${theme.input.focusRing}
                  `}
                  placeholder='홍길동'
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={isLoading}
                />
              </motion.label>
              <motion.label className='flex flex-col gap-2.5' variants={itemVariants}>
                <span className={`text-sm font-semibold ${theme.text.label}`}>사용자 아이디</span>
                <input
                  className={`
                    rounded-2xl border ${theme.input.border} ${theme.input.bg}
                    px-3 py-2.5 text-sm outline-none transition-all
                    sm:px-5 sm:py-3.5 sm:text-base
                    ${theme.input.placeholder} ${theme.input.text}
                    ${theme.input.focusBorder} focus:ring-2 ${theme.input.focusRing}
                  `}
                  placeholder='user123'
                  type='text'
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  disabled={isLoading}
                />
              </motion.label>
              <motion.label className='flex flex-col gap-2.5 sm:col-span-2' variants={itemVariants}>
                <span className={`text-sm font-semibold ${theme.text.label}`}>비밀번호</span>
                <input
                  className={`
                    rounded-2xl border ${theme.input.border} ${theme.input.bg}
                    px-3 py-2.5 text-sm outline-none transition-all
                    sm:px-5 sm:py-3.5 sm:text-base
                    ${theme.input.placeholder} ${theme.input.text}
                    ${theme.input.focusBorder} focus:ring-2 ${theme.input.focusRing}
                  `}
                  placeholder='••••••••'
                  type='password'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isLoading}
                />
              </motion.label>
            </div>

            <motion.button
              type='submit'
              disabled={isLoading}
              className={`${theme.button.primaryFull} w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={isLoading ? {} : buttonHover}
              whileTap={isLoading ? {} : buttonTap}
              variants={itemVariants}
            >
              {isLoading ? '처리 중...' : '회원가입'}
            </motion.button>
          </motion.form>

          <motion.div className="mt-5 sm:mt-6" variants={itemVariants}>
            <Link to="/login">
              <motion.button
                className={`
                  w-full rounded-xl border ${theme.card.border} px-5 py-3 text-sm font-medium transition-all sm:py-3.5
                  ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-zinc-600 hover:bg-zinc-50'}
                `}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <div className="flex items-center justify-center gap-2">
                  <Lock size={16} />
                  <span>로그인으로 돌아가기</span>
                </div>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default SignupPage


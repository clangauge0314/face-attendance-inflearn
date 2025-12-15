import { Lock, UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import { useThemeStore } from '../stores/theme-store'

const LoginPage = () => {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, _setIsLoading] = useState(false)
  const { isDark } = useThemeStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center px-4 py-10 sm:px-6 sm:py-12 lg:py-16">
      <div className="w-full max-w-lg">
        <div className={`rounded-3xl border p-6 shadow-2xl backdrop-blur sm:p-8 ${
          isDark 
            ? 'border-slate-700/50 bg-slate-800/50 shadow-slate-900/50' 
            : 'border-zinc-200 bg-white shadow-zinc-200'
        }`}>
          <div className="mb-8">
            <div className={`mb-4 flex items-center gap-2.5 ${isDark ? 'text-slate-400' : 'text-zinc-500'}`}>
              <Lock size={18} className="shrink-0" />
              <span className="text-xs font-medium uppercase tracking-[0.5em]">Sign In</span>
            </div>
            <h2 className={`mb-3 text-2xl font-semibold leading-tight sm:text-3xl ${
              isDark ? 'text-slate-100' : 'text-zinc-900'
            }`}>
              보안 출입 인증
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-zinc-600'}`}>
              등록된 얼굴 데이터와 계정을 기반으로 출입 로그를 자동으로 동기화합니다.
            </p>
          </div>

          <form className="mb-6 flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2.5">
                <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-zinc-700'}`}>사용자 아이디</span>
                <input
                  className={`
                    rounded-2xl border px-3 py-2.5 text-sm outline-none transition-all
                    sm:px-5 sm:py-3.5 sm:text-base
                    focus:ring-2
                    ${isDark 
                      ? 'border-slate-600 bg-slate-700/50 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500/20'
                    }
                  `}
                  placeholder="user123"
                  type="text"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  disabled={isLoading}
                />
              </label>
              <label className="flex flex-col gap-2.5">
                <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-zinc-700'}`}>접속 비밀번호</span>
                <input
                  className={`
                    rounded-2xl border px-3 py-2.5 text-sm outline-none transition-all
                    sm:px-5 sm:py-3.5 sm:text-base
                    focus:ring-2
                    ${isDark 
                      ? 'border-slate-600 bg-slate-700/50 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20' 
                      : 'border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500/20'
                    }
                  `}
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isLoading}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                mt-2 w-full rounded-2xl py-4 text-base font-semibold transition-all active:scale-[0.98]
                ${isDark 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? '처리 중...' : '출입 인증'}
            </button>
          </form>

          <div className="mt-4">
            <button
              className={`
                w-full rounded-xl border px-5 py-3 text-sm font-medium transition-all
                ${isDark 
                  ? 'border-slate-700 text-slate-200 hover:bg-white/5' 
                  : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlus size={16} />
                <span>회원가입</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage


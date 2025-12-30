import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useThemeStore } from '../stores/theme-store'
import { PageHeader } from '../components/common/page-header'
import { LoadingSpinner } from '../components/common/loading-spinner'

export const HistoryManagementPage = () => {
  const { isDark } = useThemeStore()
  const [isLoading, setIsLoading] = useState(true)
 
  const [page, setPage] = useState(0)
  const [hasMore, _setHasMore] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [page]) 

  const loadHistory = async () => {
    try {
      setIsLoading(true)
      
    } catch (error) {
      toast.error('출입 기록 로드 실패')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader 
        title="출입 기록 관리" 
        description="전체 사용자의 출입 이력을 조회하고 관리합니다"
        backButton={{ label: "대시보드로", to: "/admin" }}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">

          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner fullScreen={false} size={32} />
            </div>
          ) : (
            <>
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                    page === 0
                      ? isDark ? 'border-slate-800 text-slate-600' : 'border-zinc-200 text-zinc-300'
                      : isDark ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-zinc-300 text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <ChevronLeft size={16} />
                  이전
                </button>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-zinc-600'}`}>
                  페이지 {page + 1}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasMore}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                    !hasMore
                      ? isDark ? 'border-slate-800 text-slate-600' : 'border-zinc-200 text-zinc-300'
                      : isDark ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-zinc-300 text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  다음
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

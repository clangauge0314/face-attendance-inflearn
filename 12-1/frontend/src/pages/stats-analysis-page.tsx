import { PageHeader } from '../components/common/page-header'

export const StatsAnalysisPage = () => {

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader 
        title="통계 및 분석" 
        description="시스템 전체 현황을 분석합니다"
        backButton={{ label: "대시보드로", to: "/admin" }}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl space-y-8">
        </div>
      </div>
    </div>
  )
}
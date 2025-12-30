import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { 
  getAdminUsers, 
  type AdminUser 
} from '../api/admin'
import { PageHeader } from '../components/common/page-header'

export const UserManagementPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [_filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [searchQuery, _setSearchQuery] = useState('')
  const [_isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users)
      return
    }
    const query = searchQuery.toLowerCase()
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.userId.toLowerCase().includes(query) ||
          user.organizationType.toLowerCase().includes(query)
      )
    )
  }, [searchQuery, users])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const data = await getAdminUsers()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      toast.error('사용자 목록 로드 실패')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader 
        title="사용자 관리" 
        description="전체 사용자 계정 및 권한 관리"
        backButton={{ label: "대시보드로", to: "/admin" }}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          
        </div>
      </div>
    </div>
  )
}


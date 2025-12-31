import apiClient from './client'
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminLoginLog,
  AdminFacePreviewRequest,
  AdminFacePreviewResponse,
  AdminDashboardStats,
  AdminUser,
  AdminAccessRecord,
  AdminAccessStats,
} from '../types/user'

export type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminLoginLog,
  AdminFacePreviewRequest,
  AdminFacePreviewResponse,
  AdminDashboardStats,
  AdminUser,
  AdminAccessRecord,
  AdminAccessStats
}

export const adminLogin = async (data: AdminLoginRequest): Promise<AdminLoginResponse> => {
  const response = await apiClient.post<AdminLoginResponse>('/admin/login', data)
  return response.data
}

export const getAdminMe = async () => {
  const response = await apiClient.get('/admin/me')
  return response.data
}

export const getAdminLoginLogs = async (limit = 100, offset = 0): Promise<AdminLoginLog[]> => {
  const response = await apiClient.get<AdminLoginLog[]>('/admin/login-logs', {
    params: { limit, offset },
  })
  return response.data
}

export const previewAdminFace = async (data: AdminFacePreviewRequest): Promise<AdminFacePreviewResponse> => {
  const response = await apiClient.post<AdminFacePreviewResponse>('/admin/face-preview', data)
  return response.data
}

export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const response = await apiClient.get<AdminDashboardStats>('/admin/dashboard-stats')
  return response.data
}

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await apiClient.get<AdminUser[]>('/admin/users')
  return response.data
}

export const deleteUser = async (userId: number): Promise<void> => {
  await apiClient.delete(`/admin/users/${userId}`)
}

export const resetUserPassword = async (userId: number): Promise<void> => {
  await apiClient.put(`/admin/users/${userId}/password`)
}

export const deleteUserFaceData = async (userId: number): Promise<void> => {
  await apiClient.delete(`/admin/users/${userId}/face`)
}

export const getAdminAccessHistory = async (
  limit = 100, 
  offset = 0,
  startDate?: string,
  endDate?: string,
  query?: string
): Promise<AdminAccessRecord[]> => {
  const params: any = { limit, offset }
  if (startDate) params.start_date = startDate
  if (endDate) params.end_date = endDate
  if (query) params.query = query
  
  const response = await apiClient.get<AdminAccessRecord[]>('/admin/attendance-history', { params })
  return response.data
}

export const getAdminAccessStats = async (): Promise<AdminAccessStats> => {
  const response = await apiClient.get<AdminAccessStats>('/admin/attendance-stats')
  return response.data
}

import apiClient from './client'

export interface AccessRequest {
  image: string
}

export interface AccessResponse {
  id: number
  userId: number
  userName: string
  organizationType: string
  checkInTime: string
  similarity?: number
  status: string
  createdAt: string
}

export interface AccessListResponse {
  total: number
  items: AccessResponse[]
}

export const checkIn = async (data: AccessRequest): Promise<AccessResponse> => {
  const response = await apiClient.post<AccessResponse>('/access/check-in', data)
  return response.data
}

export const getAccessHistory = async (limit = 50, offset = 0): Promise<AccessListResponse> => {
  const response = await apiClient.get<AccessListResponse>('/access/history', {
    params: { limit, offset },
  })
  return response.data
}

export interface AccessStatsItem {
  label: string
  count: number
  date: string
  firstAccessTime?: number
}

export interface AccessStatsResponse {  
  period: string
  items: AccessStatsItem[]
}

export const getAccessStats = async (period: 'minute' | 'hour' | 'day' | 'month' | 'year' = 'day'): Promise<AccessStatsResponse> => {
  const response = await apiClient.get<AccessStatsResponse>('/access/stats', {
    params: { period },
  })
  return response.data
}


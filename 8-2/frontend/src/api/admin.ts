import apiClient from './client'
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminFacePreviewRequest,
  AdminFacePreviewResponse,
} from '../types/user'

export type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminFacePreviewRequest,
  AdminFacePreviewResponse,
} 

export const adminLogin = async (data: AdminLoginRequest): Promise<AdminLoginResponse> => {
  const response = await apiClient.post<AdminLoginResponse>('/admin/login', data)
  return response.data
}

export const getAdminMe = async () => {
  const response = await apiClient.get('/admin/me')
  return response.data
}

export const previewAdminFace = async (data: AdminFacePreviewRequest): Promise<AdminFacePreviewResponse> => {
  const response = await apiClient.post<AdminFacePreviewResponse>('/admin/face-preview', data)
  return response.data
}
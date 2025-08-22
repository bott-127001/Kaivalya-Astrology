import useAuth from '../store/auth'
import { API_BASE_URL } from '../config/api'

const buildUrl = (url) => {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`
  return `${API_BASE_URL}/${url}`
}

const fetchWithAuth = async (url, options = {}) => {
  const { token } = useAuth.getState()

  const headers = {
    ...options.headers
  }

  if (token && !buildUrl(url).endsWith('/api/admin/login')) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(buildUrl(url), { ...options, headers })

  if (response.status === 401 || response.status === 403) {
    useAuth.getState().logout()
  }

  return response
}

export default fetchWithAuth
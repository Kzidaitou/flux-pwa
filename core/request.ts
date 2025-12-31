
import { AlertType } from '../types/common/primitives'
import { getStorage, getPlatformConfig } from '../platform'
import { findMockData } from '../mock/core/registry' 

interface RequestConfig extends RequestInit {
  skipGlobalError?: boolean
  requireAuth?: boolean
  params?: Record<string, string>
}

const inFlightRequests = new Map<string, Promise<any>>();
let globalShowToast: ((message: string, type: AlertType) => void) | null = null
let globalLogout: ((suppressFeedback?: boolean) => void) | null = null

const MOCK_EXCLUSIONS = (process.env.APP_MOCK_EXCLUSIONS || '').split(',').map(p => p.trim()).filter(Boolean);

export const setupInterceptors = (
  showToast: (message: string, type: AlertType) => void,
  logout: (suppressFeedback?: boolean) => void
) => {
  globalShowToast = showToast
  globalLogout = logout
}

const getToken = async (): Promise<string | null> => {
  const syncToken = localStorage.getItem('access_token')
  if (syncToken) return syncToken
  return await getStorage().getItem('access_token')
}

export const request = async <T>(endpoint: string, config: RequestConfig = {}): Promise<T> => {
  const { skipGlobalError = false, requireAuth = true, params, ...fetchOptions } = config
  const platformConfig = getPlatformConfig()
  const method = fetchOptions.method || 'GET'
  
  const isMockEnabled = process.env.APP_USE_MOCK === 'true';
  const isExcluded = MOCK_EXCLUSIONS.some(path => endpoint.includes(path));
  const shouldTryMock = isMockEnabled && !isExcluded;

  const requestFingerprint = `${method}:${endpoint}:${params ? JSON.stringify(params) : ''}`;
  if (method === 'GET' && inFlightRequests.has(requestFingerprint)) {
    return inFlightRequests.get(requestFingerprint);
  }

  const executeRequest = async (): Promise<T> => {
    if (shouldTryMock) {
      const purePath = endpoint.split('?')[0];
      const parsedBody = fetchOptions.body && typeof fetchOptions.body === 'string' 
        ? JSON.parse(fetchOptions.body) 
        : fetchOptions.body;

      const mockData = findMockData(purePath, parsedBody);
      
      if (mockData !== null) {
        console.log(
          `%c[MOCK HIT]%c ${method} %c${purePath}`,
          "color: #00e676; font-weight: bold;", 
          "background: #2979ff; color: #fff; padding: 1px 4px; border-radius: 3px; font-weight: bold;", 
          "color: #888; text-decoration: underline;" 
        );

        console.groupCollapsed(`  └─ Details: ${method} ${purePath}`);
        console.log("%c 🛰️ Headers:", "color: #2979ff; font-weight: bold;", { requireAuth, ...fetchOptions.headers });
        if (params) console.log("%c 🔍 URL Params:", "color: #2979ff; font-weight: bold;", params);
        if (parsedBody) console.log("%c 📦 Request Body:", "color: #ff9100; font-weight: bold;", parsedBody);
        console.log("%c ✅ Mock Response:", "color: #00e676; font-weight: bold;", mockData);
        console.groupEnd();

        await new Promise(r => setTimeout(r, 400));
        return mockData as T;
      }
      console.warn(`%c[MOCK MISS]%c ${method} ${purePath}`, "color: #ffa726; font-weight: bold", "color: #888");
    }

    let headers: Record<string, string> = { 
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string> || {})
    }

    if (requireAuth) {
      const token = await getToken()
      if (!token && process.env.APP_NEED_AUTH !== 'false') {
        if (globalLogout) globalLogout(true)
        throw new Error('Unauthorized')
      }
      if (token) headers['Authorization'] = `Bearer ${token}`
    }

    let fullUrl = endpoint.startsWith('http') 
      ? endpoint 
      : `${platformConfig.apiBaseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    if (params) {
      const search = new URLSearchParams(params).toString()
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + search
    }

    try {
      const response = await fetch(fullUrl, { ...fetchOptions, headers })
      if (response.status === 401 && requireAuth) {
        if (globalLogout) globalLogout()
        throw new Error('Session Expired')
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const resData: any = await response.json()
      
      if (resData.success === false) {
        const msg = resData.message || 'Server Error'
        if (!skipGlobalError && globalShowToast) globalShowToast(msg, 'error')
        throw new Error(msg)
      }
      return (resData.data !== undefined ? resData.data : resData) as T
    } catch (e: any) {
      if (!skipGlobalError && globalShowToast) globalShowToast(e.message || 'Network Error', 'error')
      throw e
    }
  }

  const promise = executeRequest().finally(() => {
    inFlightRequests.delete(requestFingerprint);
  });

  if (method === 'GET') inFlightRequests.set(requestFingerprint, promise);
  return promise;
}

export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'GET' }),
  post: <T>(endpoint: string, body: any, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'DELETE' }),
}

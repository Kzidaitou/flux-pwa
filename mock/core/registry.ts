/**
 * Mock 路由自动注册引擎 (Infrastructure)
 */
export const MOCK_PREFIX = '/mock'

export interface MockRoute {
  pattern: RegExp
  handler: (path: string, body?: any) => any
}

// 扫描上一级 routes 目录下的所有业务定义文件
const modules = (import.meta as any).glob('../routes/!(index).ts', { eager: true })

const autoStaticRoutes: Record<string, any> = {}
const autoDynamicRoutes: MockRoute[] = []

Object.values(modules).forEach((mod: any) => {
  if (mod.routes) {
    Object.assign(autoStaticRoutes, mod.routes)
  }
  if (mod.dynamicRoutes && Array.isArray(mod.dynamicRoutes)) {
    autoDynamicRoutes.push(...mod.dynamicRoutes)
  }
})

/**
 * 根据请求路径查找对应的模拟数据
 */
export const findMockData = (path: string, body?: any): any => {
  const cleanPath = path.startsWith(MOCK_PREFIX) ? path.substring(MOCK_PREFIX.length) : path

  // 1. 静态路由精确匹配
  const staticMatch = autoStaticRoutes[cleanPath]
  if (staticMatch !== undefined) {
    return typeof staticMatch === 'function' ? staticMatch(body) : staticMatch
  }

  // 2. 动态正则路由匹配
  for (const route of autoDynamicRoutes) {
    if (route.pattern.test(cleanPath)) {
      return route.handler(cleanPath, body)
    }
  }

  return null
}

/**
 * Mock Layer Entry (Unified Exports)
 */

// 1. 导出 Mock 引擎 (核心逻辑)
export * from './core/registry'

// 2. 导出常用的业务 Mock 数据 (供测试或初始化使用)
export { MOCK_LOGIN_RESPONSE } from './routes/auth'
export { MOCK_CHARGING_START } from './routes/charging'
export { MOCK_STATIONS } from './routes/stations'
export { MOCK_USER, MOCK_HISTORY } from './routes/user'

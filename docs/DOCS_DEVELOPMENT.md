# Flux 技术架构与数据流

## 1. 产品性质 (PWA)
Flux 是一款基于 **React 19** 的纯 Web 应用。
*   **离线能力**: 通过清单文件支持“添加到主屏幕”。
*   **类原生手势**: 在 `styles/global.css` 中对 `overscroll` 和 `touch-action` 进行了严格控制，避免浏览器默认下拉刷新干扰。

## 2. 状态管理策略
我们没有使用 Redux 或 MobX，而是采用了 **多个 React Context 协同模式**：
*   `UIContext`: 控制 Toast, Alert, Modal 的全局弹出。
*   `UserContext`: 维护登录 Token、个人资料及账户余额。
*   `StationContext`: 负责地理位置获取与电站数据的轮询/刷新。
*   `ChargingContext`: 驱动充电状态机，处理从“扫码”到“支付成功”的完整链路。

## 3. 充电状态机逻辑
充电过程是由 `MockChargingSocket` (模拟 WebSocket) 驱动的：
1.  **Handshake**: 扫码成功后，通过 `ChargingContext` 发起启动请求。
2.  **Streaming**: 启动成功进入 `/charging` 页，开启 Socket 连接。
3.  **Update**: Socket 每秒推送一次数据 (电池、功率、费用)。
4.  **Terminate**: 停止充电或电量 100% 时，断开连接并呼起 `PaymentModal` 结算。

## 4. 适配策略
*   **Safe Area**: 使用 `env(safe-area-inset-top)` 处理刘海屏和底部手势条。
*   **主题锁定 (Theme Locking)**: 
    为了防止页面加载时的“白色闪烁”，我们在 `index.html` 中内置了阻塞式脚本。该脚本会先于 React 运行，直接从 `localStorage` 读取 `darkMode` 设置并注入 CSS 类名，确保视觉体验的连续性。
*   **暗色模式**: 基于 Tailwind `class` 策略。用户在设置中切换后，`UserContext` 会自动操作 `document.documentElement` 并同步到持久化存储。
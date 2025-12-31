# Flux 项目结构解析

Flux 采用功能分层架构，旨在实现业务逻辑与展现层的彻底解耦。

## 核心目录树
```text
/
├── assets/           # 静态资源 (SVG 图标、Mapping 映射表)
├── components/       # UI 组件库 (按业务功能划分子目录)
│   ├── maps/         # 地图引擎抽象层 (支持多引擎切换)
│   ├── charging/     # 充电业务相关组件
│   └── ...           # 其他通用组件
├── context/          # 全局状态管理 (User, Station, Charging)
├── core/             # 系统内核 (Axios 拦截器、WS 模拟器)
├── docs/             # 开发者技术文档
├── mock/             # 后端模拟层 (自动路由注册)
├── pages/            # 视图页面
├── platform/         # 浏览器/原生能力适配器 (适配层)
├── scripts/          # 构建与工程化脚本
├── services/         # API 接口定义 (按领域划分)
├── styles/           # 全局 CSS 与 Tailwind 样式
├── types/            # 全局 TypeScript 定义
└── App.tsx           # 应用总入口
```

## 关键模块说明

### 1. `/platform` (适配层)
这是项目的技术精髓。它将浏览器不稳定的 API (如摄像头、生物识别) 封装为一致的接口。
*   `biometrics.ts`: 封装 WebAuthn。
*   `camera.ts`: 处理扫描逻辑的降级方案。

### 2. `/mock` (模拟后端)
为了实现纯 Web 的快速演示，项目内置了一个完整的 Mock 数据库和路由系统。
*   支持持久化：模拟用户修改头像、车辆信息后，刷新页面数据不丢失（存入 LocalStorage）。

### 3. `/components/maps` (多引擎地图)
采用**策略模式**实现。根据环境变量自动选择 Google/百度/腾讯或 Leaflet。所有引擎共享一套 `MarkerMarkup` 视觉逻辑。

### 4. `/core/request.ts` (智能请求)
拦截器会根据 `APP_USE_MOCK` 自动决定将请求导向模拟路由还是真实后端。
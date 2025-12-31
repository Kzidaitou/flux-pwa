# Flux 环境变量配置说明

项目采用模块化的环境变量加载机制，详见 `scripts/env-auto-loader.ts`。

## 1. 核心应用配置
| 变量名 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `APP_NAME` | `Flux` | 应用显示名称。 |
| `APP_USE_MOCK` | `true` | 是否启用内置 Mock 引擎。设为 `false` 则请求真实 API。 |
| `APP_NEED_AUTH` | `true` | 是否强制开启登录拦截。 |
| `APP_BASE_API` | `/` | 生产环境 API 基础路径。 |
| `APP_BASE_WS` | `-` | WebSocket 服务端点。 |

## 2. Mock 引擎专用
| 变量名 | 说明 |
| :--- | :--- |
| `APP_MOCK_EXCLUSIONS` | 以逗号分隔的路径列表。列表中的路径即使开启了 Mock 也会请求真实后端。 |

## 3. 地图引擎策略 (`APP_MAP_STRATEGY`)
支持值：`google`, `tencent`, `baidu`, `leaflet`, `auto` (默认)。

### Google Maps 配置
*   `APP_MAP_GOOGLE_KEY`: API 密钥。
*   `APP_MAP_GOOGLE_MAP_ID`: 地图样式 ID (用于 Advanced Markers)。

### 百度地图配置
*   `APP_MAP_BAIDU_KEY`: 访问应用 AK。
*   `APP_MAP_BAIDU_STYLE_ID`: 百度地图控制台生成的深色/定制样式 ID。

### 腾讯地图配置
*   `APP_MAP_TENCENT_KEY`: 腾讯位置服务 Key。

## 4. 构建与版本
*   `APP_PUBLIC_VERSION`: 由脚本自动从 `package.json` 同步。
*   `BUILD_PLATFORM`: 目前统一为 `web`。
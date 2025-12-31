# Flux 项目运行指南

本手册将引导您完成 Flux 项目的本地环境搭建与开发运行。

## 1. 环境准备
*   **Node.js**: 建议 v18.0.0 或更高版本。
*   **包管理器**: 推荐使用 `npm` (与项目脚本兼容性最佳)。

## 2. 安装与运行

### 步骤 A: 安装依赖
```bash
npm install
```

### 步骤 B: 启动开发环境 (Web/PWA)
该命令会自动生成必要的图标资产并启动 Vite 开发服务器。
```bash
npm run dev:web
```
运行成功后，访问控制台输出的地址（通常为 `http://localhost:3000`）。

### 步骤 C: 构建生产环境
生成的静态资源将存放于 `dist/web` 目录下。
```bash
npm run build:web
```

## 3. 核心开发指令
*   **图标同步**: `npm run generate:icons`
    *   该脚本会扫描项目代码，自动将使用的 Lucide 图标转换为静态 SVG 存放在 `assets/icons/svg/lucide`。
*   **版本同步**: `npm run sync:version`
    *   自动同步 `package.json` 中的版本号至构建环境变量。

## 4. 移动端调试建议
由于 Flux 针对移动端设计，建议在本地开发时：
1.  **开启控制台模拟**: 使用 Chrome DevTools (F12) 并切换到 **Dimensions: Responsive** (移动端视口)。
2.  **真机调试**: 确保手机与电脑在同一局域网，通过电脑 IP 地址访问。
3.  **HTTPS 提示**: 生物识别 (WebAuthn) 和 摄像头 (MediaDevices) 仅在 `localhost` 或 `HTTPS` 环境下可用。
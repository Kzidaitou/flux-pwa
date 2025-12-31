import React from 'react'
import * as ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import App from './App'

// 安全的跨端 Polyfill
if (typeof window !== 'undefined') {
  ;(window as any).global = window
}

/**
 * Service Worker Registration for PWA support
 */
const registerSW = () => {
  if ('serviceWorker' in navigator) {
    const isProd = process.env.NODE_ENV === 'production';
    const forcePWA = process.env.APP_PWA_FORCE === 'true';

    // 生产环境或强制开启模式下注册
    if (isProd || forcePWA) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.mjs', { type: 'module' }).then(
          (registration) => {
            console.log('[PWA] ServiceWorker registered scope: ', registration.scope);
            
            // 监听更新
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // 触发自定义事件，让 App.tsx 弹出更新提示
                    window.dispatchEvent(new CustomEvent('pwa-update-available'));
                  }
                };
              }
            };
          },
          (err) => console.error('[PWA] Registration failed:', err)
        );
      });

      // 当新的 SW 接管页面时，强制刷新以确保使用最新资产
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }
  }
};

registerSW();

/**
 * React 19 兼容性补丁
 */
const rootCache = new WeakMap()
const legacyRender = (element: React.ReactElement, container: HTMLElement) => {
  let root = rootCache.get(container)
  if (!root) {
    root = createRoot(container)
    rootCache.set(container, root)
  }
  root.render(element)
}

if (typeof window !== 'undefined') {
  const currentReactDOM = (window as any).ReactDOM || ReactDOM
  if (!currentReactDOM.render) {
    ;(window as any).ReactDOM = {
      ...currentReactDOM,
      render: legacyRender,
    }
  }
}

import './styles/global.css'
import './styles/platform.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element missing');

const root = createRoot(rootElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

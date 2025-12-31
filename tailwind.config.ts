import type { Config } from 'tailwindcss'

/**
 * Root Tailwind CSS Configuration
 * 针对 Web/H5/App 端进行优化
 */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./constant/**/*.{js,ts,jsx,tsx}", // 确保扫描常量定义
    "./platform/**/*.{js,ts,jsx,tsx}"
  ],
  // 核心修复：通过 Safelist 暴力破解 JIT 无法识别动态类的问题
  safelist: [
    // 基础类 (Light Mode)
    { pattern: /^(text|bg|border)-(green|amber|gray|orange|red|blue|purple|teal)-(100|200|400|500|600)$/ },
    // 暗色模式类 (Dark Mode)
    { 
      pattern: /^(text|bg|border)-(green|amber|gray|orange|red|blue|purple|teal)-(400|500|600|700|800|900)$/,
      variants: ['dark']
    },
    // 带透明度的特殊背景类 (Dark Mode Opacity)
    { 
      pattern: /^bg-(green|amber|gray|orange|red|blue|purple|teal)-900\/30$/,
      variants: ['dark']
    },
    { 
      pattern: /^bg-gray-800\/50$/,
      variants: ['dark']
    }
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00e676', 
        secondary: '#2979ff', 
        dark: '#121212', 
        surface: '#1e1e1e', 
        light: '#f3f4f6', 
        'light-surface': '#ffffff', 
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
} as Config
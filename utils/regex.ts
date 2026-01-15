/**
 * Icon 提取工具函数
 *
 * 自动扫描 TypeScript/TSX 代码，提取所有 Icon 组件和配置中使用的图标名称（字符串字面量）。
 * 支持以下格式：
 * - `<Icon name="credit-card" />`
 * - `icon: "map"`
 * - `iconName: "Battery"`
 * - `icons: ["home", "search", "user"]` （全匹配）
 * - `icon: <Icon />`
 *
 * 自动忽略：`local:xxx`、`icon-xxx` 等
 *
 * @example
 * ```ts
 * const code = `
 *   icon: "credit-card"
 *   icons: ["map", "home"]
 *   <Icon name="search" />
 * `
 * const icons = extractAllIcons(code)
 * // Set ["credit-card", "map", "home", "search"]
 * ```
 */

const MAIN_REGEX: RegExp =
  /(?:<Icon[^>]*name\s*=\s*['"`]([^'"`\s>]+)['"`]|(?:icon|iconName)\s*:\s*['"`]([^'"`\s,;\]}]+)['"`]|icon\s*:\s*<Icon[^>]*(?:name\s*=\s*['"`]([^'"`\s>]+)['"`])?[^>]*>)/gi

const ARRAY_KEY_REGEX: RegExp = /(?:icons?|iconNames?|iconList)\s*:\s*\[([^\]]*)\]/g

const ARRAY_STRING_REGEX: RegExp = /['"`]([^'"`\[\],\s]+)['"`]/g

const JSX_ICON_REGEX = /icon\s*:\s*<Icon[^>]*name\s*=\s*['"`]([^'"`\s>]+)['"`][^>]*\/?>?/gi

export const extractAllIcons = (content: string): Set<string> => {
  const icons = new Set<string>()

  // 1. 主匹配：Icon name + icon: "xxx" + iconName: "yyy"
  let match: RegExpExecArray | null
  MAIN_REGEX.lastIndex = 0
  while ((match = MAIN_REGEX.exec(content)) !== null) {
    const iconName = (match[1] || match[2] || match[3])?.trim()
    if (iconName && iconName.length > 1 && isValidIconName(iconName)) {
      icons.add(iconName)
    }
  }

  // 2. ES5 兼容数组匹配
  ARRAY_KEY_REGEX.lastIndex = 0
  while ((match = ARRAY_KEY_REGEX.exec(content)) !== null) {
    const arrayContent = match[1]?.trim()
    if (arrayContent) {
      // 提取数组内所有字符串字面量
      ARRAY_STRING_REGEX.lastIndex = 0
      let arrayMatch: RegExpExecArray | null
      while ((arrayMatch = ARRAY_STRING_REGEX.exec(arrayContent)) !== null) {
        const iconName = arrayMatch[1]?.trim()
        if (iconName && iconName.length > 1 && isValidIconName(iconName)) {
          icons.add(iconName)
        }
      }
    }
  }

  // 3. JSX Icon 组件内联匹配
  let jsxMatch: RegExpExecArray | null
  JSX_ICON_REGEX.lastIndex = 0
  while ((jsxMatch = JSX_ICON_REGEX.exec(content)) !== null) {
    const iconName = jsxMatch[1]?.trim()
    if (iconName && iconName.length > 1 && isValidIconName(iconName)) {
      icons.add(iconName)
    }
  }

  return icons
}

export const isValidIconName = (name: string): boolean => {
  return !name.match(/^(local:|icon-|svg-|\/|\.)/) && /^[a-zA-Z][a-zA-Z0-9-]+$/.test(name)
}

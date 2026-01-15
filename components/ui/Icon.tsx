/**
 * Icon Component (全端兼容)
 * 支持 H5 fetch
 */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'

export interface IconProps {
  name: string
  size?: number | string
  color?: string
  className?: string
  fill?: boolean | string
  strokeWidth?: number | string
  [key: string]: any
}

const toKebabCase = (str: string): string =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const resolveIconPath = (name: string): string => {
  const isLocal = name.startsWith('local:')
  const folder = isLocal ? 'local' : 'lucide'
  const rawName = isLocal ? name.replace('local:', '') : name
  const fileName = isLocal ? rawName.toLowerCase() : toKebabCase(rawName)
  return `/assets/icons/svg/${folder}/${fileName}.svg`
}

interface IconState {
  svgContent: string | null
  isLoading: boolean
  error: boolean
}

const Icon: React.FC<IconProps> = React.memo(
  ({ name, size = 24, color, className = '', fill = false, strokeWidth = 2, ...props }) => {
    const [state, setState] = useState<IconState>({
      svgContent: null,
      isLoading: true,
      error: false,
    })

    const loadSvgContent = useCallback(async (iconName: string) => {
      setState({ svgContent: null, isLoading: true, error: false })

      try {
        const path = resolveIconPath(iconName)
        const res = await fetch(path, { cache: 'force-cache' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const svgText = await res.text()
        setState({ svgContent: svgText, isLoading: false, error: false })
      } catch (error) {
        console.warn(`Icon "${iconName}" load failed:`, error)
        setState({ svgContent: null, isLoading: false, error: true })
      }
    }, [])

    useEffect(() => {
      loadSvgContent(name)
    }, [name, loadSvgContent])

    // SVG 字符串处理（带防抖）
    const processedSvg = useMemo(() => {
      if (!state.svgContent) return ''

      const numericSize = typeof size === 'string' ? parseInt(size) || 24 : size
      const numericStroke =
        typeof strokeWidth === 'string' ? parseFloat(strokeWidth) || 2 : strokeWidth
      const iconClass = `icon-${toKebabCase(name)}`

      // 只替换一次根 <svg>，使用单个正则
      return state.svgContent.replace(/^<svg\s+([^>]*)>/i, (match, attrs) => {
        // 修改属性
        let newAttrs = attrs
          .trim()
          .replace(/\s+width\s*=\s*"[^"]*"/i, `width="${numericSize}"`)
          .replace(/\s+height\s*=\s*"[^"]*"/i, `height="${numericSize}"`)
          .replace(/\s+stroke-width\s*=\s*"[^"]*"/i, `stroke-width="${numericStroke}"`)

        if (color) {
          newAttrs = newAttrs.replace(/\s+stroke\s*=\s*"[^"]*"/i, `stroke="${color}"`)
        }

        newAttrs = newAttrs.replace(/\s+fill\s*=\s*"[^"]*"/i, (m: string) => {
          if (fill === true) return color ? `fill="${color}"` : 'fill="currentColor"'
          if (typeof fill === 'string') return `fill="${fill}"`
          if (color) return `fill="${color}"`
          return m
        })

        return `<svg class="${iconClass}" ${newAttrs}><style>*{stroke-width:${numericStroke}px}</style>`
      })
    }, [state.svgContent, size, color, fill, strokeWidth, name, className])

    // 添加预加载监听
    useEffect(() => {
      const preloadListener = (e: CustomEvent) => {
        if (e.detail === name) {
          loadSvgContent(name)
        }
      }
      document.addEventListener('icon-preload', preloadListener as any)
      return () => document.removeEventListener('icon-preload', preloadListener as any)
    }, [name])

    // 增加静态缓存
    const svgCache = useRef<Record<string, string>>({})
    if (svgCache.current[name]) {
      setState({ svgContent: svgCache.current[name], isLoading: false, error: false })
      return // 直接用缓存
    }

    // 占位符（加载中/错误）
    if (state.isLoading || state.error || !state.svgContent) {
      return (
        <div
          className={`inline-box items-center justify-center shrink-0 ${className}`}
          style={{
            width: size,
            height: size,
            minWidth: size,
            minHeight: size,
          }}
          {...props}
        >
          <span className={`${className}`} />
        </div>
      )
    }

    const iconStyle: React.CSSProperties = {
      width: size,
      height: size,
      '--icon-stroke-width': strokeWidth,
    } as React.CSSProperties

    return (
      <div
        dangerouslySetInnerHTML={{ __html: processedSvg }}
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
        style={iconStyle}
      />
    )
  },
)

Icon.displayName = 'Icon'

export default Icon

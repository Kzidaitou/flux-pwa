/**
 * UI Primitive: Universal Icon Component (FileSystem Based)
 * Fetches SVG assets from assets/icons/svg/local or assets/icons/svg/lucide.
 */
import React, { useState, useEffect } from 'react'

export interface IconProps {
  name: string 
  size?: number
  color?: string
  className?: string
  fill?: boolean
  strokeWidth?: number
  [key: string]: any
}

/**
 * Internal helper to convert PascalCase/camelCase to kebab-case
 * Matches the logic in scripts/generate-icons.ts
 */
const toKebabCase = (str: string): string =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/**
 * Resolver for icon paths based on prefix
 * local:name -> /assets/icons/svg/local/name.svg
 * Name -> /assets/icons/svg/lucide/name.svg (kebab-case)
 */
const resolveIconPath = (name: string): string => {
  const isLocal = name.startsWith('local:')
  const folder = isLocal ? 'local' : 'lucide'
  const rawName = isLocal ? name.replace('local:', '') : name
  const fileName = isLocal ? rawName.toLowerCase() : toKebabCase(rawName)
  return `/assets/icons/svg/${folder}/${fileName}.svg`
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color, 
  className = '', 
  fill = false, 
  strokeWidth = 2, 
  ...props 
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    
    const path = resolveIconPath(name)
    
    fetch(path)
      .then(res => {
        if (!res.ok) throw new Error('Not Found')
        return res.text()
      })
      .then(text => {
        if (isMounted) {
          setSvgContent(text)
          setIsLoading(false)
        }
      })
      .catch(() => {
        // Strict requirement: Silent fail, show blank if missing
        if (isMounted) {
          setSvgContent(null) 
          setIsLoading(false)
        }
      })

    return () => { isMounted = false }
  }, [name])

  // Show blank div during loading or if error occurs
  if (isLoading || !svgContent) {
    return <div style={{ width: size, height: size }} className={`inline-block shrink-0 ${className}`} {...props} />
  }

  /**
   * Process SVG string to inject props
   * Replaces attributes dynamically to support theme colors and sizing
   */
  const processedSvg = svgContent
    .replace(/width="[^"]*"/, `width="${size}"`)
    .replace(/height="[^"]*"/, `height="${size}"`)
    .replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`)
    .replace(/stroke="[^"]*"/g, color ? `stroke="${color}"` : 'stroke="currentColor"')
    .replace(/fill="none"/g, fill ? (color ? `fill="${color}"` : 'fill="currentColor"') : 'fill="none"')

  return (
    <div 
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ 
        width: size, 
        height: size, 
        color: color || 'currentColor',
      }}
      dangerouslySetInnerHTML={{ __html: processedSvg }}
      {...props}
    />
  )
}

export default Icon
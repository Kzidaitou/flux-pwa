import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import fg from 'fast-glob'
import * as React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as LucideIcons from 'lucide-react'

import { VEHICLE_BRAND_ICONS, DEFAULT_VEHICLE_ICON } from '../constant/vehicle.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')

const ASSETS_DIR = path.resolve(PROJECT_ROOT, 'assets', 'icons')
const SVG_ROOT = path.join(ASSETS_DIR, 'svg')
const LOCAL_DIR = path.join(SVG_ROOT, 'local')
const LUCIDE_DIR = path.join(SVG_ROOT, 'lucide')
const MAPPING_FILE = path.join(ASSETS_DIR, 'icon-mapping.json')

const toKebabCase = (str: string): string =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

async function run() {
  console.log(`🧹 Starting Icon Generation (Target: lucide folder)...`)

  // Ensure directories exist.
  if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true })
  if (!fs.existsSync(LUCIDE_DIR)) fs.mkdirSync(LUCIDE_DIR, { recursive: true })

  const usedLucideNames = new Set<string>()
  const iconMapping: any = { 
    version: '1.6.0', 
    lastUpdated: new Date().toISOString(), 
    icons: {} 
  }

  // 1. Define base required icons for the UI
  const baseIcons = [
    'MapPin', 'Map', 'List', 'User', 'Zap', 'Check', 'X', 'Clock', 'AlertCircle', 
    'Loader2', 'QrCode', 'Keyboard', 'ArrowRight', 'ChevronRight', 'ArrowLeft',
    'ShieldCheck', 'RotateCcw', 'MessageSquare', 'Copy', 'Phone', 'Camera', 'Target',
    'Settings', 'CreditCard', 'Plus', 'LogOut', 'Edit2', 'Upload', 'XCircle', 
    'KeyRound', 'Key', 'Eye', 'EyeOff', 'CheckCircle2', 'Circle', 'Link', 'Shield',
    'Info', 'Smartphone', 'Bell', 'Moon', 'Sun', 'WifiOff', 'Hammer', 'Ban', 'Battery',
    'BatteryCharging', 'Plug', 'Navigation', 'Search', 'RefreshCw'
  ]
  baseIcons.forEach(icon => { 
    if (LucideIcons[icon as keyof typeof LucideIcons]) usedLucideNames.add(icon) 
  })

  // 2. Add icons from vehicle constants with strict validation
  // Only add DEFAULT_VEHICLE_ICON if it's not a local: prefix and is a valid Lucide name
  if (DEFAULT_VEHICLE_ICON && 
      !DEFAULT_VEHICLE_ICON.startsWith('local:') && 
      LucideIcons[DEFAULT_VEHICLE_ICON as keyof typeof LucideIcons]) {
    usedLucideNames.add(DEFAULT_VEHICLE_ICON)
  }

  Object.values(VEHICLE_BRAND_ICONS).forEach(iconName => {
    // Check if it's a candidate for lucide generation
    if (!iconName.startsWith('local:') && LucideIcons[iconName as keyof typeof LucideIcons]) {
      usedLucideNames.add(iconName)
    }
  })

  // 3. Scan codebase for other dynamically used Lucide icons
  const globSync = fg.sync || (fg as any).default?.sync || (fg as any).globSync
  const files = globSync(
    ['pages/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'constant/**/*.{ts,tsx}', 'App.tsx'],
    { cwd: PROJECT_ROOT, ignore: ['**/node_modules/**', '**/*.d.ts', '**/dist/**'] }
  )

  for (const file of files) {
    const content = fs.readFileSync(path.join(PROJECT_ROOT, file), 'utf-8')
    const stringMatches = content.matchAll(/(?:icon|name|label)\s*[:=]\s*['"]([A-Z][a-zA-Z0-9]+)['"]/g)
    for (const match of stringMatches) {
      if (LucideIcons[match[1] as keyof typeof LucideIcons]) usedLucideNames.add(match[1])
    }
  }

  // 4. Generate SVG files in the lucide directory
  const expectedLucideFiles = new Set<string>()
  for (const iconName of usedLucideNames) {
    const kebabName = toKebabCase(iconName)
    const fileName = `${kebabName}.svg`
    expectedLucideFiles.add(fileName)

    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.FC<any>
    try {
      const element = React.createElement(IconComponent, { size: 24, strokeWidth: 2, color: "currentColor" })
      const svgString = ReactDOMServer.renderToStaticMarkup(element)
      fs.writeFileSync(path.join(LUCIDE_DIR, fileName), svgString)
      iconMapping.icons[kebabName] = { name: iconName, file: fileName, origin: 'lucide' }
    } catch (e) { 
      console.error(`   ❌ Failed to render: ${iconName}`) 
    }
  }

  // 5. Pruning: Only clean the lucide folder
  let prunedCount = 0
  if (fs.existsSync(LUCIDE_DIR)) {
    fs.readdirSync(LUCIDE_DIR).forEach(file => {
      if (file.endsWith('.svg') && !expectedLucideFiles.has(file)) {
        try { 
          fs.unlinkSync(path.join(LUCIDE_DIR, file))
          prunedCount++
        } catch (e) {}
      }
    })
  }

  fs.writeFileSync(MAPPING_FILE, JSON.stringify(iconMapping, null, 2))
  console.log(`✨ Done! Lucide: ${expectedLucideFiles.size} generated, ${prunedCount} pruned.`)
  console.log(`📂 Folder 'assets/icons/svg/local' remains untouched for manual assets.`)
}

run().catch(err => {
  console.error('CRITICAL: Icon generation failed!')
  console.error(err)
  ;(process as any).exit(1)
})
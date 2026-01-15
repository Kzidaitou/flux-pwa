import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import fg from 'fast-glob'
import React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as LucideIcons from 'lucide-react'

// 修正：在脚本中使用相对路径，避免别名解析失败
import { VEHICLE_BRAND_ICONS, DEFAULT_VEHICLE_ICON } from '../constant/vehicle'
import { extractAllIcons } from '../utils/regex'

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
  console.log(`🧹 [Flux] Syncing icons...`)

  // Ensure directories exist.
  if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true })
  if (!fs.existsSync(LUCIDE_DIR)) fs.mkdirSync(LUCIDE_DIR, { recursive: true })

  const usedLucideNames = new Set<string>()
  const iconMapping: any = {
    version: '1.6.0',
    lastUpdated: new Date().toISOString(),
    icons: {},
  }

  // 1. Define base required icons for the UI
  const baseIcons = [
    'MapPin',
    'Map',
    'List',
    'User',
    'Zap',
    'Check',
    'X',
    'Clock',
    'AlertCircle',
    'Loader2',
    'QrCode',
    'Keyboard',
    'ArrowRight',
    'ChevronRight',
    'ArrowLeft',
    'ShieldCheck',
    'RotateCcw',
    'MessageSquare',
    'Copy',
    'Phone',
    'Camera',
    'Target',
    'Settings',
    'CreditCard',
    'Plus',
    'LogOut',
    'Edit2',
    'Upload',
    'XCircle',
    'KeyRound',
    'Key',
    'Eye',
    'EyeOff',
    'CheckCircle2',
    'Circle',
    'Link',
    'Shield',
    'Info',
    'Smartphone',
    'Bell',
    'Moon',
    'Sun',
    'WifiOff',
    'Hammer',
    'Ban',
    'Battery',
    'BatteryCharging',
    'Plug',
    'Navigation',
    'Search',
    'RefreshCw',
    'Mail',
    'Trash2',
    'Hash',
    'DollarSign',
    'ListFilter',
    'ZapOff',
    'ShieldAlert',
    'Scale',
    'FileText',
    'Download',
    'MapPinOff',
  ]
  baseIcons.forEach((icon) => {
    if ((LucideIcons as any)[icon]) usedLucideNames.add(icon)
  })

  // 2. Add icons from vehicle constants
  if (
    DEFAULT_VEHICLE_ICON &&
    typeof DEFAULT_VEHICLE_ICON === 'string' &&
    !DEFAULT_VEHICLE_ICON.startsWith('local:') &&
    (LucideIcons as any)[DEFAULT_VEHICLE_ICON]
  ) {
    usedLucideNames.add(DEFAULT_VEHICLE_ICON)
  }

  Object.values(VEHICLE_BRAND_ICONS).forEach((iconName) => {
    if (
      typeof iconName === 'string' &&
      !iconName.startsWith('local:') &&
      (LucideIcons as any)[iconName]
    ) {
      usedLucideNames.add(iconName)
    }
  })

  // 3. Scan codebase for other dynamically used Lucide icons
  const files = fg.sync(
    [
      'src/pages/**/*.{ts,tsx}',
      'src/components/**/*.{ts,tsx}',
      'src/constants/**/*.{ts,tsx}',
      'src/app.tsx',
    ],
    { cwd: PROJECT_ROOT, ignore: ['**/node_modules/**', '**/*.d.ts', '**/dist/**'] },
  )

  for (const file of files) {
    const content = fs.readFileSync(path.join(PROJECT_ROOT, file as string), 'utf-8')
    const fileIcons = extractAllIcons(content)
    fileIcons.forEach((iconName) => {
      if ((LucideIcons as any)[iconName]) {
        usedLucideNames.add(iconName)
      }
    })
  }

  // 4. Generate SVG files
  const expectedLucideFiles = new Set<string>()
  for (const iconName of usedLucideNames) {
    const kebabName = toKebabCase(iconName)
    const fileName = `${kebabName}.svg`
    expectedLucideFiles.add(fileName)

    const IconComponent = (LucideIcons as any)[iconName]
    try {
      const element = React.createElement(IconComponent, {
        size: 24,
        strokeWidth: 2,
        color: 'currentColor',
      })
      const svgString = ReactDOMServer.renderToStaticMarkup(element)
      fs.writeFileSync(path.join(LUCIDE_DIR, fileName), svgString)
      iconMapping.icons[kebabName] = { name: iconName, file: fileName, origin: 'lucide' }
    } catch (e) {
      console.error(`   ❌ Failed to render: ${iconName}`)
    }
  }

  // 5. Pruning
  let prunedCount = 0
  if (fs.existsSync(LUCIDE_DIR)) {
    fs.readdirSync(LUCIDE_DIR).forEach((file) => {
      if (file.endsWith('.svg') && !expectedLucideFiles.has(file)) {
        try {
          fs.unlinkSync(path.join(LUCIDE_DIR, file))
          prunedCount++
        } catch (e) {}
      }
    })
  }

  fs.writeFileSync(MAPPING_FILE, JSON.stringify(iconMapping, null, 2))
  console.log(`✨ [Flux] Icons synced: ${usedLucideNames.size} generated, ${prunedCount} cleaned.`)
}

run().catch((err) => {
  console.error('CRITICAL: Icon generation failed!')
  console.error(err)
  process.exit(1)
})

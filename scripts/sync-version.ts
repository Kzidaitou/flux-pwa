import { readFileSync, existsSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROJECT_ROOT = resolve(__dirname, '..')
const ROOT_PKG_PATH = join(PROJECT_ROOT, 'package.json')

function getVersionCode(version: string): number {
  try {
    const [major, minor, patch] = version.split('.').map((v) => parseInt(v, 10))
    // Generates a code like 10203 for version 1.2.3
    // Ensures build code increases as long as version increases
    return major * 10000 + minor * 100 + patch
  } catch (e) {
    return 1
  }
}

function syncVersion() {
  console.log('🔄 Starting version sync...')

  // 1. Read Root Version (Critical - must exist)
  if (!existsSync(ROOT_PKG_PATH)) {
    console.error('❌ Critical: Root package.json not found.')
    ;(process as any).exit(1)
  }

  let version = '0.0.0'
  let versionCode = 1

  try {
    const rootPkgContent = readFileSync(ROOT_PKG_PATH, 'utf-8')
    const rootPkg = JSON.parse(rootPkgContent)
    version = rootPkg.version
    versionCode = getVersionCode(version)
    console.log(`📌 Current Version: ${version} (Code: ${versionCode})`)
  } catch (error) {
    console.error('❌ Failed to read root package.json:', error)
    ;(process as any).exit(1)
  }

  console.log('✨ Version sync complete.')
}

syncVersion()
import { StorageAdapter } from '../types'

// Web Storage Adapter (localStorage)
class WebStorageAdapter implements StorageAdapter {
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value)
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key)
  }

  removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  clear(): void {
    localStorage.clear()
  }
}

// Factory function to get the appropriate storage adapter
export function getStorageAdapter(): StorageAdapter {
  return new WebStorageAdapter()
}

// Singleton instance
let storageInstance: StorageAdapter | null = null

export function getStorage(): StorageAdapter {
  if (!storageInstance) {
    storageInstance = getStorageAdapter()
  }
  return storageInstance
}
import { NavigationAdapter } from '../types'

// Web Navigation Adapter (React Router)
class WebNavigationAdapter implements NavigationAdapter {
  private navigateFunc: ((path: string) => void) | null = null

  setNavigate(navigate: (path: string) => void) {
    this.navigateFunc = navigate
  }

  navigate(path: string): void {
    if (this.navigateFunc) {
      this.navigateFunc(path)
    } else {
      window.location.href = path
    }
  }

  goBack(): void {
    window.history.back()
  }

  replace(path: string): void {
    window.history.replaceState({}, '', path)
  }

  getCurrentPath(): string {
    return window.location.pathname
  }
}

// Factory function to get the appropriate navigation adapter
export function getNavigationAdapter(): NavigationAdapter {
  return new WebNavigationAdapter()
}

// Singleton instance
let navigationInstance: NavigationAdapter | null = null

export function getNavigation(): NavigationAdapter {
  if (!navigationInstance) {
    navigationInstance = getNavigationAdapter()
  }
  return navigationInstance
}
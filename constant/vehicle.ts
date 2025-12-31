
/**
 * Vehicle Brand & Icon Configuration
 * Centralized mapping for brand visual assets.
 */

export const VEHICLE_BRAND_ICONS: Record<string, string> = {
  'Tesla': 'local:tesla',
  'BYD': 'local:byd',
  'NIO': 'local:nio',
  'XPeng': 'local:xpeng',
  'Li Auto': 'local:li-auto',
  'BMW': 'local:bmw',
  'Zeekr': 'local:zeekr',
  'Audi': 'local:audi',
  'Xiaomi': 'local:xiaomi',
  'Mercedes-Benz': 'local:mercedes-benz',
  'Volkswagen': 'local:volkswagen',
  'Rivian': 'local:rivian',
  'Ford': 'local:ford',
  'Hyundai': 'local:hyundai'
}

export const DEFAULT_VEHICLE_ICON = 'CarFront'

/**
 * Get icon name for a given brand name
 */
export const getVehicleBrandIcon = (brandName: string): string => {
  return VEHICLE_BRAND_ICONS[brandName] || DEFAULT_VEHICLE_ICON
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function getDeviceType(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase()

  if (/mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'mobile'
  }
  if (/tablet|ipad|android(?!.*mobile)|kindle|silk/i.test(ua)) {
    return 'tablet'
  }
  return 'desktop'
}

export function isMobile(userAgent: string): boolean {
  return getDeviceType(userAgent) === 'mobile'
}

'use client'

import { useState, useEffect } from 'react'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

function getDeviceTypeFromUA(): DeviceType {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent.toLowerCase()
  if (/mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(ua)) return 'mobile'
  if (/tablet|ipad|android(?!.*mobile)|kindle|silk/i.test(ua)) return 'tablet'
  return 'desktop'
}

function getDeviceTypeFromWidth(): DeviceType {
  if (typeof window === 'undefined') return 'desktop'
  if (window.innerWidth < 768) return 'mobile'
  if (window.innerWidth < 1024) return 'tablet'
  return 'desktop'
}

export function useDevice() {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const fromUA = getDeviceTypeFromUA()
    const fromWidth = getDeviceTypeFromWidth()
    setDeviceType(fromWidth === 'desktop' && fromUA === 'mobile' ? fromUA : fromWidth)

    const handleResize = () => {
      setDeviceType(getDeviceTypeFromWidth())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isClient,
  }
}

import { headers } from "next/headers"
import type { DeviceType } from "./detect-device"

export async function getRequestDeviceType(): Promise<DeviceType> {
  const hdrs = await headers()
  const deviceType = hdrs.get("x-device-type") as DeviceType | null
  return deviceType ?? "desktop"
}

export function isMobileDevice(deviceType: DeviceType): boolean {
  return deviceType === "mobile"
}

import { describe, expect, it } from "vitest"
import { getDeviceType } from "@/lib/detect-device"

describe("getDeviceType", () => {
  it("detects mobile user agents", () => {
    const agents = [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36",
      "Mozilla/5.0 (BlackBerry; U; BlackBerry 9900)",
      "Opera/9.80 (J2ME/MIDP; Opera Mini/9.80)",
      "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; IEMobile/10.0)",
    ]
    for (const ua of agents) {
      expect(getDeviceType(ua)).toBe("mobile")
    }
  })

  it("detects tablet user agents", () => {
    const agents = [
      "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      "Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 Safari/537.36",
      "Mozilla/5.0 (Linux; U; Android 4.4.3; KFTHWI Build/KTU84M) Silk/47.1.79 like Chrome",
      "Mozilla/5.0 (Linux; U; Android 4.0; Kindle Fire)",
    ]
    for (const ua of agents) {
      expect(getDeviceType(ua)).toBe("tablet")
    }
  })

  it("falls back to desktop for unknown or empty user agents", () => {
    expect(getDeviceType("")).toBe("desktop")
    expect(
      getDeviceType(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
      )
    ).toBe("desktop")
  })

  it("is case insensitive", () => {
    expect(getDeviceType("IPHONE")).toBe("mobile")
    expect(getDeviceType("IPAD")).toBe("tablet")
  })

  it("prefers mobile over tablet for Android phones", () => {
    expect(
      getDeviceType("Mozilla/5.0 (Linux; Android 14; Pixel) Mobile Safari/537.36")
    ).toBe("mobile")
  })
})

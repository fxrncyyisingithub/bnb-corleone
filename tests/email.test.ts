import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const sendMock = vi.hoisted(() => vi.fn())

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock }
  },
}))

async function importEmail() {
  vi.resetModules()
  return import("@/lib/email")
}

const guestProps = {
  name: "Mario Rossi",
  email: "mario@example.com",
  roomName: "101",
  checkIn: "01/09/2026",
  checkOut: "03/09/2026",
  total: "160",
  sessionId: "cs_test_123",
}

const staffProps = {
  guestName: "Mario Rossi",
  guestEmail: "mario@example.com",
  roomName: "101",
  checkIn: "01/09/2026",
  checkOut: "03/09/2026",
  total: "160",
}

function resetSendMock() {
  sendMock.mockClear()
  sendMock.mockImplementation(async () => ({ data: { id: "1" }, error: null }))
}

describe("sendGuestConfirmation", () => {
  beforeEach(resetSendMock)
  afterEach(() => vi.unstubAllEnvs())

  it("does nothing without RESEND_API_KEY", async () => {
    vi.stubEnv("RESEND_API_KEY", "")
    const { sendGuestConfirmation } = await importEmail()

    await sendGuestConfirmation(guestProps)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it("sends the confirmation with booking details in the body", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test")
    const { sendGuestConfirmation } = await importEmail()

    await sendGuestConfirmation(guestProps)

    expect(sendMock).toHaveBeenCalledTimes(1)
    const payload = sendMock.mock.calls[0][0]
    expect(payload.to).toBe("mario@example.com")
    expect(payload.subject).toContain("Prenotazione confermata")
    expect(payload.html).toContain("Mario Rossi")
    expect(payload.html).toContain("cs_test_123")
    expect(payload.html).toContain("€160")
    expect(payload.html).toContain("01/09/2026")
  })

  it("swallows send failures", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test")
    sendMock.mockImplementation(async () => {
      throw new Error("resend down")
    })
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    const { sendGuestConfirmation } = await importEmail()

    await expect(sendGuestConfirmation(guestProps)).resolves.toBeUndefined()
    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })
})

describe("sendStaffNotification", () => {
  beforeEach(resetSendMock)
  afterEach(() => vi.unstubAllEnvs())

  it("does nothing without STAFF_EMAIL", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test")
    vi.stubEnv("STAFF_EMAIL", "")
    const { sendStaffNotification } = await importEmail()

    await sendStaffNotification(staffProps)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it("does nothing when STAFF_EMAIL holds only separators", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test")
    vi.stubEnv("STAFF_EMAIL", " , , ")
    const { sendStaffNotification } = await importEmail()

    await sendStaffNotification(staffProps)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it("splits comma separated recipients and trims them", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test")
    vi.stubEnv("STAFF_EMAIL", " staff@example.com , owner@example.com ")
    const { sendStaffNotification } = await importEmail()

    await sendStaffNotification(staffProps)

    const payload = sendMock.mock.calls[0][0]
    expect(payload.to).toEqual(["staff@example.com", "owner@example.com"])
    expect(payload.subject).toBe("Nuova prenotazione: Mario Rossi - 101")
    expect(payload.html).toContain("mario@example.com")
  })

  it("swallows send failures", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test")
    vi.stubEnv("STAFF_EMAIL", "staff@example.com")
    sendMock.mockImplementation(async () => {
      throw new Error("resend down")
    })
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    const { sendStaffNotification } = await importEmail()

    await expect(sendStaffNotification(staffProps)).resolves.toBeUndefined()
    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })
})

import { Resend } from "resend"
import { emailTemplate } from "@/lib/email-template"
import { getBaseUrl } from "@/lib/base-url"

type GuestEmailProps = {
  name: string
  email: string
  roomName: string
  checkIn: string
  checkOut: string
  total: string
  sessionId: string
}

type StaffEmailProps = {
  guestName: string
  guestEmail: string
  roomName: string
  checkIn: string
  checkOut: string
  total: string
}

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn("RESEND_API_KEY is not set: skipping email delivery")
    return null
  }
  return new Resend(key)
}
const baseUrl = getBaseUrl()
const FROM = "Corleone Guesthouse <noreply@corleoneguesthouse.com>"

function guestTemplate({ name, roomName, checkIn, checkOut, total, sessionId }: GuestEmailProps) {
  return emailTemplate({
    heading: "Grazie per la tua prenotazione",
    intro: `<p style="font-size: 16px; line-height: 1.6; color: #5d5e66; margin: 0 0 24px;">
                      Ciao <strong style="color: #000000;">${name}</strong>, la tua prenotazione è stata confermata.
                    </p>`,
    rows: [
      { label: "Camera", value: roomName, strong: true },
      { label: "Check-in", value: checkIn },
      { label: "Check-out", value: checkOut },
      { label: "Totale", value: `€${total}`, strong: true },
    ],
    body: `<p style="font-size: 14px; line-height: 1.6; color: #5d5e66; margin: 0;">
                      Codice prenotazione: <strong style="color: #000000;">${sessionId}</strong>
                    </p>
                    <p style="font-size: 14px; line-height: 1.6; color: #5d5e66; margin: 16px 0 0;">
                      <a href="${baseUrl}/contatti" style="display: inline-block; background: #000000; color: #ffffff; padding: 12px 24px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none;">
                        Contattaci
                      </a>
                    </p>`,
    footer: `&copy; ${new Date().getFullYear()} CORLEONE GUESTHOUSE. ALL RIGHTS RESERVED.`,
  })
}

function staffTemplate({ guestName, guestEmail, roomName, checkIn, checkOut, total }: StaffEmailProps) {
  return emailTemplate({
    heading: "Nuova prenotazione",
    rows: [
      { label: "Ospite", value: guestName, strong: true },
      { label: "Email", value: guestEmail },
      { label: "Camera", value: roomName, strong: true, divider: true },
      { label: "Check-in", value: checkIn },
      { label: "Check-out", value: checkOut },
      { label: "Totale", value: `€${total}`, strong: true },
    ],
    body: `<p style="font-size: 14px; line-height: 1.6; color: #5d5e66; margin: 0;">
                      <a href="mailto:${guestEmail}" style="color: #000000;">Rispondi all'ospite</a>
                    </p>`,
    footer: "CORLEONE GUESTHOUSE",
  })
}

/** Sends a transactional email, throwing when Resend rejects it. */
async function send(
  { to, subject, html }: { to: string | string[]; subject: string; html: string },
  label: string
) {
  const resend = getResend()
  if (!resend) return

  const { error } = await resend.emails.send({ from: FROM, to, subject, html })

  if (error) {
    throw new Error(`Resend rejected the ${label}: ${error.name} - ${error.message}`)
  }
}

export async function sendGuestConfirmation(props: GuestEmailProps) {
  await send(
    {
      to: props.email,
      subject: "Prenotazione confermata - Corleone Guesthouse",
      html: guestTemplate(props),
    },
    "guest confirmation"
  )
}

export async function sendStaffNotification(props: StaffEmailProps) {
  const raw = process.env.STAFF_EMAIL

  if (!raw) {
    console.warn("STAFF_EMAIL is not set: skipping staff notification")
    return
  }

  const to = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  if (to.length === 0) {
    console.warn("STAFF_EMAIL contains no valid recipients: skipping staff notification")
    return
  }

  await send(
    {
      to,
      subject: `Nuova prenotazione: ${props.guestName} - ${props.roomName}`,
      html: staffTemplate(props),
    },
    "staff notification"
  )
}

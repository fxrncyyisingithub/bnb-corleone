import { Resend } from "resend"

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
  if (!key) return null
  return new Resend(key)
}
const FROM = "Corleone Guesthouse <onboarding@resend.dev>"

function guestTemplate({ name, roomName, checkIn, checkOut, total, sessionId }: GuestEmailProps) {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Inter, -apple-system, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 40px 24px;">
              <table width="480" cellpadding="0" cellspacing="0" style="background: #ffffff; border: 1px solid #cfc4c5;">
                <tr>
                  <td style="padding: 40px 32px 0;">
                    <h1 style="font-size: 30px; font-weight: 600; color: #000000; margin: 0 0 8px; letter-spacing: -0.01em;">
                      CORLEONE GUESTHOUSE
                    </h1>
                    <div style="width: 48px; height: 1px; background: #000000; margin: 16px 0;"></div>
                    <h2 style="font-size: 24px; font-weight: 600; color: #000000; margin: 0 0 16px;">
                      Grazie per la tua prenotazione
                    </h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #5d5e66; margin: 0 0 24px;">
                      Ciao <strong style="color: #000000;">${name}</strong>, la tua prenotazione è stata confermata.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #f3f3f3;">
                      <tr>
                        <td style="padding: 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 4px 0;"><span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #5d5e66; font-weight: 600;">Camera</span></td>
                              <td style="padding: 4px 0; text-align: right;"><span style="font-size: 16px; color: #000000; font-weight: 600;">${roomName}</span></td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0;"><span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #5d5e66; font-weight: 600;">Check-in</span></td>
                              <td style="padding: 4px 0; text-align: right;"><span style="font-size: 16px; color: #000000;">${checkIn}</span></td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0;"><span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #5d5e66; font-weight: 600;">Check-out</span></td>
                              <td style="padding: 4px 0; text-align: right;"><span style="font-size: 16px; color: #000000;">${checkOut}</span></td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0;"><span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #5d5e66; font-weight: 600;">Totale</span></td>
                              <td style="padding: 4px 0; text-align: right;"><span style="font-size: 16px; color: #000000; font-weight: 600;">€${total}</span></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 32px 40px;">
                    <p style="font-size: 14px; line-height: 1.6; color: #5d5e66; margin: 0;">
                      Codice prenotazione: <strong style="color: #000000;">${sessionId}</strong>
                    </p>
                    <p style="font-size: 14px; line-height: 1.6; color: #5d5e66; margin: 16px 0 0;">
                      Per qualsiasi richiesta, contattaci su WhatsApp o rispondi a questa email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 32px; background: #f3f3f3; border-top: 1px solid #cfc4c5;">
                    <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #4c4546; margin: 0;">
                      &copy; ${new Date().getFullYear()} CORLEONE GUESTHOUSE. ALL RIGHTS RESERVED.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function staffTemplate({ guestName, guestEmail, roomName, checkIn, checkOut, total }: StaffEmailProps) {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Inter, -apple-system, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 40px 24px;">
              <table width="480" cellpadding="0" cellspacing="0" style="background: #ffffff; border: 1px solid #cfc4c5;">
                <tr>
                  <td style="padding: 40px 32px 0;">
                    <h1 style="font-size: 30px; font-weight: 600; color: #000000; margin: 0 0 8px; letter-spacing: -0.01em;">
                      CORLEONE GUESTHOUSE
                    </h1>
                    <div style="width: 48px; height: 1px; background: #000000; margin: 16px 0;"></div>
                    <h2 style="font-size: 24px; font-weight: 600; color: #000000; margin: 0 0 16px;">
                      Nuova prenotazione
                    </h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #f3f3f3;">
                      <tr>
                        <td style="padding: 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 4px 0;"><span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #5d5e66; font-weight: 600;">Ospite</span></td>
                              <td style="padding: 4px 0; text-align: right;"><span style="font-size: 16px; color: #000000; font-weight: 600;">${guestName}</span></td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0;"><span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #5d5e66; font-weight: 600;">Email</span></td>
                              <td style="padding: 4px 0; text-align: right;"><span style="font-size: 16px; color: #000000;">${guestEmail}</span></td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0; border-top: 1px solid #cfc4c5;"><span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #5d5e66; font-weight: 600;">Camera</span></td>
                              <td style="padding: 4px 0; border-top: 1px solid #cfc4c5; text-align: right;"><span style="font-size: 16px; color: #000000; font-weight: 600;">${roomName}</span></td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0;"><span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #5d5e66; font-weight: 600;">Check-in</span></td>
                              <td style="padding: 4px 0; text-align: right;"><span style="font-size: 16px; color: #000000;">${checkIn}</span></td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0;"><span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #5d5e66; font-weight: 600;">Check-out</span></td>
                              <td style="padding: 4px 0; text-align: right;"><span style="font-size: 16px; color: #000000;">${checkOut}</span></td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0;"><span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #5d5e66; font-weight: 600;">Totale</span></td>
                              <td style="padding: 4px 0; text-align: right;"><span style="font-size: 16px; color: #000000; font-weight: 600;">€${total}</span></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 32px 40px;">
                    <p style="font-size: 14px; line-height: 1.6; color: #5d5e66; margin: 0;">
                      <a href="mailto:${guestEmail}" style="color: #000000;">Rispondi all'ospite</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 32px; background: #f3f3f3; border-top: 1px solid #cfc4c5;">
                    <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #4c4546; margin: 0;">
                      CORLEONE GUESTHOUSE
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

export async function sendGuestConfirmation(props: GuestEmailProps) {
  const r = getResend()
  if (!r) return
  try {
    await r.emails.send({
      from: FROM,
      to: props.email,
      subject: "Prenotazione confermata - Corleone Guesthouse",
      html: guestTemplate(props),
    })
  } catch (err) {
    console.error("Failed to send guest email:", err)
  }
}

export async function sendStaffNotification(props: StaffEmailProps) {
  const raw = process.env.STAFF_EMAIL
  const r = getResend()
  if (!r || !raw) return
  const to = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  if (to.length === 0) return
  try {
    await r.emails.send({
      from: FROM,
      to,
      subject: `Nuova prenotazione: ${props.guestName} - ${props.roomName}`,
      html: staffTemplate(props),
    })
  } catch (err) {
    console.error("Failed to send staff notification:", err)
  }
}

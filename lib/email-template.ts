export type DetailRow = {
  label: string
  value: string
  /** Renders the value in bold, as used for room and total rows. */
  strong?: boolean
  /** Separates the row from the previous one. */
  divider?: boolean
}

const LABEL_STYLE =
  "font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #5d5e66; font-weight: 600;"

function detailRow({ label, value, strong, divider }: DetailRow) {
  const cellStyle = `padding: 4px 0;${divider ? " border-top: 1px solid #cfc4c5;" : ""}`
  const valueStyle = `font-size: 16px; color: #000000;${strong ? " font-weight: 600;" : ""}`

  return `
                            <tr>
                              <td style="${cellStyle}"><span style="${LABEL_STYLE}">${label}</span></td>
                              <td style="${cellStyle} text-align: right;"><span style="${valueStyle}">${value}</span></td>
                            </tr>`
}

/**
 * Wraps transactional email content in the Corleone Guesthouse layout:
 * branded header, bordered detail table and footer.
 */
export function emailTemplate({
  heading,
  intro = "",
  rows,
  body = "",
  footer,
}: {
  heading: string
  intro?: string
  rows: DetailRow[]
  body?: string
  footer: string
}) {
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
                      ${heading}
                    </h2>
                    ${intro}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #f3f3f3;">
                      <tr>
                        <td style="padding: 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0">${rows.map(detailRow).join("")}
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 32px 40px;">
                    ${body}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 32px; background: #f3f3f3; border-top: 1px solid #cfc4c5;">
                    <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #4c4546; margin: 0;">
                      ${footer}
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

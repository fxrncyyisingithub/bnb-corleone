import { z } from "zod"

export const checkoutSchema = z
  .object({
    roomId: z.string().min(1),
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
    adults: z.number().int().min(1).max(10),
    bambini: z.number().int().min(0).max(6).optional().default(0),
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().min(6).max(30),
  })
  .refine(
    (data) => new Date(data.checkOut) > new Date(data.checkIn),
    { message: "La data di check-out deve essere successiva al check-in", path: ["checkOut"] }
  )

export type CheckoutInput = z.infer<typeof checkoutSchema>

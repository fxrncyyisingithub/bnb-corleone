import { BotIdClient } from "botid/client"

export default function BotIdProvider() {
  return (
    <BotIdClient
      protect={[
        { path: "/api/checkout", method: "POST" },
        { path: "/contatti", method: "GET" },
      ]}
    />
  )
}
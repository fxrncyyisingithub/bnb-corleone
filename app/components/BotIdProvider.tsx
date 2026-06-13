"use client"

import { BotIdClient } from "botid/client"

export default function BotIdProvider() {
  return (
    <BotIdClient
      protect={[
        { path: "/api", method: "*" },
      ]}
    />
  )
}

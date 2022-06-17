import React from "react"
import { Box, Heading, Text } from "components"

export function TxnDetailsDataItem({
  label,
  value,
  children,
}: React.PropsWithChildren<{ label: string; value?: string | number }>) {
  return (
    <Box mb={4}>
      <Heading size="sm" mb={1} opacity={0.6}>
        {label}
      </Heading>
      {value ? <Text fontWeight="medium">{value}</Text> : null}
      {children}
    </Box>
  )
}

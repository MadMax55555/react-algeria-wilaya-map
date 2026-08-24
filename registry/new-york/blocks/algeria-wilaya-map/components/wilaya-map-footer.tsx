"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export function WilayaMapFooter({
  className,
  ...props
}: React.ComponentProps<"footer">) {
  return (
    <footer
      className={cn(
        "relative z-20 border-t bg-muted/30 px-4 py-3 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type WilayaMapHeaderProps = React.ComponentProps<"header"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

export function WilayaMapHeader({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: WilayaMapHeaderProps) {
  return (
    <header
      className={cn(
        "relative z-20 flex flex-col gap-3 border-b bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="min-w-0 space-y-1">
        {title ? <h2 className="font-semibold">{title}</h2> : null}

        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}

        {children}
      </div>

      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}
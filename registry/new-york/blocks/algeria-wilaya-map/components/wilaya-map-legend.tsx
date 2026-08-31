"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type WilayaMapLegendItem = {
  label: React.ReactNode
  color: string
}

type WilayaMapLegendProps = React.ComponentProps<"aside"> & {
  items: WilayaMapLegendItem[]
}

export function WilayaMapLegend({
  items,
  className,
  ...props
}: WilayaMapLegendProps) {
  return (
    <aside
      className={cn(
        "absolute bottom-16 left-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border bg-background/90 px-3 py-2 text-xs shadow-sm backdrop-blur",
        className
      )}
      aria-label="Map legend"
      {...props}
    >
      {items.map((item, index) => (
        <div
          key={`${String(item.label)}-${index}`}
          className="flex items-center gap-2"
        >
          <span
            className="size-3 shrink-0 rounded-sm border border-black/10"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          <span>{item.label}</span>
        </div>
      ))}
    </aside>
  )
}
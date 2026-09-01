"use client"

import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import type { AlgeriaWilaya } from "../data/algeria-wilayas"

type WilayaTooltipProps = {
  wilaya: AlgeriaWilaya
  children: React.ReactNode
  renderTooltip?: (wilaya: AlgeriaWilaya) => React.ReactNode
  delayDuration?: number
  side?: "top" | "right" | "bottom" | "left"
}

export function WilayaTooltip({
  wilaya,
  children,
  renderTooltip,
  delayDuration = 200,
  side = "top",
}: WilayaTooltipProps) {
  const defaultContent = (
    <div className="space-y-0.5">
      <div className="font-medium">{wilaya.name}</div>
      <div className="text-xs text-muted-foreground">Code: {wilaya.id}</div>
    </div>
  )

  const tooltipContent = renderTooltip
    ? renderTooltip(wilaya)
    : defaultContent

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
"use client"

import * as React from "react"
import { Info, Minus, Plus, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useWilayaMapContext } from "../context/wilaya-map-context"

type ToolbarButtonProps = {
  label: string
  onClick: () => void
  children: React.ReactNode
}

function ToolbarButton({
  label,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onClick}
          aria-label={label}
        >
          {children}
        </Button>
      </TooltipTrigger>

      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export function WilayaMapToolbar() {
  const { zoomIn, zoomOut, resetTransform, setIsGuideOpen } =
    useWilayaMapContext()

  return (
    <div className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-lg border bg-background/90 p-2 shadow-sm backdrop-blur">
      <ToolbarButton label="Zoom out" onClick={zoomOut}>
        <Minus className="size-4" />
      </ToolbarButton>

      <ToolbarButton label="Zoom in" onClick={zoomIn}>
        <Plus className="size-4" />
      </ToolbarButton>

      <ToolbarButton label="Reset map" onClick={resetTransform}>
        <RotateCcw className="size-4" />
      </ToolbarButton>

      <ToolbarButton
        label="Open map guide"
        onClick={() => setIsGuideOpen(true)}
      >
        <Info className="size-4" />
      </ToolbarButton>
    </div>
  )
}
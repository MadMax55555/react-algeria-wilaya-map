"use client"

import { Info, Minus, Plus, RotateCcw, X } from "lucide-react"

import { Badge } from "@/registry/new-york/ui/badge"
import { Button } from "@/registry/new-york/ui/button"

import {
  algeriaWilayas,
  type AlgeriaWilaya,
} from "../data/algeria-wilayas"

import MapGuideDialog from "./map-guide-dialog"

import {
  BOTTOM_OVERLAY_SPACE,
  type WilayaStatus,
} from "../utils/vigilance-map.utils"

import { useVigilanceMap } from "../hooks/use-vigilance-map"

type VigilanceMapProps = {
  data?: AlgeriaWilaya[]
  wilayaStatuses?: Partial<Record<string, WilayaStatus>>
  wilayaColors?: Partial<Record<string, string>>
  defaultColor?: string
  strokeColor?: string
  height?: number
  selectable?: boolean
  selectedWilayas?: string[]
  onWilayaClick?: (wilaya: AlgeriaWilaya) => void
  onSelectionChange?: (selectedIds: string[]) => void
}

export function VigilanceMap({
  data = algeriaWilayas,
  wilayaStatuses,
  wilayaColors,
  defaultColor = "#22c55e",
  strokeColor = "#ffffff",
  height = 560,
  selectable = true,
  selectedWilayas,
  onWilayaClick,
  onSelectionChange,
}: VigilanceMapProps) {
  const {
    mapContainerRef,
    svgRef,
    selected,
    transform,
    isGuideOpen,
    setIsGuideOpen,
    setIsPointerInside,
    selectedWilayaObjects,
    getWilayaFill,
    toggleWilaya,
    removeWilaya,
    zoomIn,
    zoomOut,
    resetTransform,
  } = useVigilanceMap({
    data,
    wilayaStatuses,
    wilayaColors,
    defaultColor,
    selectable,
    selectedWilayas,
    onWilayaClick,
    onSelectionChange,
  })

  return (
    <div className="relative h-full overflow-hidden py-1">
      <div className="relative h-full p-0">
        <div
          ref={mapContainerRef}
          className="relative h-full w-full overflow-hidden bg-muted/20"
          style={{
            minHeight: height,
            paddingBottom: BOTTOM_OVERLAY_SPACE,
          }}
          onMouseEnter={() => setIsPointerInside(true)}
          onMouseLeave={() => setIsPointerInside(false)}
        >
          <div className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-lg border bg-background/90 p-2 shadow-sm backdrop-blur">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={zoomOut}
              aria-label="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={zoomIn}
              aria-label="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={resetTransform}
              aria-label="Reset map"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsGuideOpen(true)}
              aria-label="Open map guide"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>

          <svg
            ref={svgRef}
            viewBox="0 0 1000 1000"
            className="h-full min-h-[420px] w-full select-none"
            role="img"
            aria-label="Carte interactive des wilayas d'Algérie"
          >
            <g
              transform={`translate(${transform.x} ${transform.y}) scale(${transform.scale})`}
            >
              {data.map((wilaya) => {
                const id = String(wilaya.id)
                const isSelected = selected.includes(id)
                const isInteractive = selectable || Boolean(onWilayaClick)

                return (
                  <path
                    key={id}
                    d={wilaya.d}
                    fill={getWilayaFill(id)}
                    stroke={isSelected ? "#374151" : strokeColor}
                    strokeWidth={
                      isSelected
                        ? 1.8 / transform.scale
                        : 0.8 / transform.scale
                    }
                    className={[
                      "outline-none transition-opacity duration-200",
                      isInteractive
                        ? "cursor-pointer hover:opacity-80 focus:opacity-80"
                        : "",
                    ].join(" ")}
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleWilaya(wilaya, event.altKey)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        toggleWilaya(wilaya, event.altKey)
                      }
                    }}
                    tabIndex={isInteractive ? 0 : -1}
                    role={isInteractive ? "button" : undefined}
                    aria-label={wilaya.name}
                    aria-pressed={
                      selectable ? isSelected : undefined
                    }
                  >
                    <title>{wilaya.name}</title>
                  </path>
                )
              })}
            </g>
          </svg>

          <div className="absolute inset-x-0 bottom-0 z-20 border-t bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="flex flex-wrap items-center gap-2">
              {selectedWilayaObjects.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  No wilaya selected
                </span>
              ) : (
                selectedWilayaObjects.map((wilaya) => (
                  <Badge
                    key={wilaya.id}
                    variant="secondary"
                    className="flex items-center gap-2 rounded-full px-3 py-1"
                  >
                    <span>{wilaya.name}</span>

                    <button
                      type="button"
                      className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                      onClick={() => removeWilaya(String(wilaya.id))}
                      aria-label={`Remove ${wilaya.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <MapGuideDialog
        isGuideOpen={isGuideOpen}
        setIsGuideOpen={setIsGuideOpen}
      />
    </div>
  )
}

export default VigilanceMap
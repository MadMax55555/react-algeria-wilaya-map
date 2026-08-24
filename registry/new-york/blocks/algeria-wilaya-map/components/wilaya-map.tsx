"use client"

import * as React from "react"

import {
  algeriaWilayas,
  type AlgeriaWilaya,
} from "../data/algeria-wilayas"
import { useWilayaMap } from "../hooks/use-wilaya-map"
import { WilayaMapProvider } from "../context/wilaya-map-context"

type WilayaMapProps = {
  children: React.ReactNode
  data?: AlgeriaWilaya[]
  wilayaColors?: Partial<Record<string, string>>
  defaultColor?: string
  selectedColor?: string
  strokeColor?: string
  height?: number
  selectable?: boolean
  selectedWilayas?: string[]
  setSelectedWilayas?: React.Dispatch<React.SetStateAction<string[]>>
  onWilayaClick?: (wilaya: AlgeriaWilaya) => void
  onSelectionChange?: (selectedIds: string[]) => void
}

export function WilayaMap({
  children,
  data = algeriaWilayas,
  wilayaColors,
  defaultColor = "#22c55e",
  selectedColor = "#15803d",
  strokeColor = "#ffffff",
  height = 560,
  selectable = true,
  selectedWilayas,
  setSelectedWilayas,
  onWilayaClick,
  onSelectionChange,
}: WilayaMapProps) {
  const map = useWilayaMap({
    data,
    wilayaColors,
    defaultColor,
    selectedColor,
    selectable,
    selectedWilayas,
    setSelectedWilayas,
    onWilayaClick,
    onSelectionChange,
  })

  const value = React.useMemo(
    () => ({
      ...map,
      data,
      selectable,
      strokeColor,
      selectedColor,
      height,
    }),
    [map, data, selectable, strokeColor, selectedColor, height]
  )

  return (
    <WilayaMapProvider value={value}>
      <div
        className="w-full overflow-hidden rounded-lg border bg-background"
        style={{ minHeight: height }}
      >
        {children}
      </div>
    </WilayaMapProvider>
  )
}

export default WilayaMap

export { WilayaMapCanvas } from "./wilaya-map-canvas"
export { WilayaMapFooter } from "./wilaya-map-footer"
export { WilayaMapGuideDialog } from "./wilaya-map-guide-dialog"
export { WilayaMapHeader } from "./wilaya-map-header"
export { WilayaMapLegend } from "./wilaya-map-legend"
export { WilayaMapSelection } from "./wilaya-map-selection"
export { WilayaMapToolbar } from "./wilaya-map-toolbar"
export { WilayaMapViewport } from "./wilaya-map-viewport"
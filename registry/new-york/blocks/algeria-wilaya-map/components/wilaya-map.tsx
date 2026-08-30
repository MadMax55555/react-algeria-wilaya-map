"use client"

import * as React from "react"

import {
  algeriaWilayas,
  type AlgeriaWilaya,
} from "../data/algeria-wilayas"
import { WilayaMapProvider } from "../context/wilaya-map-context"
import { useWilayaMap } from "../hooks/use-wilaya-map"
import type { WilayaMapSelectionMode } from "../utils/wilaya-map.utils"

type WilayaMapProps = {
  children: React.ReactNode
  data?: AlgeriaWilaya[]
  wilayaColors?: Partial<Record<string, string>>
  defaultColor?: string
  selectedColor?: string
  strokeColor?: string
  height?: number

  selectionMode?: WilayaMapSelectionMode
  clearable?: boolean
  minSelection?: number
  maxSelection?: number
  modifierKeyMultiSelect?: boolean

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

  selectionMode = "single",
  clearable = true,
  minSelection = 0,
  maxSelection,
  modifierKeyMultiSelect = true,

  selectedWilayas,
  setSelectedWilayas,
  onWilayaClick,
  onSelectionChange,
}: WilayaMapProps) {
  const normalizedMinSelection = Math.max(0, minSelection)

  const normalizedMaxSelection =
    maxSelection === undefined
      ? undefined
      : Math.max(normalizedMinSelection, maxSelection)

  const map = useWilayaMap({
    data,
    wilayaColors,
    defaultColor,
    selectedColor,

    selectionMode,
    clearable,
    minSelection: normalizedMinSelection,
    maxSelection: normalizedMaxSelection,
    modifierKeyMultiSelect,

    selectedWilayas,
    setSelectedWilayas,
    onWilayaClick,
    onSelectionChange,
  })

  const value = React.useMemo(
    () => ({
      ...map,
      data,
      strokeColor,
      selectedColor,
      height,
    }),
    [map, data, strokeColor, selectedColor, height]
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
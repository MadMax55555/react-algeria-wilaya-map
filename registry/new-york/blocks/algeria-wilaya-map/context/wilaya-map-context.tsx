"use client"

import * as React from "react"

import type { AlgeriaWilaya } from "../data/algeria-wilayas"
import { useWilayaMap } from "../hooks/use-wilaya-map"
import type { WilayaMapSelectionMode } from "../utils/wilaya-map.utils"

type WilayaMapContextValue = ReturnType<typeof useWilayaMap> & {
  data: AlgeriaWilaya[]
  selectionMode: WilayaMapSelectionMode
  clearable: boolean
  minSelection: number
  maxSelection?: number
  strokeColor: string
  selectedColor: string
  height: number
}

const WilayaMapContext = React.createContext<WilayaMapContextValue | null>(
  null
)

export function useWilayaMapContext() {
  const context = React.useContext(WilayaMapContext)

  if (!context) {
    throw new Error(
      "WilayaMap subcomponents must be rendered inside <WilayaMap>."
    )
  }

  return context
}

export const WilayaMapProvider = WilayaMapContext.Provider
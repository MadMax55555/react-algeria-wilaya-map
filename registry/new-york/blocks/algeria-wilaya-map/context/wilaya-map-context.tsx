import * as React from "react"

import type { AlgeriaWilaya } from "@/lib/algeria-wilayas"
import { useWilayaMap } from "@/hooks/use-wilaya-map"

type WilayaMapContextValue = ReturnType<typeof useWilayaMap> & {
  data: AlgeriaWilaya[]
  selectable: boolean
  strokeColor: string
  selectedColor: string
  height: number
}

const WilayaMapContext = React.createContext<WilayaMapContextValue | null>(null)

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
"use client"

import MapGuideDialog from "./map-guide-dialog"
import { useWilayaMapContext } from "../context/wilaya-map-context"

export function WilayaMapGuideDialog() {
  const { isGuideOpen, setIsGuideOpen } = useWilayaMapContext()

  return (
    <MapGuideDialog
      isGuideOpen={isGuideOpen}
      setIsGuideOpen={setIsGuideOpen}
    />
  )
}
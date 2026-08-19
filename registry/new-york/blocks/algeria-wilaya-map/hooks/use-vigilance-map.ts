"use client"

import * as React from "react"
import type { AlgeriaWilaya } from "../data/algeria-wilayas"
import {
  MIN_SCALE,
  MAX_SCALE,
  ZOOM_STEP,
  PAN_STEP,
  getNextSelectedWilayas,
  getSelectedWilayaObjects,
  getWilayaFillColor,
  type WilayaStatus,
} from "../utils/vigilance-map.utils"

type UseVigilanceMapParams = {
  data: AlgeriaWilaya[]
  wilayaStatuses?: Partial<Record<string, WilayaStatus>>
  wilayaColors?: Partial<Record<string, string>>
  defaultColor: string
  selectable: boolean
  selectedWilayas?: string[]
  onWilayaClick?: (wilaya: AlgeriaWilaya) => void
  onSelectionChange?: (selectedIds: string[]) => void
}

export function useVigilanceMap({
  data,
  wilayaStatuses,
  wilayaColors,
  defaultColor,
  selectable,
  selectedWilayas,
  onWilayaClick,
  onSelectionChange,
}: UseVigilanceMapParams) {
  const [internalSelected, setInternalSelected] = React.useState<string[]>([])
  const [isPointerInside, setIsPointerInside] = React.useState(false)
  const [isGuideOpen, setIsGuideOpen] = React.useState(false)
  const [transform, setTransform] = React.useState({
    scale: 1,
    x: 0,
    y: 0,
  })

  const mapContainerRef = React.useRef<HTMLDivElement | null>(null)
  const svgRef = React.useRef<SVGSVGElement | null>(null)

  const selected = selectedWilayas ?? internalSelected

  const updateSelection = React.useCallback(
    (next: string[]) => {
      if (!selectedWilayas) {
        setInternalSelected(next)
      }
      onSelectionChange?.(next)
    },
    [selectedWilayas, onSelectionChange]
  )

  const toggleWilaya = React.useCallback(
    (wilaya: AlgeriaWilaya, multiSelect: boolean) => {
      const id = String(wilaya.id)

      const next = getNextSelectedWilayas({
        selected,
        wilayaId: id,
        selectable,
        multiSelect
      })

      if (selectable) {
        updateSelection(next)
      }

      onWilayaClick?.(wilaya)
    },
    [selectable, selected, updateSelection, onWilayaClick, wilayaStatuses]
  )

  const removeWilaya = React.useCallback(
    (id: string) => {
      updateSelection(selected.filter((item) => item !== id))
    },
    [selected, updateSelection]
  )

  const selectedWilayaObjects = React.useMemo(() => {
    return getSelectedWilayaObjects(data, selected)
  }, [data, selected])

  const getWilayaFill = React.useCallback(
    (wilayaId: string) =>
      getWilayaFillColor({
        wilayaId,
        selected,
        wilayaColors,
        wilayaStatuses,
        defaultColor,
      }),
    [selected, wilayaColors, wilayaStatuses, defaultColor]
  )

  const getSvgPoint = React.useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return null

    const point = svg.createSVGPoint()
    point.x = clientX
    point.y = clientY

    const ctm = svg.getScreenCTM()
    if (!ctm) return null

    return point.matrixTransform(ctm.inverse())
  }, [])

  const zoomAtPoint = React.useCallback(
    (clientX: number, clientY: number, nextScale: number) => {
      const svgPoint = getSvgPoint(clientX, clientY)
      if (!svgPoint) return

      setTransform((prev) => {
        const clampedScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale))
        if (clampedScale === prev.scale) return prev

        const worldX = (svgPoint.x - prev.x) / prev.scale
        const worldY = (svgPoint.y - prev.y) / prev.scale

        return {
          scale: clampedScale,
          x: svgPoint.x - worldX * clampedScale,
          y: svgPoint.y - worldY * clampedScale,
        }
      })
    },
    [getSvgPoint]
  )

  const zoomIn = React.useCallback(() => {
    const wrapper = mapContainerRef.current
    if (!wrapper) return

    const rect = wrapper.getBoundingClientRect()
    zoomAtPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      transform.scale + 0.3
    )
  }, [transform.scale, zoomAtPoint])

  const zoomOut = React.useCallback(() => {
    const wrapper = mapContainerRef.current
    if (!wrapper) return

    const rect = wrapper.getBoundingClientRect()
    zoomAtPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      transform.scale - 0.3
    )
  }, [transform.scale, zoomAtPoint])

  const resetTransform = React.useCallback(() => {
    setTransform({
      scale: 1,
      x: 0,
      y: 0,
    })
  }, [])

  React.useEffect(() => {
    const wrapper = mapContainerRef.current
    if (!wrapper) return

    const handleWheel = (e: WheelEvent) => {
      if (!isPointerInside) return

      e.preventDefault()
      e.stopPropagation()

      if (e.ctrlKey) {
        const direction = e.deltaY > 0 ? -1 : 1
        zoomAtPoint(e.clientX, e.clientY, transform.scale + direction * ZOOM_STEP)
        return
      }

      setTransform((prev) => {
        const horizontalDelta = e.shiftKey
          ? (e.deltaY !== 0 ? e.deltaY : e.deltaX)
          : e.deltaX

        return {
          ...prev,
          x: prev.x - horizontalDelta * PAN_STEP,
          y: e.shiftKey ? prev.y : prev.y - e.deltaY * PAN_STEP,
        }
      })
    }

    wrapper.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      wrapper.removeEventListener("wheel", handleWheel)
    }
  }, [isPointerInside, transform.scale, zoomAtPoint])

  return {
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
  }
}
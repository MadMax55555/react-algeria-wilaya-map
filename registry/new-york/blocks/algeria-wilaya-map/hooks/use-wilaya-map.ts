"use client"

import * as React from "react"

import type { AlgeriaWilaya } from "../data/algeria-wilayas"

import {
  MAX_SCALE,
  MIN_SCALE,
  PAN_STEP,
  ZOOM_STEP,
  type WilayaMapSelectionMode,
  getNextSelectedWilayas,
  getSelectedWilayaObjects,
  getWilayaFillColor,
} from "../utils/wilaya-map.utils"

type WilayaMapInteractionEvent = Pick<
  React.MouseEvent<SVGPathElement> | React.KeyboardEvent<SVGPathElement>,
  "altKey" | "ctrlKey" | "metaKey"
>

type UseWilayaMapParams = {
  data: AlgeriaWilaya[]
  wilayaColors?: Partial<Record<string, string>>
  defaultColor: string
  selectedColor: string

  selectionMode: WilayaMapSelectionMode
  clearable: boolean
  minSelection: number
  maxSelection?: number
  modifierKeyMultiSelect: boolean

  selectedWilayas?: string[]
  setSelectedWilayas?: React.Dispatch<React.SetStateAction<string[]>>

  onWilayaClick?: (wilaya: AlgeriaWilaya) => void
  onSelectionChange?: (selectedIds: string[]) => void
}

export function useWilayaMap({
  data,
  wilayaColors,
  defaultColor,
  selectedColor,
  selectionMode,
  clearable,
  minSelection,
  maxSelection,
  modifierKeyMultiSelect,
  selectedWilayas,
  setSelectedWilayas,
  onWilayaClick,
  onSelectionChange,
}: UseWilayaMapParams) {
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
      if (setSelectedWilayas) {
        setSelectedWilayas(next)
      } else if (selectedWilayas === undefined) {
        setInternalSelected(next)
      }

      onSelectionChange?.(next)
    },
    [setSelectedWilayas, selectedWilayas, onSelectionChange]
  )

  const toggleWilaya = React.useCallback(
    (wilaya: AlgeriaWilaya, event: WilayaMapInteractionEvent) => {
      const id = String(wilaya.id)

      const isModifierPressed =
        event.altKey || event.ctrlKey || event.metaKey

      const next = getNextSelectedWilayas({
        selected,
        wilayaId: id,
        selectionMode,
        multiSelectWithModifier:
          modifierKeyMultiSelect && isModifierPressed,
        clearable,
        minSelection,
        maxSelection,
      })

      if (selectionMode !== "none") {
        updateSelection(next)
      }

      onWilayaClick?.(wilaya)
    },
    [
      selected,
      selectionMode,
      modifierKeyMultiSelect,
      clearable,
      minSelection,
      maxSelection,
      updateSelection,
      onWilayaClick,
    ]
  )

  const removeWilaya = React.useCallback(
    (id: string) => {
      const canRemove =
        selectionMode !== "none" &&
        clearable &&
        selected.length > minSelection

      if (!canRemove) {
        return
      }

      updateSelection(selected.filter((item) => item !== id))
    },
    [selectionMode, clearable, minSelection, selected, updateSelection]
  )

  const selectedWilayaObjects = React.useMemo(
    () => getSelectedWilayaObjects(data, selected),
    [data, selected]
  )

  const getWilayaFill = React.useCallback(
    (wilayaId: string) =>
      getWilayaFillColor({
        wilayaId,
        selected,
        wilayaColors,
        defaultColor,
        selectedColor,
      }),
    [selected, wilayaColors, defaultColor, selectedColor]
  )

  const getSvgPoint = React.useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current

    if (!svg) {
      return null
    }

    const point = svg.createSVGPoint()
    point.x = clientX
    point.y = clientY

    const ctm = svg.getScreenCTM()

    if (!ctm) {
      return null
    }

    return point.matrixTransform(ctm.inverse())
  }, [])

  const zoomAtPoint = React.useCallback(
    (clientX: number, clientY: number, nextScale: number) => {
      const svgPoint = getSvgPoint(clientX, clientY)

      if (!svgPoint) {
        return
      }

      setTransform((previous) => {
        const scale = Math.min(
          MAX_SCALE,
          Math.max(MIN_SCALE, nextScale)
        )

        if (scale === previous.scale) {
          return previous
        }

        const worldX = (svgPoint.x - previous.x) / previous.scale
        const worldY = (svgPoint.y - previous.y) / previous.scale

        return {
          scale,
          x: svgPoint.x - worldX * scale,
          y: svgPoint.y - worldY * scale,
        }
      })
    },
    [getSvgPoint]
  )

  const zoomIn = React.useCallback(() => {
    const wrapper = mapContainerRef.current

    if (!wrapper) {
      return
    }

    const rect = wrapper.getBoundingClientRect()

    zoomAtPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      transform.scale + ZOOM_STEP
    )
  }, [transform.scale, zoomAtPoint])

  const zoomOut = React.useCallback(() => {
    const wrapper = mapContainerRef.current

    if (!wrapper) {
      return
    }

    const rect = wrapper.getBoundingClientRect()

    zoomAtPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      transform.scale - ZOOM_STEP
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

    if (!wrapper) {
      return
    }

    const handleWheel = (event: WheelEvent) => {
      if (!isPointerInside) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      if (event.ctrlKey) {
        const direction = event.deltaY > 0 ? -1 : 1

        zoomAtPoint(
          event.clientX,
          event.clientY,
          transform.scale + direction * ZOOM_STEP
        )

        return
      }

      setTransform((previous) => {
        const horizontalDelta = event.shiftKey
          ? event.deltaY || event.deltaX
          : event.deltaX

        return {
          ...previous,
          x: previous.x - horizontalDelta * PAN_STEP,
          y: event.shiftKey
            ? previous.y
            : previous.y - event.deltaY * PAN_STEP,
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
    selectionMode,
    clearable,
    minSelection,
    maxSelection,

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
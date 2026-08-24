import type { AlgeriaWilaya } from "@/lib/algeria-wilayas"

export const MIN_SCALE = 1
export const MAX_SCALE = 6
export const ZOOM_STEP = 0.5
export const PAN_STEP = 1
export const BOTTOM_OVERLAY_SPACE = 116

export function getWilayaFillColor({
  wilayaId,
  selected,
  wilayaColors,
  defaultColor,
  selectedColor,
}: {
  wilayaId: string
  selected: string[]
  wilayaColors?: Partial<Record<string, string>>
  defaultColor: string
  selectedColor: string
}) {
  const color = wilayaColors?.[wilayaId] ?? defaultColor

  if (!selected.includes(wilayaId)) {
    return color
  }

  return selectedColor
}

export function getSelectedWilayaObjects(
  data: AlgeriaWilaya[],
  selected: string[]
) {
  return data.filter((wilaya) => selected.includes(String(wilaya.id)))
}

export function getNextSelectedWilayas({
  selected,
  wilayaId,
  selectable,
  multiSelect,
}: {
  selected: string[]
  wilayaId: string
  selectable: boolean
  multiSelect: boolean
}) {
  if (!selectable) {
    return selected
  }

  if (multiSelect) {
    return selected.includes(wilayaId)
      ? selected.filter((item) => item !== wilayaId)
      : [...selected, wilayaId]
  }

  return selected.length === 1 && selected[0] === wilayaId ? [] : [wilayaId]
}
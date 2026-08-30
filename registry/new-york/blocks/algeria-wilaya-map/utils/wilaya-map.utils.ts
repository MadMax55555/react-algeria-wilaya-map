import type { AlgeriaWilaya } from "../data/algeria-wilayas"

export const MIN_SCALE = 1
export const MAX_SCALE = 6
export const ZOOM_STEP = 0.5
export const PAN_STEP = 1
export const BOTTOM_OVERLAY_SPACE = 116

export type WilayaMapSelectionMode = "single" | "multiple" | "none"

type GetNextSelectedWilayasParams = {
  selected: string[]
  wilayaId: string
  selectionMode: WilayaMapSelectionMode
  multiSelectWithModifier: boolean
  clearable: boolean
  minSelection: number
  maxSelection?: number
}

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
  selectionMode,
  multiSelectWithModifier,
  clearable,
  minSelection,
  maxSelection,
}: GetNextSelectedWilayasParams): string[] {
  if (selectionMode === "none") {
    return selected
  }

  const isSelected = selected.includes(wilayaId)
  const canDeselect = clearable && selected.length > minSelection

  const allowsMultipleSelection =
    selectionMode === "multiple" || multiSelectWithModifier

  if (!allowsMultipleSelection) {
    if (isSelected) {
      return canDeselect ? [] : selected
    }

    return [wilayaId]
  }

  if (isSelected) {
    return canDeselect
      ? selected.filter((id) => id !== wilayaId)
      : selected
  }

  if (maxSelection !== undefined && selected.length >= maxSelection) {
    return selected
  }

  return [...selected, wilayaId]
}
import type { AlgeriaWilaya } from "../data/algeria-wilayas"

export type WilayaStatus = "green" | "yellow" | "orange" | "red"

export const STATUS_COLORS: Record<WilayaStatus, string> = {
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  red: "#ef4444",
}

export const SELECTED_COLOR = "#9ca3af"
export const MIN_SCALE = 1
export const MAX_SCALE = 6
export const ZOOM_STEP = 0.5
export const PAN_STEP = 1
export const BOTTOM_OVERLAY_SPACE = 116

export function getWilayaStatus(
  wilayaId: string,
  wilayaStatuses?: Partial<Record<string, WilayaStatus>>
): WilayaStatus {
  return wilayaStatuses?.[wilayaId] ?? "green"
}

export function getWilayaFillColor({
  wilayaId,
  selected,
  wilayaColors,
  wilayaStatuses,
  defaultColor,
}: {
  wilayaId: string
  selected: string[]
  wilayaColors?: Partial<Record<string, string>>
  wilayaStatuses?: Partial<Record<string, WilayaStatus>>
  defaultColor: string
}) {
  if (selected.includes(wilayaId)) return SELECTED_COLOR
  if (wilayaColors?.[wilayaId]) return wilayaColors[wilayaId]

  const status = wilayaStatuses?.[wilayaId]
  if (status) return STATUS_COLORS[status]

  return defaultColor
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
  wilayaStatuses?: Partial<Record<string, WilayaStatus>>
}) {
  if (!selectable) return selected

  const canMultiSelect = multiSelect

  if (canMultiSelect) {
    return selected.includes(wilayaId)
      ? selected.filter((item) => item !== wilayaId)
      : [...selected, wilayaId]
  }

  return selected.length === 1 && selected[0] === wilayaId ? [] : [wilayaId]
}
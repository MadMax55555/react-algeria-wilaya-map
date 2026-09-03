import { describe, expect, it } from "vitest"

import {
  MIN_SCALE,
  MAX_SCALE,
  ZOOM_STEP,
  PAN_STEP,
  BOTTOM_OVERLAY_SPACE,
  getWilayaFillColor,
  getSelectedWilayaObjects,
  getNextSelectedWilayas,
  type WilayaMapSelectionMode,
} from "./wilaya-map.utils"

describe("constants", () => {
  it("exports expected zoom/pan constants", () => {
    expect(MIN_SCALE).toBe(1)
    expect(MAX_SCALE).toBe(6)
    expect(ZOOM_STEP).toBe(0.5)
    expect(PAN_STEP).toBe(1)
    expect(BOTTOM_OVERLAY_SPACE).toBe(116)
  })
})

describe("getWilayaFillColor", () => {
  const wilayaId = "01"
  const defaultColor = "#22c55e"
  const selectedColor = "#15803d"
  const customColor = "#ef4444"

  it("returns defaultColor when wilaya is not selected and no custom color", () => {
    const result = getWilayaFillColor({
      wilayaId,
      selected: [],
      defaultColor,
      selectedColor,
    })

    expect(result).toBe(defaultColor)
  })

  it("returns custom color when wilaya is not selected and custom color exists", () => {
    const result = getWilayaFillColor({
      wilayaId,
      selected: [],
      wilayaColors: { [wilayaId]: customColor },
      defaultColor,
      selectedColor,
    })

    expect(result).toBe(customColor)
  })

  it("returns selectedColor when wilaya is selected", () => {
    const result = getWilayaFillColor({
      wilayaId,
      selected: [wilayaId],
      wilayaColors: { [wilayaId]: customColor },
      defaultColor,
      selectedColor,
    })

    expect(result).toBe(selectedColor)
  })

  it("returns selectedColor even if there is a custom color", () => {
    const result = getWilayaFillColor({
      wilayaId,
      selected: [wilayaId],
      wilayaColors: { [wilayaId]: customColor },
      defaultColor,
      selectedColor,
    })

    expect(result).toBe(selectedColor)
  })
})

describe("getSelectedWilayaObjects", () => {
  const data = [
    { id: "01", name: "Adrar", d: "M0 0" },
    { id: "02", name: "Chlef", d: "M10 10" },
    { id: "03", name: "Laghouat", d: "M20 20" },
  ]

  it("returns only selected wilayas", () => {
    const selected = ["01", "03"]
    const result = getSelectedWilayaObjects(data, selected)

    expect(result).toEqual([data[0], data[2]])
  })

  it("returns an empty array when nothing is selected", () => {
    const result = getSelectedWilayaObjects(data, [])

    expect(result).toEqual([])
  })

  it("ignores unknown IDs in the selected array", () => {
    const selected = ["01", "99"]
    const result = getSelectedWilayaObjects(data, selected)

    expect(result).toEqual([data[0]])
  })

  it("handles string IDs consistently", () => {
    const selected = ["01"]
    const result = getSelectedWilayaObjects(data, selected)

    expect(result[0].id).toBe("01")
  })
})

describe("getNextSelectedWilayas", () => {
  const wilayaA = "01"
  const wilayaB = "02"
  const wilayaC = "03"

  // ---- selectionMode: "none" ----
  it("returns current selection unchanged when selectionMode is 'none'", () => {
    const result = getNextSelectedWilayas({
      selected: [wilayaA],
      wilayaId: wilayaB,
      selectionMode: "none",
      multiSelectWithModifier: false,
      clearable: true,
      minSelection: 0,
      maxSelection: undefined,
    })

    expect(result).toEqual([wilayaA])
  })

  // ---- selectionMode: "single" ----
  it("selects a new wilaya in single mode when nothing is selected", () => {
    const result = getNextSelectedWilayas({
      selected: [],
      wilayaId: wilayaA,
      selectionMode: "single",
      multiSelectWithModifier: false,
      clearable: true,
      minSelection: 0,
      maxSelection: undefined,
    })

    expect(result).toEqual([wilayaA])
  })

  it("replaces previous selection in single mode", () => {
    const result = getNextSelectedWilayas({
      selected: [wilayaA],
      wilayaId: wilayaB,
      selectionMode: "single",
      multiSelectWithModifier: false,
      clearable: true,
      minSelection: 0,
      maxSelection: undefined,
    })

    expect(result).toEqual([wilayaB])
  })

  it("deselects in single mode when clearable and clicking selected wilaya", () => {
    const result = getNextSelectedWilayas({
      selected: [wilayaA],
      wilayaId: wilayaA,
      selectionMode: "single",
      multiSelectWithModifier: false,
      clearable: true,
      minSelection: 0,
      maxSelection: undefined,
    })

    expect(result).toEqual([])
  })

  it("does not deselect in single mode when clearable is false", () => {
    const result = getNextSelectedWilayas({
      selected: [wilayaA],
      wilayaId: wilayaA,
      selectionMode: "single",
      multiSelectWithModifier: false,
      clearable: false,
      minSelection: 1,
      maxSelection: undefined,
    })

    expect(result).toEqual([wilayaA])
  })

  // ---- selectionMode: "multiple" ----
  it("adds a new wilaya in multiple mode", () => {
    const result = getNextSelectedWilayas({
      selected: [wilayaA],
      wilayaId: wilayaB,
      selectionMode: "multiple",
      multiSelectWithModifier: false,
      clearable: true,
      minSelection: 0,
      maxSelection: undefined,
    })

    expect(result).toEqual([wilayaA, wilayaB])
  })

  it("removes a selected wilaya in multiple mode when clearable", () => {
    const result = getNextSelectedWilayas({
      selected: [wilayaA, wilayaB],
      wilayaId: wilayaA,
      selectionMode: "multiple",
      multiSelectWithModifier: false,
      clearable: true,
      minSelection: 0,
      maxSelection: undefined,
    })

    expect(result).toEqual([wilayaB])
  })

  it("does not remove when at minSelection", () => {
    const result = getNextSelectedWilayas({
      selected: [wilayaA],
      wilayaId: wilayaA,
      selectionMode: "multiple",
      multiSelectWithModifier: false,
      clearable: true,
      minSelection: 1,
      maxSelection: undefined,
    })

    expect(result).toEqual([wilayaA])
  })

  it("respects maxSelection when adding", () => {
    const result = getNextSelectedWilayas({
      selected: [wilayaA, wilayaB],
      wilayaId: wilayaC,
      selectionMode: "multiple",
      multiSelectWithModifier: false,
      clearable: true,
      minSelection: 0,
      maxSelection: 2,
    })

    expect(result).toEqual([wilayaA, wilayaB])
  })

  // ---- multiSelectWithModifier behavior ----
  it("allows multiple selection with modifier even in single mode", () => {
    // Start with A selected, click B with modifier
    const result = getNextSelectedWilayas({
      selected: [wilayaA],
      wilayaId: wilayaB,
      selectionMode: "single",
      multiSelectWithModifier: true,
      clearable: true,
      minSelection: 0,
      maxSelection: undefined,
    })

    expect(result).toEqual([wilayaA, wilayaB])
  })

  it("does not use modifier logic when multiSelectWithModifier is false", () => {
    // In single mode, even if we conceptually think of a "modifier",
    // the function only sees multiSelectWithModifier = false.
    const result = getNextSelectedWilayas({
      selected: [wilayaA],
      wilayaId: wilayaB,
      selectionMode: "single",
      multiSelectWithModifier: false,
      clearable: true,
      minSelection: 0,
      maxSelection: undefined,
    })

    expect(result).toEqual([wilayaB])
  })
})
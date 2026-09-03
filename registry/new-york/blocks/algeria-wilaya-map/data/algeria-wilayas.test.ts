import { describe, expect, it } from "vitest"

import { algeriaWilayas } from "./algeria-wilayas"

describe("algeriaWilayas", () => {
  it("contains at least one wilaya", () => {
    expect(algeriaWilayas.length).toBeGreaterThan(0)
  })

  it("has a unique ID for every wilaya", () => {
    const ids = algeriaWilayas.map((wilaya) => wilaya.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("has a unique name for every wilaya", () => {
    const names = algeriaWilayas.map((wilaya) => wilaya.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it("uses non-empty string IDs, names, and SVG paths", () => {
    for (const wilaya of algeriaWilayas) {
      expect(wilaya.id).toEqual(expect.any(String))
      expect(wilaya.id.trim()).not.toBe("")

      expect(wilaya.name).toEqual(expect.any(String))
      expect(wilaya.name.trim()).not.toBe("")

      expect(wilaya.d).toEqual(expect.any(String))
      expect(wilaya.d.trim()).not.toBe("")
    }
  })

  it("contains SVG path data that begins with a move command", () => {
    for (const wilaya of algeriaWilayas) {
      expect(wilaya.d.trim()).toMatch(/^M/)
    }
  })

  it("does not contain duplicate SVG paths", () => {
    const paths = algeriaWilayas.map((wilaya) => wilaya.d)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it("keeps wilaya IDs as strings", () => {
    expect(
      algeriaWilayas.every((wilaya) => typeof wilaya.id === "string"),
    ).toBe(true)
  })
})
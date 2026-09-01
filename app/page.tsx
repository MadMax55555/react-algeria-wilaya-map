"use client"

import * as React from "react"
import { Check, Clipboard, RotateCcw } from "lucide-react"

import { OpenInV0Button } from "@/components/open-in-v0-button"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  algeriaWilayas,
  type AlgeriaWilaya,
} from "@/registry/new-york/blocks/algeria-wilaya-map/data/algeria-wilayas"
import WilayaMap, {
  WilayaMapCanvas,
  WilayaMapFooter,
  WilayaMapGuideDialog,
  WilayaMapHeader,
  WilayaMapLegend,
  WilayaMapSelection,
  WilayaMapToolbar,
  WilayaMapViewport,
} from "@/registry/new-york/blocks/algeria-wilaya-map/components/wilaya-map"
import type { WilayaMapSelectionMode } from "@/registry/new-york/blocks/algeria-wilaya-map/utils/wilaya-map.utils"

const WILAYA_COLORS = {
  "16": "#60a5fa",
  "31": "#f97316",
  "25": "#a78bfa",
  "06": "#f43f5e",
}

type PlaygroundConfig = {
  selectionMode: WilayaMapSelectionMode
  clearable: boolean
  modifierKeyMultiSelect: boolean
  minSelection: number
  maxSelection: number
  defaultColor: string
  selectedColor: string
  strokeColor: string
  showHeader: boolean
  showToolbar: boolean
  showLegend: boolean
  showSelection: boolean
  showFooter: boolean
  showGuide: boolean

  showTooltip: boolean
  tooltipDelay: number
  tooltipSide: "top" | "right" | "bottom" | "left"
  tooltipSideOffset: number
}

const INITIAL_CONFIG: PlaygroundConfig = {
  selectionMode: "single",
  clearable: true,
  modifierKeyMultiSelect: true,
  minSelection: 0,
  maxSelection: 0,
  defaultColor: "#86efac",
  selectedColor: "#15803d",
  strokeColor: "#ffffff",
  showHeader: true,
  showToolbar: true,
  showLegend: true,
  showSelection: true,
  showFooter: true,
  showGuide: true,

  showTooltip: true,
  tooltipDelay: 200,
  tooltipSide: "top",
  tooltipSideOffset: 4,
}

type ToggleFieldProps = {
  id: string
  label: string
  description?: string
  checked: boolean
  disabled?: boolean
  onCheckedChange: (checked: boolean) => void
}

function ToggleField({
  id,
  label,
  description,
  checked,
  disabled = false,
  onCheckedChange,
}: ToggleFieldProps) {
  return (
    <div
      className={[
        "flex items-start justify-between gap-4 border-b py-3 last:border-b-0",
        disabled ? "opacity-50" : "",
      ].join(" ")}
    >
      <div className="space-y-1">
        <Label
          htmlFor={id}
          className={[
            "text-sm font-medium",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
        >
          {label}
        </Label>

        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </div>
  )
}

type ColorFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

function ColorField({
  id,
  label,
  value,
  onChange,
}: ColorFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-11 cursor-pointer rounded border bg-transparent p-1"
        />

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 min-w-0 flex-1 rounded-md border bg-background px-3 font-mono text-sm"
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  )
}

function generateMapCode(config: PlaygroundConfig) {
  const props = [
    `selectionMode="${config.selectionMode}"`,
    !config.clearable ? "clearable={false}" : null,
    config.minSelection > 0
      ? `minSelection={${config.minSelection}}`
      : null,
    config.maxSelection > 0
      ? `maxSelection={${config.maxSelection}}`
      : null,
    !config.modifierKeyMultiSelect
      ? "modifierKeyMultiSelect={false}"
      : null,
    `defaultColor="${config.defaultColor}"`,
    `selectedColor="${config.selectedColor}"`,
    `strokeColor="${config.strokeColor}"`,
    config.showTooltip
      ? `renderTooltip={(wilaya) => (
      <div>
        <div className="font-medium">{wilaya.name}</div>
        <div className="text-xs text-muted-foreground">
          Code: {wilaya.id}
        </div>
      </div>
    )}`
      : null,
  ]
    .filter(Boolean)
    .map((prop) => `      ${prop}`)
    .join("\n")

  const header = config.showHeader
    ? `
      <WilayaMapHeader
        title="Choose service areas"
        description="Select one or more wilayas where your team operates."
      />
`
    : ""

  const toolbar = config.showToolbar
    ? `
        <WilayaMapToolbar />`
    : ""

  const legend = config.showLegend
    ? `
        <WilayaMapLegend
          items={[
            { label: "Available", color: "${config.defaultColor}" },
            { label: "Algiers priority", color: "#60a5fa" },
            { label: "Oran priority", color: "#f97316" },
            { label: "Selected", color: "${config.selectedColor}" },
          ]}
        />`
    : ""

  const selection = config.showSelection
    ? `
        <WilayaMapSelection emptyMessage="No service area selected" />`
    : ""

  const footer = config.showFooter
    ? `
      <WilayaMapFooter>
        Hold <kbd>Alt</kbd> while clicking to multi-select.
      </WilayaMapFooter>
`
    : ""

  const guide = config.showGuide
    ? `
      <WilayaMapGuideDialog />`
    : ""

  return `import * as React from "react"

import WilayaMap, {
  WilayaMapCanvas,
  WilayaMapFooter,
  WilayaMapGuideDialog,
  WilayaMapHeader,
  WilayaMapLegend,
  WilayaMapSelection,
  WilayaMapToolbar,
  WilayaMapViewport,
} from "@/components/algeria-wilaya-map"

export function ServiceAreaMap() {
  const [selectedWilayas, setSelectedWilayas] = React.useState<string[]>([])

  return (
    <WilayaMap
      selectedWilayas={selectedWilayas}
      setSelectedWilayas={setSelectedWilayas}
${props}
      wilayaColors={{
        "16": "#60a5fa",
        "31": "#f97316",
      }}
    >${header}
      <WilayaMapViewport>
        <WilayaMapCanvas />${toolbar}${legend}${selection}
      </WilayaMapViewport>${footer}${guide}
    </WilayaMap>
  )
}`
}

export default function Home() {
  const [config, setConfig] = React.useState<PlaygroundConfig>(INITIAL_CONFIG)
  const [selectedWilayas, setSelectedWilayas] = React.useState<string[]>([])
  const [lastClickedWilaya, setLastClickedWilaya] =
    React.useState<AlgeriaWilaya | null>(null)
  const [hasCopied, setHasCopied] = React.useState(false)

  const updateConfig = <Key extends keyof PlaygroundConfig>(
    key: Key,
    value: PlaygroundConfig[Key]
  ) => {
    setConfig((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  const normalizedMinSelection = Math.max(0, config.minSelection)

  const maxSelection =
    config.maxSelection > 0
      ? Math.max(normalizedMinSelection, config.maxSelection)
      : undefined

  const selectedNames = React.useMemo(() => {
    return algeriaWilayas
      .filter((wilaya) => selectedWilayas.includes(String(wilaya.id)))
      .map((wilaya) => wilaya.name)
  }, [selectedWilayas])

  const generatedCode = React.useMemo(
    () => generateMapCode(config),
    [config]
  )

  const resetPlayground = () => {
    setConfig(INITIAL_CONFIG)
    setSelectedWilayas([])
    setLastClickedWilaya(null)
    setHasCopied(false)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setHasCopied(true)

      window.setTimeout(() => {
        setHasCopied(false)
      }, 1800)
    } catch {
      setHasCopied(false)
    }
  }

  const isReadOnly = config.selectionMode === "none"
  const modifierKeyAvailable = config.selectionMode === "single"
  const limitsAvailable = config.selectionMode !== "none"

  return (
    <main className="mx-auto min-h-svh max-w-7xl px-4 py-6 sm:py-8">
      <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Custom Registry
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Algeria Wilaya Map
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Configure map props, inspect the live preview, and copy the
            generated integration code.
          </p>
        </div>

        <OpenInV0Button
          name="algeria-wilaya-map"
          className="w-fit"
        />
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-[340px_minmax(0,1fr)] xl:items-start">
        <aside className="xl:sticky xl:top-4 xl:self-start">
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-start justify-between gap-3 border-b px-4 py-4">
              <div>
                <h2 className="font-semibold">Configuration</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Change props without losing the map preview.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={resetPlayground}
                aria-label="Reset map configuration"
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>

            <nav
              className="flex gap-2 overflow-x-auto border-b px-4 py-2 text-xs"
              aria-label="Configuration sections"
            >
              <a
                href="#selection-controls"
                className="rounded-md bg-muted px-2 py-1 whitespace-nowrap transition-colors hover:bg-muted/70"
              >
                Selection
              </a>

              <a
                href="#color-controls"
                className="rounded-md bg-muted px-2 py-1 whitespace-nowrap transition-colors hover:bg-muted/70"
              >
                Colors
              </a>

              <a
                href="#section-controls"
                className="rounded-md bg-muted px-2 py-1 whitespace-nowrap transition-colors hover:bg-muted/70"
              >
                Sections
              </a>

              <a
                href="#tooltip-controls"
                className="rounded-md bg-muted px-2 py-1 whitespace-nowrap transition-colors hover:bg-muted/70"
              >
                Tooltip
              </a>
            </nav>

            <div
              id="sidebar-scroll"
              className="max-h-[calc(100svh-12rem)] overflow-y-auto px-4 pb-4"
            >
              <div className="space-y-6 pt-4">
                <section
                  id="selection-controls"
                  className="scroll-mt-4 space-y-3"
                >
                  <div>
                    <h3 className="text-sm font-semibold">Selection</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Control how users choose Wilayas.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="selection-mode">Selection mode</Label>

                    <select
                      id="selection-mode"
                      value={config.selectionMode}
                      onChange={(event) => {
                        const nextMode = event.target
                          .value as WilayaMapSelectionMode

                        updateConfig("selectionMode", nextMode)

                        if (nextMode === "none") {
                          setSelectedWilayas([])
                        }
                      }}
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                    >
                      <option value="single">Single</option>
                      <option value="multiple">Multiple</option>
                      <option value="none">None / read-only</option>
                    </select>
                  </div>

                  <ToggleField
                    id="clearable"
                    label="Allow deselection"
                    description="Users can remove selected Wilayas."
                    checked={config.clearable}
                    disabled={isReadOnly}
                    onCheckedChange={(value) =>
                      updateConfig("clearable", value)
                    }
                  />

                  <ToggleField
                    id="modifier-key-multi-select"
                    label="Modifier multi-select"
                    description={
                      modifierKeyAvailable
                        ? "Alt, Ctrl, or Command adds to selection."
                        : "Only available in single selection mode."
                    }
                    checked={config.modifierKeyMultiSelect}
                    disabled={!modifierKeyAvailable}
                    onCheckedChange={(value) =>
                      updateConfig("modifierKeyMultiSelect", value)
                    }
                  />

                  <div
                    className={[
                      "grid grid-cols-2 gap-3",
                      !limitsAvailable ? "opacity-50" : "",
                    ].join(" ")}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="min-selection">Minimum</Label>

                      <input
                        id="min-selection"
                        type="number"
                        min={0}
                        max={69}
                        disabled={!limitsAvailable}
                        value={config.minSelection}
                        onChange={(event) => {
                          const nextMinimum = Math.max(
                            0,
                            Number(event.target.value) || 0
                          )

                          updateConfig("minSelection", nextMinimum)

                          if (
                            config.maxSelection > 0 &&
                            config.maxSelection < nextMinimum
                          ) {
                            updateConfig("maxSelection", nextMinimum)
                          }
                        }}
                        className="h-9 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-selection">Maximum</Label>

                      <input
                        id="max-selection"
                        type="number"
                        min={0}
                        max={69}
                        disabled={!limitsAvailable}
                        value={config.maxSelection}
                        onChange={(event) => {
                          const value = Math.max(
                            0,
                            Number(event.target.value) || 0
                          )

                          updateConfig(
                            "maxSelection",
                            value > 0
                              ? Math.max(normalizedMinSelection, value)
                              : 0
                          )
                        }}
                        className="h-9 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed"
                      />

                      <p className="text-xs text-muted-foreground">
                        Use 0 for no limit.
                      </p>
                    </div>
                  </div>
                </section>

                <section
                  id="color-controls"
                  className="scroll-mt-4 space-y-3"
                >
                  <div>
                    <h3 className="text-sm font-semibold">Colors</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Change default, selected, and border colors.
                    </p>
                  </div>

                  <ColorField
                    id="default-color"
                    label="Default fill"
                    value={config.defaultColor}
                    onChange={(value) =>
                      updateConfig("defaultColor", value)
                    }
                  />

                  <ColorField
                    id="selected-color"
                    label="Selected fill"
                    value={config.selectedColor}
                    onChange={(value) =>
                      updateConfig("selectedColor", value)
                    }
                  />

                  <ColorField
                    id="stroke-color"
                    label="Border"
                    value={config.strokeColor}
                    onChange={(value) =>
                      updateConfig("strokeColor", value)
                    }
                  />
                </section>

                <section
                  id="section-controls"
                  className="scroll-mt-4"
                >
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold">Sections</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Show or hide composable map sections.
                    </p>
                  </div>

                  <ToggleField
                    id="show-header"
                    label="Header"
                    checked={config.showHeader}
                    onCheckedChange={(value) =>
                      updateConfig("showHeader", value)
                    }
                  />

                  <ToggleField
                    id="show-toolbar"
                    label="Toolbar"
                    checked={config.showToolbar}
                    onCheckedChange={(value) =>
                      updateConfig("showToolbar", value)
                    }
                  />

                  <ToggleField
                    id="show-legend"
                    label="Legend"
                    checked={config.showLegend}
                    onCheckedChange={(value) =>
                      updateConfig("showLegend", value)
                    }
                  />

                  <ToggleField
                    id="show-selection"
                    label="Selection chips"
                    checked={config.showSelection}
                    onCheckedChange={(value) =>
                      updateConfig("showSelection", value)
                    }
                  />

                  <ToggleField
                    id="show-footer"
                    label="Footer"
                    checked={config.showFooter}
                    onCheckedChange={(value) =>
                      updateConfig("showFooter", value)
                    }
                  />

                  <ToggleField
                    id="show-guide"
                    label="Guide dialog"
                    checked={config.showGuide}
                    onCheckedChange={(value) =>
                      updateConfig("showGuide", value)
                    }
                  />
                </section>

                <section
                  id="tooltip-controls"
                  className="scroll-mt-4"
                >
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold">Tooltip</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Configure hover tooltip behavior.
                    </p>
                  </div>

                  <ToggleField
                    id="show-tooltip"
                    label="Enable tooltip"
                    description="Show tooltip on hover and focus."
                    checked={config.showTooltip}
                    onCheckedChange={(value) =>
                      updateConfig("showTooltip", value)
                    }
                  />

                  <div className="space-y-2">
                    <Label htmlFor="tooltip-delay">Delay (ms)</Label>
                    <input
                      id="tooltip-delay"
                      type="number"
                      min={0}
                      max={2000}
                      step={100}
                      value={config.tooltipDelay}
                      onChange={(event) =>
                        updateConfig(
                          "tooltipDelay",
                          Math.max(0, Number(event.target.value) || 0)
                        )
                      }
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Time before tooltip appears.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tooltip-side">Position</Label>
                    <select
                      id="tooltip-side"
                      value={config.tooltipSide}
                      onChange={(event) =>
                        updateConfig(
                          "tooltipSide",
                          event.target.value as
                            | "top"
                            | "right"
                            | "bottom"
                            | "left"
                        )
                      }
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                    >
                      <option value="top">Top</option>
                      <option value="right">Right</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tooltip-offset">Offset (px)</Label>
                    <input
                      id="tooltip-offset"
                      type="number"
                      min={0}
                      max={32}
                      value={config.tooltipSideOffset}
                      onChange={(event) =>
                        updateConfig(
                          "tooltipSideOffset",
                          Math.max(0, Number(event.target.value) || 0)
                        )
                      }
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Distance from the Wilaya.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <section className="overflow-hidden rounded-xl border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
              <div>
                <h2 className="font-semibold">Live preview</h2>
                <p className="text-sm text-muted-foreground">
                  Changes apply immediately.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWilayas(["16", "31"])}
                >
                  Select 16 + 31
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWilayas([])}
                  disabled={selectedWilayas.length === 0}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="p-4">
              <WilayaMap
                selectedWilayas={selectedWilayas}
                setSelectedWilayas={setSelectedWilayas}
                height={420}
                selectionMode={config.selectionMode}
                clearable={config.clearable}
                minSelection={normalizedMinSelection}
                maxSelection={maxSelection}
                modifierKeyMultiSelect={config.modifierKeyMultiSelect}
                defaultColor={config.defaultColor}
                selectedColor={config.selectedColor}
                strokeColor={config.strokeColor}
                wilayaColors={WILAYA_COLORS}
                onWilayaClick={setLastClickedWilaya}
                renderTooltip={
                  config.showTooltip
                    ? (wilaya) => (
                        <div>
                          <div className="font-medium">{wilaya.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Code: {wilaya.id}
                          </div>
                        </div>
                      )
                    : undefined
                }
                tooltipDelay={config.tooltipDelay}
              >
                {config.showHeader ? (
                  <WilayaMapHeader
                    title="Choose service areas"
                    description="Select one or more wilayas where your team operates."
                  />
                ) : null}

                <WilayaMapViewport>
                  <WilayaMapCanvas />

                  {config.showToolbar ? <WilayaMapToolbar /> : null}

                  {config.showLegend ? (
                    <WilayaMapLegend
                      items={[
                        {
                          label: "Available",
                          color: config.defaultColor,
                        },
                        {
                          label: "Algiers priority",
                          color: "#60a5fa",
                        },
                        {
                          label: "Oran priority",
                          color: "#f97316",
                        },
                        {
                          label: "Selected",
                          color: config.selectedColor,
                        },
                      ]}
                    />
                  ) : null}

                  {config.showSelection ? (
                    <WilayaMapSelection emptyMessage="No service area selected" />
                  ) : null}
                </WilayaMapViewport>

                {config.showFooter ? (
                  <WilayaMapFooter>
                    Hold <kbd>Alt</kbd>, <kbd>Ctrl</kbd>, or <kbd>⌘</kbd>{" "}
                    while clicking to multi-select in single mode.
                  </WilayaMapFooter>
                ) : null}

                {config.showGuide ? <WilayaMapGuideDialog /> : null}
              </WilayaMap>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-4">
              <h2 className="font-semibold">Current state</h2>

              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Selected IDs</dt>
                  <dd className="mt-1 font-mono">
                    {selectedWilayas.length > 0
                      ? selectedWilayas.join(", ")
                      : "None"}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Selected Wilayas</dt>
                  <dd className="mt-1">
                    {selectedNames.length > 0
                      ? selectedNames.join(", ")
                      : "None"}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">
                    Last clicked Wilaya
                  </dt>
                  <dd className="mt-1">
                    {lastClickedWilaya
                      ? `${lastClickedWilaya.name} (${lastClickedWilaya.id})`
                      : "None"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border bg-card p-4">
              <h2 className="font-semibold">Active props</h2>

              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Selection mode</dt>
                  <dd className="mt-1 font-mono">
                    {config.selectionMode}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Selection limits</dt>
                  <dd className="mt-1 font-mono">
                    {normalizedMinSelection} – {maxSelection ?? "unlimited"}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Clearable</dt>
                  <dd className="mt-1">
                    {config.clearable ? "true" : "false"}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">
                    Modifier-key multi-select
                  </dt>
                  <dd className="mt-1">
                    {config.modifierKeyMultiSelect ? "true" : "false"}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Tooltip enabled</dt>
                  <dd className="mt-1">
                    {config.showTooltip ? "true" : "false"}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Tooltip delay</dt>
                  <dd className="mt-1 font-mono">
                    {config.tooltipDelay} ms
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Tooltip position</dt>
                  <dd className="mt-1 font-mono capitalize">
                    {config.tooltipSide}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Tooltip offset</dt>
                  <dd className="mt-1 font-mono">
                    {config.tooltipSideOffset} px
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
              <div>
                <h2 className="font-semibold">Generated code</h2>
                <p className="text-sm text-muted-foreground">
                  Copy the JSX for the active configuration.
                </p>
              </div>

              <Button type="button" size="sm" onClick={copyCode}>
                {hasCopied ? (
                  <Check className="mr-2 size-4" />
                ) : (
                  <Clipboard className="mr-2 size-4" />
                )}
                {hasCopied ? "Copied" : "Copy code"}
              </Button>
            </div>

            <pre className="max-h-[560px] overflow-auto bg-muted/40 p-4 text-xs leading-6">
              <code>{generatedCode}</code>
            </pre>
          </section>
        </div>
      </div>
    </main>
  )
}
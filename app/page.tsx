"use client"

import * as React from "react"

import { OpenInV0Button } from "@/components/open-in-v0-button"
import { Button } from "@/components/ui/button"
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

const DEFAULT_COLORS = {
  "16": "#60a5fa",
  "31": "#f97316",
  "25": "#a78bfa",
  "06": "#f43f5e",
}

type TestCase = {
  id: string
  label: string
  description: string
}

const TEST_CASES: TestCase[] = [
  {
    id: "single",
    label: "Single selection",
    description:
      "A normal click selects one Wilaya and replaces the previous selection.",
  },
  {
    id: "multiple",
    label: "Multiple selection",
    description:
      "Every click adds or removes a Wilaya without requiring a modifier key.",
  },
  {
    id: "modifier",
    label: "Single + modifier multi-select",
    description:
      "Normal click selects one. Alt, Ctrl, or Command click adds/removes extra Wilayas.",
  },
  {
    id: "none",
    label: "Read-only map",
    description:
      "The map remains visible and navigable, but clicking Wilayas does not change selection.",
  },
  {
    id: "required",
    label: "Required selection",
    description:
      "At least one Wilaya must stay selected. Removing the final Wilaya is blocked.",
  },
  {
    id: "max-three",
    label: "Maximum 3 selections",
    description:
      "A fourth Wilaya cannot be added after three Wilayas are selected.",
  },
  {
    id: "not-clearable",
    label: "Not clearable",
    description:
      "Selected Wilayas cannot be removed by clicking the map or selection chips.",
  },
  {
    id: "minimal",
    label: "Minimal composition",
    description:
      "Only the required map root, viewport, and canvas are rendered.",
  },
  {
    id: "uncontrolled",
    label: "Uncontrolled selection",
    description:
      "The component stores selection internally because no external selected state is passed.",
  },
]

function getSelectedNames(selectedIds: string[]) {
  return algeriaWilayas
    .filter((wilaya) => selectedIds.includes(String(wilaya.id)))
    .map((wilaya) => wilaya.name)
}

function TestCaseButton({
  testCase,
  activeCase,
  onClick,
}: {
  testCase: TestCase
  activeCase: string
  onClick: () => void
}) {
  const isActive = activeCase === testCase.id

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-md border px-3 py-2 text-left text-sm transition-colors",
        isActive
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-background hover:bg-muted",
      ].join(" ")}
    >
      <span className="block font-medium">{testCase.label}</span>
      <span
        className={[
          "mt-1 block text-xs",
          isActive
            ? "text-primary-foreground/80"
            : "text-muted-foreground",
        ].join(" ")}
      >
        {testCase.description}
      </span>
    </button>
  )
}

function MapComposition({
  selectedWilayas,
  setSelectedWilayas,
  selectionMode,
  clearable,
  minSelection,
  maxSelection,
  modifierKeyMultiSelect,
  showHeader = true,
  showToolbar = true,
  showLegend = true,
  showSelection = true,
  showFooter = true,
  showGuide = true,
  onWilayaClick,
  onSelectionChange,
}: {
  selectedWilayas?: string[]
  setSelectedWilayas?: React.Dispatch<React.SetStateAction<string[]>>
  selectionMode?: WilayaMapSelectionMode
  clearable?: boolean
  minSelection?: number
  maxSelection?: number
  modifierKeyMultiSelect?: boolean
  showHeader?: boolean
  showToolbar?: boolean
  showLegend?: boolean
  showSelection?: boolean
  showFooter?: boolean
  showGuide?: boolean
  onWilayaClick?: (wilaya: AlgeriaWilaya) => void
  onSelectionChange?: (selectedIds: string[]) => void
}) {
  return (
    <WilayaMap
      selectedWilayas={selectedWilayas}
      setSelectedWilayas={setSelectedWilayas}
      selectionMode={selectionMode}
      clearable={clearable}
      minSelection={minSelection}
      maxSelection={maxSelection}
      modifierKeyMultiSelect={modifierKeyMultiSelect}
      defaultColor="#86efac"
      selectedColor="#15803d"
      wilayaColors={DEFAULT_COLORS}
      onWilayaClick={onWilayaClick}
      onSelectionChange={onSelectionChange}
    >
      {showHeader ? (
        <WilayaMapHeader
          title="Choose service areas"
          description="Select Algerian Wilayas where your field-service team operates."
        />
      ) : null}

      <WilayaMapViewport>
        <WilayaMapCanvas />

        {showToolbar ? <WilayaMapToolbar /> : null}

        {showLegend ? (
          <WilayaMapLegend
            items={[
              { label: "Available", color: "#86efac" },
              { label: "Algiers priority", color: "#60a5fa" },
              { label: "Oran priority", color: "#f97316" },
              { label: "Biskra priority", color: "#a78bfa" },
              { label: "Selected", color: "#15803d" },
            ]}
          />
        ) : null}

        {showSelection ? (
          <WilayaMapSelection emptyMessage="No service area selected" />
        ) : null}
      </WilayaMapViewport>

      {showFooter ? (
        <WilayaMapFooter>
          Hold{" "}
          <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs text-foreground">
            Alt
          </kbd>
          ,{" "}
          <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs text-foreground">
            Ctrl
          </kbd>
          , or{" "}
          <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs text-foreground">
            ⌘
          </kbd>{" "}
          while clicking to temporarily multi-select in single-selection mode.
        </WilayaMapFooter>
      ) : null}

      {showGuide ? <WilayaMapGuideDialog /> : null}
    </WilayaMap>
  )
}

function UncontrolledMapDemo() {
  const [lastSelection, setLastSelection] = React.useState<string[]>([])

  return (
    <div className="space-y-4">
      <MapComposition
        selectionMode="multiple"
        onSelectionChange={setLastSelection}
      />

      <SelectionStatePanel
        title="Internal selection callback"
        selectedWilayas={lastSelection}
      />
    </div>
  )
}

function SelectionStatePanel({
  title,
  selectedWilayas,
  lastClickedWilaya,
}: {
  title: string
  selectedWilayas: string[]
  lastClickedWilaya?: AlgeriaWilaya | null
}) {
  const selectedNames = getSelectedNames(selectedWilayas)

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <h3 className="font-medium">{title}</h3>

      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Selected IDs</dt>
          <dd className="mt-1 font-mono text-foreground">
            {selectedWilayas.length > 0
              ? selectedWilayas.join(", ")
              : "None"}
          </dd>
        </div>

        <div>
          <dt className="text-muted-foreground">Selected Wilayas</dt>
          <dd className="mt-1 font-medium text-foreground">
            {selectedNames.length > 0
              ? selectedNames.join(", ")
              : "None"}
          </dd>
        </div>

        {lastClickedWilaya ? (
          <div>
            <dt className="text-muted-foreground">Last clicked Wilaya</dt>
            <dd className="mt-1 font-medium text-foreground">
              {lastClickedWilaya.name} ({lastClickedWilaya.id})
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  )
}

export default function Home() {
  const [activeCase, setActiveCase] = React.useState("single")
  const [selectedWilayas, setSelectedWilayas] = React.useState<string[]>([])
  const [lastClickedWilaya, setLastClickedWilaya] =
    React.useState<AlgeriaWilaya | null>(null)
  const [selectionEvents, setSelectionEvents] = React.useState<string[]>([])

  const activeTestCase = TEST_CASES.find(
    (testCase) => testCase.id === activeCase
  )

  const resetDemo = React.useCallback(() => {
    setSelectedWilayas([])
    setLastClickedWilaya(null)
    setSelectionEvents([])
  }, [])

  const handleSelectionChange = React.useCallback((next: string[]) => {
    setSelectionEvents((previous) => [
      `${new Date().toLocaleTimeString()}: [${next.join(", ")}]`,
      ...previous,
    ].slice(0, 6))
  }, [])

  const commonProps = {
    selectedWilayas,
    setSelectedWilayas,
    onWilayaClick: setLastClickedWilaya,
    onSelectionChange: handleSelectionChange,
  }

  function renderActiveMap() {
    switch (activeCase) {
      case "multiple":
        return (
          <MapComposition
            {...commonProps}
            selectionMode="multiple"
          />
        )

      case "modifier":
        return (
          <MapComposition
            {...commonProps}
            selectionMode="single"
            modifierKeyMultiSelect
            maxSelection={3}
          />
        )

      case "none":
        return (
          <MapComposition
            {...commonProps}
            selectionMode="none"
          />
        )

      case "required":
        return (
          <MapComposition
            {...commonProps}
            selectionMode="single"
            clearable={false}
            minSelection={1}
          />
        )

      case "max-three":
        return (
          <MapComposition
            {...commonProps}
            selectionMode="multiple"
            maxSelection={3}
          />
        )

      case "not-clearable":
        return (
          <MapComposition
            {...commonProps}
            selectionMode="multiple"
            clearable={false}
          />
        )

      case "minimal":
        return (
          <WilayaMap
            {...commonProps}
            selectionMode="multiple"
            defaultColor="#86efac"
            selectedColor="#15803d"
          >
            <WilayaMapViewport>
              <WilayaMapCanvas />
            </WilayaMapViewport>
          </WilayaMap>
        )

      case "uncontrolled":
        return <UncontrolledMapDemo />

      case "single":
      default:
        return (
          <MapComposition
            {...commonProps}
            selectionMode="single"
          />
        )
    }
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Custom Registry Playground
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Algeria Wilaya Map Test Lab
            </h1>
          </div>

          <OpenInV0Button
            name="algeria-wilaya-map"
            className="w-fit"
          />
        </div>

        <p className="max-w-3xl text-muted-foreground">
          Use this page to manually validate selection behavior, compound
          component composition, controlled state, and map interactions before
          publishing the registry item.
        </p>
      </header>

      <main className="grid flex-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit rounded-lg border bg-card p-3 lg:sticky lg:top-4">
          <div className="mb-3 px-2">
            <h2 className="font-semibold">Test scenarios</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose one scenario, then interact with the map.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {TEST_CASES.map((testCase) => (
              <TestCaseButton
                key={testCase.id}
                testCase={testCase}
                activeCase={activeCase}
                onClick={() => {
                  setActiveCase(testCase.id)
                  resetDemo()
                }}
              />
            ))}
          </div>
        </aside>

        <section className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">
                {activeTestCase?.label}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeTestCase?.description}
              </p>
            </div>

            {activeCase !== "uncontrolled" ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWilayas(["16", "31"])}
                >
                  Select Algiers + Oran
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWilayas(["16", "31", "25"])}
                >
                  Select 3 Wilayas
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWilayas([])}
                  disabled={selectedWilayas.length === 0}
                >
                  Clear externally
                </Button>
              </div>
            ) : null}
          </div>

          {activeCase === "required" && selectedWilayas.length === 0 ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-300">
              This scenario needs an initial selection. Click “Select Algiers +
              Oran” above before testing required selection behavior.
            </div>
          ) : null}

          {renderActiveMap()}

          {activeCase !== "uncontrolled" ? (
            <>
              <SelectionStatePanel
                title="Controlled state from the parent page"
                selectedWilayas={selectedWilayas}
                lastClickedWilaya={lastClickedWilaya}
              />

              <section className="rounded-lg border bg-card p-4">
                <h3 className="font-medium">Recent selection events</h3>

                {selectionEvents.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click a Wilaya to record selection updates.
                  </p>
                ) : (
                  <ol className="mt-3 space-y-1 font-mono text-xs text-muted-foreground">
                    {selectionEvents.map((event, index) => (
                      <li key={`${event}-${index}`}>{event}</li>
                    ))}
                  </ol>
                )}
              </section>
            </>
          ) : null}
        </section>
      </main>
    </div>
  )
}
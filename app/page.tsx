"use client"

import * as React from "react"

import { OpenInV0Button } from "@/components/open-in-v0-button"
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

export default function Home() {
  const [selectedWilayas, setSelectedWilayas] = React.useState<string[]>([])

  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Custom Registry</h1>
        <p className="text-muted-foreground">
          A custom registry for distributing code using shadcn.
        </p>
      </header>

      <main className="flex flex-1 flex-col gap-8">
        <div className="relative flex flex-col gap-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              An Algerian wilaya interactive map component
            </h2>

            <OpenInV0Button
              name="algeria-wilaya-map"
              className="w-fit"
            />
          </div>

          <WilayaMap
            selectedWilayas={selectedWilayas}
            setSelectedWilayas={setSelectedWilayas}
            defaultColor="#86efac"
            selectedColor="#15803d"
            wilayaColors={{
              "16": "#60a5fa",
              "31": "#f97316",
            }}
          >
            <WilayaMapHeader
              title="Choose service areas"
              description="Select one or more wilayas where your team operates."
            />

            <WilayaMapViewport>
              <WilayaMapCanvas />

              <WilayaMapToolbar />

              <WilayaMapLegend
                items={[
                  { label: "Available", color: "#86efac" },
                  { label: "Algiers priority", color: "#60a5fa" },
                  { label: "Oran priority", color: "#f97316" },
                  { label: "Selected", color: "#15803d" },
                ]}
              />

              <WilayaMapSelection emptyMessage="No service area selected" />
            </WilayaMapViewport>

            <WilayaMapFooter>
              Hold{" "}
              <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs text-foreground">
                Alt
              </kbd>{" "}
              while clicking to select multiple wilayas.
            </WilayaMapFooter>

            <WilayaMapGuideDialog />
          </WilayaMap>

          <div className="flex flex-col gap-3 rounded-md bg-muted/40 p-3">
            <p className="text-sm text-muted-foreground">
              Selected IDs:{" "}
              <span className="font-medium text-foreground">
                {selectedWilayas.length > 0
                  ? selectedWilayas.join(", ")
                  : "None"}
              </span>
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="w-fit rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                onClick={() => setSelectedWilayas(["16", "31"])}
              >
                Select Algiers and Oran
              </button>

              <button
                type="button"
                className="w-fit rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
                onClick={() => setSelectedWilayas([])}
                disabled={selectedWilayas.length === 0}
              >
                Clear selection
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
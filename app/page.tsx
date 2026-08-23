"use client"

import * as React from "react"
import { OpenInV0Button } from "@/components/open-in-v0-button"
import WilayaMap from "@/registry/new-york/blocks/algeria-wilaya-map/components/wilaya-map"

export default function Home() {
  const [selectedWilayas, setSelectedWilayas] = React.useState<string[]>([])

  return (
    <div className="max-w-3xl mx-auto flex min-h-svh flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Custom Registry</h1>
        <p className="text-muted-foreground">
          A custom registry for distributing code using shadcn.
        </p>
      </header>

      <main className="flex flex-1 flex-col gap-8">
        <div className="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              An Algerian wilaya interactive map component
            </h2>
            <OpenInV0Button name="algeria-wilaya-map" className="w-fit" />
          </div>

          <div className="relative flex min-h-[400px] items-center justify-center">
            <WilayaMap
              selectedWilayas={selectedWilayas}
              setSelectedWilayas={setSelectedWilayas}
              defaultColor="#86efac"
              selectedColor="#15803d"
              wilayaColors={{
                "16": "#60a5fa",
                "31": "#f97316",
              }}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Selected IDs:{" "}
            {selectedWilayas.length > 0
              ? selectedWilayas.join(", ")
              : "None"}
          </p>

          <button
            type="button"
            className="w-fit rounded-md border px-3 py-2 text-sm"
            onClick={() => setSelectedWilayas(["16", "31"])}
          >
            Select Algiers and Oran from outside
          </button>
        </div>
      </main>
    </div>
  )
}
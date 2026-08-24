"use client"

import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { useWilayaMapContext } from "@/context/wilaya-map-context"

type WilayaMapSelectionProps = {
  emptyMessage?: string
}

export function WilayaMapSelection({
  emptyMessage = "No wilaya selected",
}: WilayaMapSelectionProps) {
  const { selectedWilayaObjects, removeWilaya } = useWilayaMapContext()

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 border-t bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex flex-wrap items-center gap-2">
        {selectedWilayaObjects.length === 0 ? (
          <span className="text-sm text-muted-foreground">
            {emptyMessage}
          </span>
        ) : (
          selectedWilayaObjects.map((wilaya) => (
            <Badge
              key={wilaya.id}
              variant="secondary"
              className="flex items-center gap-2 rounded-full px-3 py-1"
            >
              <span>{wilaya.name}</span>

              <button
                type="button"
                className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                onClick={() => removeWilaya(String(wilaya.id))}
                aria-label={`Remove ${wilaya.name}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  )
}
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { useWilayaMapContext } from "../context/wilaya-map-context"
import { BOTTOM_OVERLAY_SPACE } from "../utils/wilaya-map.utils"

export function WilayaMapViewport({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const { mapContainerRef, setIsPointerInside } = useWilayaMapContext()

  return (
    <div
      ref={mapContainerRef}
      className={cn(
        "relative min-h-[420px] w-full overflow-hidden bg-muted/20",
        className
      )}
      style={{
        paddingBottom: BOTTOM_OVERLAY_SPACE,
        ...style,
      }}
      onMouseEnter={() => setIsPointerInside(true)}
      onMouseLeave={() => setIsPointerInside(false)}
      {...props}
    >
      {children}
    </div>
  )
}
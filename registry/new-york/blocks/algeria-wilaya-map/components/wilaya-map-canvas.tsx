"use client"

import { useWilayaMapContext } from "@/context/wilaya-map-context"

export function WilayaMapCanvas() {
  const {
    svgRef,
    data,
    selected,
    transform,
    selectable,
    strokeColor,
    selectedColor,
    getWilayaFill,
    toggleWilaya,
  } = useWilayaMapContext()

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 1000"
      className="block min-h-[420px] w-full select-none"
      role="img"
      aria-label="Interactive map of Algeria wilayas"
    >
      <g
        transform={`translate(${transform.x} ${transform.y}) scale(${transform.scale})`}
      >
        {data.map((wilaya) => {
          const id = String(wilaya.id)
          const isSelected = selected.includes(id)
          const isInteractive = selectable

          return (
            <path
              key={id}
              d={wilaya.d}
              fill={getWilayaFill(id)}
              stroke={isSelected ? selectedColor : strokeColor}
              strokeWidth={
                isSelected
                  ? 2 / transform.scale
                  : 0.8 / transform.scale
              }
              className={[
                "outline-none transition-opacity duration-200",
                isInteractive
                  ? "cursor-pointer hover:opacity-80 focus:opacity-80"
                  : "",
              ].join(" ")}
              onClick={(event) => {
                event.stopPropagation()
                toggleWilaya(wilaya, event.altKey)
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  toggleWilaya(wilaya, event.altKey)
                }
              }}
              tabIndex={isInteractive ? 0 : -1}
              role={isInteractive ? "button" : undefined}
              aria-label={wilaya.name}
              aria-pressed={selectable ? isSelected : undefined}
            >
              <title>{wilaya.name}</title>
            </path>
          )
        })}
      </g>
    </svg>
  )
}
# ACME shadcn Registry

A developer-focused **shadcn registry** of reusable UI components and blocks. The registry currently includes **Algeria Wilaya Map** and is designed to grow with additional components over time.

Components are installed directly into your application as source code, so you can inspect, adapt, and maintain them in your own codebase.

## Available components

| Component | Description | Install command |
| --- | --- | --- |
| `wilaya-map` | Interactive Algeria wilaya map with controlled selection, zoom, pan, toolbar controls, legend, selection display, guide dialog, color overrides, and configurable tooltips. | `npx shadcn@latest add http://localhost:3000/r/wilaya-map.json` |

## Prerequisites

Before installing a registry item, your application should have:

- A React project, typically Next.js
- TypeScript support
- Tailwind CSS configured
- shadcn/ui initialized
- Node.js 18.17 or later recommended
- A package manager such as npm, pnpm, bun, or yarn

The registry is built and tested with Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, and `lucide-react`.

## Initialize shadcn/ui

If your project does not use shadcn/ui yet, initialize it first from the root of your application:

```bash
npx shadcn@latest init
```

Follow the CLI prompts to configure your preferred style, base color, CSS variables, aliases, and Tailwind setup.

Your project should have an alias compatible with imports such as:

```ts
@/components/ui/button
```

For a standard Next.js project, this is commonly configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Install a component

Install `wilaya-map` with the shadcn CLI:

```bash
npx shadcn@latest add http://localhost:3000/r/wilaya-map.json
```

The URL above targets a local registry during development. Replace `http://localhost:3000` with your deployed registry host when publishing the registry.

For example, after deployment:

```bash
npx shadcn@latest add https://your-domain.com/r/wilaya-map.json
```

The CLI downloads the registry files into your project and installs the dependencies declared by the registry item.

## Installed files

The `wilaya-map` registry item installs the component under:

```text
components/algeria-wilaya-map/
├── index.ts
├── components/
│   ├── map-guide-dialog.tsx
│   ├── wilaya-map.tsx
│   ├── wilaya-map-canvas.tsx
│   ├── wilaya-map-footer.tsx
│   ├── wilaya-map-guide-dialog.tsx
│   ├── wilaya-map-header.tsx
│   ├── wilaya-map-legend.tsx
│   ├── wilaya-map-selection.tsx
│   ├── wilaya-map-toolbar.tsx
│   ├── wilaya-map-tooltip.tsx
│   └── wilaya-map-viewport.tsx
├── context/
│   └── wilaya-map-context.tsx
├── data/
│   └── algeria-wilayas.ts
├── hooks/
│   └── use-wilaya-map.ts
└── utils/
    └── wilaya-map.utils.ts
```

## Dependencies

The registry item declares the following dependencies:

```text
lucide-react
```

It also installs these shadcn/ui registry dependencies when needed:

```text
badge
button
card
dialog
tooltip
```

If you install files manually instead of using the registry command, add them yourself:

```bash
npm install lucide-react
npx shadcn@latest add badge button card dialog tooltip
```

Use the equivalent package-manager command if you use pnpm, yarn, or bun.

## Use the map

The map uses React state, so render it in a Client Component. In Next.js App Router, add the `"use client"` directive at the top of the file.

Create a component such as `components/service-area-map.tsx`:

```tsx
"use client"

import * as React from "react"

import WilayaMap, {
  WilayaMapCanvas,
  WilayaMapViewport,
} from "@/components/algeria-wilaya-map"

export function ServiceAreaMap() {
  const [selectedWilayas, setSelectedWilayas] = React.useState<string[]>([])

  return (
    <WilayaMap
      selectedWilayas={selectedWilayas}
      setSelectedWilayas={setSelectedWilayas}
    >
      <WilayaMapViewport>
        <WilayaMapCanvas />
      </WilayaMapViewport>
    </WilayaMap>
  )
}
```

Then import it into a page:

```tsx
import { ServiceAreaMap } from "@/components/service-area-map"

export default function Page() {
  return <ServiceAreaMap />
}
```

## Full example

The component is composable. Add only the sections your product needs.

```tsx
"use client"

import * as React from "react"

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
      height={420}
      selectionMode="single"
      clearable
      modifierKeyMultiSelect
      defaultColor="#86efac"
      selectedColor="#15803d"
      strokeColor="#ffffff"
      wilayaColors={{
        "16": "#60a5fa",
        "31": "#f97316",
      }}
      tooltipDelay={200}
      tooltipSide="top"
      tooltipSideOffset={4}
      renderTooltip={(wilaya) => (
        <div>
          <p className="font-medium">{wilaya.name}</p>
          <p className="text-xs text-muted-foreground">
            Wilaya code: {wilaya.id}
          </p>
        </div>
      )}
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
        Hold <kbd>Alt</kbd>, <kbd>Ctrl</kbd>, or <kbd>⌘</kbd> while clicking
        to add wilayas in single-selection mode.
      </WilayaMapFooter>

      <WilayaMapGuideDialog />
    </WilayaMap>
  )
}
```

## Controlled selection

`WilayaMap` is a controlled component. Store selected wilaya IDs in the parent component and pass both the array and its setter.

```tsx
const [selectedWilayas, setSelectedWilayas] = React.useState<string[]>([])

<WilayaMap
  selectedWilayas={selectedWilayas}
  setSelectedWilayas={setSelectedWilayas}
>
  <WilayaMapViewport>
    <WilayaMapCanvas />
  </WilayaMapViewport>
</WilayaMap>
```

Wilaya IDs are stored as strings. When working with the provided data, convert numeric IDs with `String(wilaya.id)` before comparing them with `selectedWilayas`.

## Selection modes

| Value | Behavior |
| --- | --- |
| `"single"` | A normal click selects one wilaya. Alt, Ctrl, or Command can add/remove items when `modifierKeyMultiSelect` is enabled. |
| `"multiple"` | Each click toggles a wilaya independently. |
| `"none"` | Read-only mode; selection changes are disabled. |

Use `minSelection` and `maxSelection` to constrain the selection.

```tsx
<WilayaMap
  selectedWilayas={selectedWilayas}
  setSelectedWilayas={setSelectedWilayas}
  selectionMode="multiple"
  minSelection={1}
  maxSelection={3}
>
  <WilayaMapViewport>
    <WilayaMapCanvas />
  </WilayaMapViewport>
</WilayaMap>
```

Use `maxSelection={undefined}` for no upper limit. If your UI represents unlimited as `0`, convert it to `undefined` before passing it to the component.

## Colors

Set global map colors and override individual wilayas when a region needs a special visual status.

```tsx
<WilayaMap
  selectedWilayas={selectedWilayas}
  setSelectedWilayas={setSelectedWilayas}
  defaultColor="#dcfce7"
  selectedColor="#166534"
  strokeColor="#ffffff"
  wilayaColors={{
    "16": "#60a5fa",
    "31": "#f97316",
    "25": "#a78bfa",
    "06": "#f43f5e",
  }}
>
  <WilayaMapViewport>
    <WilayaMapCanvas />
  </WilayaMapViewport>
</WilayaMap>
```

## Tooltips

Enable a custom tooltip by passing `renderTooltip`. Tooltip settings control opening delay, preferred side, and spacing from the map region.

```tsx
<WilayaMap
  selectedWilayas={selectedWilayas}
  setSelectedWilayas={setSelectedWilayas}
  tooltipDelay={300}
  tooltipSide="right"
  tooltipSideOffset={8}
  renderTooltip={(wilaya) => (
    <div className="space-y-1">
      <p className="font-medium">{wilaya.name}</p>
      <p className="text-xs text-muted-foreground">Code: {wilaya.id}</p>
    </div>
  )}
>
  <WilayaMapViewport>
    <WilayaMapCanvas />
  </WilayaMapViewport>
</WilayaMap>
```

Remove the `renderTooltip` prop, or pass `undefined`, to disable tooltips.

```tsx
renderTooltip={undefined}
```

## API reference

### `WilayaMap`

| Prop | Type | Description |
| --- | --- | --- |
| `selectedWilayas` | `string[]` | Required controlled array of selected wilaya IDs. |
| `setSelectedWilayas` | `React.Dispatch<React.SetStateAction<string[]>>` | Required selection state setter. |
| `children` | `React.ReactNode` | Composable map sections. |
| `height` | `number` | Height of the map viewport in pixels. |
| `selectionMode` | `"single" \| "multiple" \| "none"` | Selection behavior. |
| `clearable` | `boolean` | Allows users to remove selections. |
| `modifierKeyMultiSelect` | `boolean` | Enables Alt, Ctrl, or Command multi-selection in single mode. |
| `minSelection` | `number` | Minimum selected wilayas. |
| `maxSelection` | `number \| undefined` | Maximum selected wilayas; omit for unlimited. |
| `defaultColor` | `string` | Fill color for unselected wilayas. |
| `selectedColor` | `string` | Fill color for selected wilayas. |
| `strokeColor` | `string` | SVG border color. |
| `wilayaColors` | `Record<string, string>` | Per-wilaya fill color overrides keyed by ID. |
| `onWilayaClick` | `(wilaya: AlgeriaWilaya) => void` | Callback invoked after a wilaya click. |
| `renderTooltip` | `(wilaya: AlgeriaWilaya) => React.ReactNode` | Custom tooltip UI; omit to disable tooltips. |
| `tooltipDelay` | `number` | Tooltip open delay in milliseconds. |
| `tooltipSide` | `"top" \| "right" \| "bottom" \| "left"` | Preferred tooltip placement. |
| `tooltipSideOffset` | `number` | Tooltip distance from the target in pixels. |

### Composable exports

| Export | Purpose |
| --- | --- |
| `WilayaMapViewport` | Layout container for the map and overlays. |
| `WilayaMapCanvas` | Interactive SVG map surface. |
| `WilayaMapHeader` | Optional title and description. |
| `WilayaMapToolbar` | Map zoom, pan, or reset controls. |
| `WilayaMapLegend` | Status/color legend. |
| `WilayaMapSelection` | Displays selected wilayas or an empty message. |
| `WilayaMapFooter` | Footer content below the map. |
| `WilayaMapGuideDialog` | Optional usage instructions dialog. |

## Preview and code generation

The registry includes a playground/preview experience for `wilaya-map`. It lets developers configure selection, colors, composable sections, and tooltip behavior in a live preview.

The preview also exposes a **Copy code** action that generates JSX matching the currently selected configuration. Use it to bootstrap an implementation, then adapt the installed source files to your product requirements.

## Customize installed source

Registry components are copied into your repository rather than consumed as an opaque package. You can safely customize them after installation.

Common customization points include:

- Editing `components/wilaya-map.tsx` to add or change top-level props
- Editing `components/wilaya-map-canvas.tsx` to adjust SVG interactions or map styling
- Editing `components/wilaya-map-tooltip.tsx` to change tooltip behavior or visual design
- Editing `data/algeria-wilayas.ts` to enrich wilaya data used by your application
- Editing `hooks/use-wilaya-map.ts` to alter selection, pan, or zoom logic
- Editing `components/wilaya-map-legend.tsx` and `components/wilaya-map-selection.tsx` for product-specific UI

## Registry development

This repository is a shadcn registry. Build registry output with:

```bash
pnpm registry:build
```

Run the development server with:

```bash
pnpm dev
```

After starting the local application, install the map into another shadcn-enabled project with:

```bash
npx shadcn@latest add http://localhost:3000/r/wilaya-map.json
```

When the registry is hosted publicly, update the installation URL to the deployed host.

## Adding future components

Add each future item to `registry.json` with:

- A unique `name`
- A registry `type`, such as `registry:component`
- A clear title and description
- NPM dependencies in `dependencies`
- shadcn component dependencies in `registryDependencies`
- Explicit source-to-target file mappings in `files`

Then rebuild the registry:

```bash
pnpm registry:build
```

Consumers can install each published component with the same pattern:

```bash
npx shadcn@latest add https://your-domain.com/r/<component-name>.json
```

## Troubleshooting

### `shadcn` command fails

Verify that Node.js is installed, that the command is run from your application root, and that the project has a valid `components.json` generated by `npx shadcn@latest init`.

### Imports using `@/` fail

Configure the `@/*` TypeScript alias and ensure it points to the correct source directory in your project.

### Tooltip errors occur

Ensure the shadcn tooltip dependency is installed:

```bash
npx shadcn@latest add tooltip
```

### The map does not update selection

The component is controlled. Pass both `selectedWilayas` and `setSelectedWilayas`, and keep IDs as strings.

### Registry URL changes after deployment

Only the host changes. Keep the registry path and item name consistent:

```bash
npx shadcn@latest add https://your-domain.com/r/wilaya-map.json
```

## Author

Saadi Bella — [GitHub](https://github.com/MadMax55555)
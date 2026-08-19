import { Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york/ui/dialog"

type MapGuideDialogProps = {
  isGuideOpen: boolean
  setIsGuideOpen: (open: boolean) => void
}

function MapGuideDialog({isGuideOpen,setIsGuideOpen,}: MapGuideDialogProps) {
  return (
    <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
                <Info className="h-4 w-4 text-primary" />
                Guide de la carte
            </DialogTitle>
            <DialogDescription>
                Comment interagir avec la carte des wilayas.
            </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
            <div className="rounded-xl border bg-muted/40 p-4">
                <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    Click
                    </span>
                    <span>Sélectionner une seule wilaya.</span>
                </li>

                <li className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    Alt + Click
                    </span>
                    <span> Sélectionner plusieurs wilayas.</span>
                </li>

                <li className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    Scroll
                    </span>
                    <span>Se déplacer verticalement dans la carte.</span>
                </li>

                <li className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-md bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    Shift + Scroll
                    </span>
                    <span>Se déplacer horizontalement dans la carte.</span>
                </li>

                <li className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    Ctrl + Scroll
                    </span>
                    <span>Zoomer et dézoomer dans la carte.</span>
                </li>
                </ul>
            </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default MapGuideDialog

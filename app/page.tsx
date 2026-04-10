import { Suspense } from "react"
import { ParliamentVisualization } from "@/components/parliament-visualization"

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ParliamentVisualization />
    </Suspense>
  )
}


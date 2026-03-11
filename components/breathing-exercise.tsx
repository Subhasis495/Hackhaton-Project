"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind } from "lucide-react"
import { cn } from "@/lib/utils"

type Phase = "inhale" | "hold" | "exhale" | "rest"

const phases: { phase: Phase; duration: number; instruction: string }[] = [
  { phase: "inhale", duration: 4, instruction: "Breathe in..." },
  { phase: "hold", duration: 4, instruction: "Hold..." },
  { phase: "exhale", duration: 4, instruction: "Breathe out..." },
  { phase: "rest", duration: 2, instruction: "Rest..." },
]

interface BreathingExerciseProps {
  onComplete: () => void
  onSkip: () => void
  cycles?: number
}

export function BreathingExercise({ onComplete, onSkip, cycles = 3 }: BreathingExerciseProps) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [timeInPhase, setTimeInPhase] = useState(phases[0].duration)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [isActive, setIsActive] = useState(true)

  const currentPhase = phases[currentPhaseIndex]
  const totalDuration = phases.reduce((acc, p) => acc + p.duration, 0)
  const phaseProgress = ((currentPhase.duration - timeInPhase) / currentPhase.duration) * 100

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeInPhase((prev) => {
        if (prev <= 1) {
          // Move to next phase
          const nextIndex = (currentPhaseIndex + 1) % phases.length
          
          if (nextIndex === 0) {
            // Completed a cycle
            if (currentCycle >= cycles) {
              setIsActive(false)
              setTimeout(onComplete, 500)
              return 0
            }
            setCurrentCycle((c) => c + 1)
          }
          
          setCurrentPhaseIndex(nextIndex)
          return phases[nextIndex].duration
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, currentPhaseIndex, currentCycle, cycles, onComplete])

  const getCircleScale = () => {
    switch (currentPhase.phase) {
      case "inhale":
        return 1 + (phaseProgress / 100) * 0.5
      case "hold":
        return 1.5
      case "exhale":
        return 1.5 - (phaseProgress / 100) * 0.5
      case "rest":
        return 1
      default:
        return 1
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <div className="h-2 bg-primary" />
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Wind className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Breathing Exercise</CardTitle>
        <p className="text-sm text-muted-foreground">
          Cycle {currentCycle} of {cycles}
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center justify-center py-8">
          <div className="relative h-48 w-48 flex items-center justify-center">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-muted" />
            
            {/* Animated breathing circle */}
            <div
              className={cn(
                "rounded-full bg-primary/20 transition-transform duration-1000 ease-in-out flex items-center justify-center",
                currentPhase.phase === "inhale" && "bg-primary/30",
                currentPhase.phase === "hold" && "bg-primary/40",
                currentPhase.phase === "exhale" && "bg-primary/20"
              )}
              style={{
                width: 120,
                height: 120,
                transform: `scale(${getCircleScale()})`,
              }}
            >
              <div className="text-center">
                <p className="text-lg font-medium text-primary">
                  {timeInPhase}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-2xl font-semibold text-foreground">
            {currentPhase.instruction}
          </p>
          <div className="flex justify-center gap-2">
            {phases.map((p, idx) => (
              <div
                key={p.phase}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  idx === currentPhaseIndex ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={onSkip}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

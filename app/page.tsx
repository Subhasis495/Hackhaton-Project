"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { WorkTimer } from "@/components/work-timer"
import { GamificationStats } from "@/components/gamification-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ArrowRight, 
  Stethoscope, 
  MapPin, 
  Timer,
  Heart,
  Sparkles,
  TrendingUp
} from "lucide-react"

export default function HomePage() {
  const [points, setPoints] = useState(0)
  const [streak] = useState(1)
  const [breaksCompleted, setBreaksCompleted] = useState(0)
  const [todayBreaks, setTodayBreaks] = useState({
    hydration: 0,
    breathing: 0,
    stretching: 0,
  })

  const handlePointsEarned = (earned: number) => {
    setPoints((prev) => prev + earned)
  }

  const handleBreakCompleted = () => {
    setBreaksCompleted((prev) => prev + 1)
    // Randomly increment one of the break types for demo
    const types = ["hydration", "breathing", "stretching"] as const
    const randomType = types[Math.floor(Math.random() * types.length)]
    setTodayBreaks((prev) => ({
      ...prev,
      [randomType]: prev[randomType] + 1,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">Your Wellness Companion</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 text-balance">
              Take Better Care of Yourself, One Micro-Break at a Time
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
              WellnessNudge helps you maintain healthy habits throughout your workday with gamified reminders for stretching, hydration, and breathing exercises.
            </p>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Timer */}
          <div className="space-y-8">
            <WorkTimer 
              onPointsEarned={handlePointsEarned}
              onBreakCompleted={handleBreakCompleted}
            />

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/symptoms" className="block">
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Stethoscope className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          Symptom Checker
                          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Find the right specialist for your symptoms
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/clinics" className="block">
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-accent/30 flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          Find Clinics
                          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Locate affordable healthcare near you
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div>
            <GamificationStats
              points={points}
              streak={streak}
              breaksCompleted={breaksCompleted}
              todayBreaks={todayBreaks}
            />
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-16 pt-16 border-t">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Everything You Need for Workplace Wellness
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines productivity tools with health features to help you stay balanced throughout your day.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Timer className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart Work Timer</CardTitle>
                <CardDescription>
                  Focus sessions with automatic break reminders. Customize your work and break durations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/30 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Gamified Wellness</CardTitle>
                <CardDescription>
                  Earn points for completing breaks. Build streaks and unlock achievements.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-chart-2/20 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-chart-2" />
                </div>
                <CardTitle>Health Insights</CardTitle>
                <CardDescription>
                  Track your wellness habits over time. Find healthcare when you need it.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">WellnessNudge</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Take care of your health. One break at a time.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">About</Button>
              <Button variant="ghost" size="sm">Privacy</Button>
              <Button variant="ghost" size="sm">Help</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { WorkTimer } from "@/components/work-timer"
import { GamificationStats } from "@/components/gamification-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Clock,
  History,
  Settings,
  Target
} from "lucide-react"

const recentActivity = [
  { type: "breathing", time: "10 minutes ago", points: 10 },
  { type: "hydration", time: "45 minutes ago", points: 5 },
  { type: "stretching", time: "2 hours ago", points: 15 },
  { type: "breathing", time: "3 hours ago", points: 10 },
]

export default function TimerPage() {
  const [points, setPoints] = useState(40)
  const [streak] = useState(3)
  const [breaksCompleted, setBreaksCompleted] = useState(4)
  const [todayBreaks, setTodayBreaks] = useState({
    hydration: 1,
    breathing: 2,
    stretching: 1,
  })

  const handlePointsEarned = (earned: number) => {
    setPoints((prev) => prev + earned)
  }

  const handleBreakCompleted = () => {
    setBreaksCompleted((prev) => prev + 1)
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Work Timer</h1>
          <p className="text-muted-foreground">
            Stay focused and take healthy breaks throughout your workday.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Timer Area */}
          <div className="lg:col-span-2 space-y-6">
            <WorkTimer 
              onPointsEarned={handlePointsEarned}
              onBreakCompleted={handleBreakCompleted}
            />

            {/* Tabs for History and Settings */}
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history" className="gap-2">
                  <History className="h-4 w-4" />
                  Recent Activity
                </TabsTrigger>
                <TabsTrigger value="goals" className="gap-2">
                  <Target className="h-4 w-4" />
                  Daily Goals
                </TabsTrigger>
              </TabsList>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Breaks</CardTitle>
                    <CardDescription>
                      Your break activity from today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <div>
                              <p className="font-medium capitalize">
                                {activity.type} Break
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-primary">
                            +{activity.points} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="goals">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Daily Goals</CardTitle>
                    <CardDescription>
                      Track your progress towards daily wellness targets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Hydration Breaks</span>
                          <span className="text-sm text-muted-foreground">
                            {todayBreaks.hydration} / 6
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-chart-3 transition-all"
                            style={{ width: `${(todayBreaks.hydration / 6) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Breathing Exercises</span>
                          <span className="text-sm text-muted-foreground">
                            {todayBreaks.breathing} / 4
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-chart-1 transition-all"
                            style={{ width: `${(todayBreaks.breathing / 4) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Stretching Breaks</span>
                          <span className="text-sm text-muted-foreground">
                            {todayBreaks.stretching} / 4
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-chart-2 transition-all"
                            style={{ width: `${(todayBreaks.stretching / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <GamificationStats
              points={points}
              streak={streak}
              breaksCompleted={breaksCompleted}
              todayBreaks={todayBreaks}
            />

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Wellness Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Take a break every 25-30 minutes for optimal focus
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Drink 8 glasses of water throughout the day
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Deep breathing reduces stress and improves concentration
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Regular stretching prevents muscle tension and pain
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

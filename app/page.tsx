"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { WorkTimer } from "@/components/work-timer"
import { GamificationStats } from "@/components/gamification-stats"
import { VirtualPlant } from "@/components/virtual-plant"
import { Achievements } from "@/components/achievements"
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
  TrendingUp,
  Leaf,
  Activity,
  CalendarCheck
} from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()
  const [points, setPoints] = useState(0)
  const [streak] = useState(1)
  const [breaksCompleted, setBreaksCompleted] = useState(0)
  const [todayBreaks, setTodayBreaks] = useState({
    hydration: 0,
    breathing: 0,
    stretching: 0,
  })

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }, [])

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there"

  const handlePointsEarned = (earned: number) => {
    setPoints((prev) => prev + earned)
  }

  const handleBreakCompleted = (type?: "hydration" | "breathing" | "stretching") => {
    setBreaksCompleted((prev) => prev + 1)
    if (type) {
      setTodayBreaks((prev) => ({
        ...prev,
        [type]: prev[type] + 1,
      }))
    } else {
      const types = ["hydration", "breathing", "stretching"] as const
      const randomType = types[Math.floor(Math.random() * types.length)]
      setTodayBreaks((prev) => ({
        ...prev,
        [randomType]: prev[randomType] + 1,
      }))
    }
  }

  return (
    <div className="min-h-screen bg-background gradient-mesh overflow-x-hidden">
      <Navigation />
      
      <main className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Premium Hero Section */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative rounded-3xl overflow-hidden glass border border-primary/20 bg-gradient-to-br from-primary/10 via-background/40 to-accent/10 p-8 md:p-12 shadow-2xl">
            {/* Background glowing orbs for depth */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 rounded-full blur-[80px] animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-accent/20 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                <motion.div 
                  className="inline-flex items-center gap-2 text-primary mb-6 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md shadow-inner"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-semibold tracking-wide uppercase">Your Wellness Companion</span>
                </motion.div>
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 text-balance leading-tight drop-shadow-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {greeting}, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent filter drop-shadow hover:brightness-110 transition-all">{firstName}!</span>
                </motion.h1>
                <motion.p 
                  className="text-lg md:text-xl text-muted-foreground max-w-xl text-pretty mb-8 leading-relaxed font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Health Pilot helps you maintain healthy habits throughout your workday. Let's make today productive and balanced.
                </motion.p>
              </div>

              {/* Quick Summary Cards right in the hero area */}
              <div className="md:col-span-5 grid grid-cols-2 gap-4">
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="h-full">
                   <Card className="glass-card bg-background/40 backdrop-blur-md border border-white/10 hover:bg-background/60 transition-colors h-full">
                     <CardContent className="p-5 flex flex-col justify-center h-full gap-3">
                       <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                         <Timer className="h-5 w-5 text-primary" />
                       </div>
                       <div>
                         <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Focus Flow</p>
                         <p className="font-bold text-lg">Ready</p>
                       </div>
                     </CardContent>
                   </Card>
                 </motion.div>
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="h-full">
                   <Card className="glass-card bg-background/40 backdrop-blur-md border border-white/10 hover:bg-background/60 transition-colors h-full">
                     <CardContent className="p-5 flex flex-col justify-center h-full gap-3">
                       <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                         <Leaf className="h-5 w-5 text-accent-foreground" />
                       </div>
                       <div>
                         <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Plant Status</p>
                         <p className="font-bold text-lg">{points > 50 ? "Thriving" : "Growing"}</p>
                       </div>
                     </CardContent>
                   </Card>
                 </motion.div>
                 <motion.div className="col-span-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                   <Card className="glass-card bg-background/40 backdrop-blur-md border border-white/10 hover:bg-background/60 transition-colors relative overflow-hidden group">
                     {/* animated sheen */}
                     <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                     <CardContent className="p-5 flex items-center gap-4 relative z-10">
                       <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                         <Activity className="h-6 w-6 text-green-500" />
                       </div>
                       <div className="flex-1">
                         <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Daily Wellness Progress</p>
                         <div className="flex items-center gap-3">
                           <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden shadow-inner">
                             <motion.div 
                               className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" 
                               initial={{ width: 0 }}
                               animate={{ width: `${Math.min(100, (breaksCompleted / 5) * 100)}%` }}
                               transition={{ duration: 1, delay: 1 }}
                             />
                           </div>
                           <span className="font-bold text-sm text-foreground">{Math.min(100, Math.round((breaksCompleted / 5) * 100))}%</span>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Main Dashboard Layout */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column (Timer & Quick Actions) - 7 cols */}
          <motion.div 
            className="lg:col-span-7 flex flex-col gap-6 lg:gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, ease: "easeOut" }}
          >
            {/* Elegant Focus Timer Wrapper */}
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl bg-background/60 backdrop-blur-xl hover:shadow-2xl hover:border-white/20 transition-all duration-300">
              <div className="p-1 border-b border-white/5 bg-muted/20 backdrop-blur-md">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-sm" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">Focus Terminal</span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <WorkTimer 
                  onPointsEarned={handlePointsEarned}
                  onBreakCompleted={handleBreakCompleted}
                />
              </div>
            </div>

            {/* Quick Actions Matrix */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Link href="/symptoms" className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="h-full">
                  <Card className="h-full glass-card hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group border border-primary/10 bg-gradient-to-br from-background/50 to-primary/5">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <motion.div 
                            className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/20 shadow-inner"
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <Stethoscope className="h-8 w-8 text-primary drop-shadow-md" />
                          </motion.div>
                          <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-xl mb-1 text-foreground">Symptom Checker</h3>
                          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            AI-powered analysis to find the right specialist.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>

              <Link href="/clinics" className="block focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-2xl">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="h-full">
                  <Card className="h-full glass-card hover:shadow-xl hover:border-accent/30 transition-all cursor-pointer group border border-accent/10 bg-gradient-to-br from-background/50 to-accent/5">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <motion.div 
                            className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center shrink-0 border border-accent/20 shadow-inner"
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <MapPin className="h-8 w-8 text-accent-foreground drop-shadow-md" />
                          </motion.div>
                          <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors shadow-sm">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-xl mb-1 text-foreground">Find Clinics</h3>
                          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Locate top-rated healthcare nearby effortlessly.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </div>

            {/* Empty Space Filler - Daily Activity / Tips */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
               <Card className="glass-card border border-white/10 bg-background/40 backdrop-blur-md shadow-xl overflow-hidden mt-6 lg:mt-8">
                 <div className="p-1 border-b border-white/5 bg-accent/10 backdrop-blur-md">
                   <div className="flex items-center gap-2 px-4 py-2">
                     <CalendarCheck className="w-4 h-4 text-accent" />
                     <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">Activity Log</span>
                   </div>
                 </div>
                 <CardContent className="p-6">
                   <div className="space-y-4">
                     {[
                       { time: "09:00 AM", title: "Started Focus Session", type: "focus" },
                       { time: "10:30 AM", title: "Completed Hydration Break", type: "break" },
                       { time: "11:45 AM", title: "Earned Early Bird Badge", type: "achievement" },
                     ].map((item, i) => (
                       <div key={i} className="flex items-start gap-4">
                         <div className="mt-1">
                           <div className={`w-2 h-2 rounded-full ${
                             item.type === 'focus' ? 'bg-primary' : 
                             item.type === 'break' ? 'bg-accent' : 'bg-yellow-400'
                           } shadow-sm`} />
                         </div>
                         <div>
                           <p className="text-sm font-medium">{item.title}</p>
                           <p className="text-xs text-muted-foreground">{item.time}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>
            </motion.div>
          </motion.div>

          {/* Right Column (Plant & Stats) - 5 cols */}
          <motion.div 
            className="lg:col-span-5 flex flex-col gap-6 lg:gap-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, ease: "easeOut" }}
          >
            {/* The Plant Container */}
            <div className="glass-card rounded-2xl border border-white/10 p-1 shadow-xl relative overflow-hidden bg-gradient-to-b from-green-500/10 to-background/50 backdrop-blur-xl">
               <VirtualPlant 
                 points={points}
                 todayBreaks={todayBreaks}
               />
            </div>

            {/* Gamification Stats */}
            <div className="glass-card rounded-2xl border border-white/10 p-1 shadow-xl bg-background/50 backdrop-blur-md">
              <div className="p-4 md:p-6 pb-2">
                <GamificationStats
                  points={points}
                  streak={streak}
                  breaksCompleted={breaksCompleted}
                  todayBreaks={todayBreaks}
                />
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-card rounded-2xl border border-white/10 p-1 shadow-xl bg-background/50 backdrop-blur-md">
              <div className="p-4 md:p-6 pb-2">
                <Achievements
                  points={points}
                  streak={streak}
                  breaksCompleted={breaksCompleted}
                  todayBreaks={todayBreaks}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.section 
          className="mt-24 pt-20 border-t border-border/50 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-balance tracking-tight">
                Everything You Need for{" "}
                <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent filter drop-shadow hover:brightness-110 transition-all">
                  Workplace Wellness
                </span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                Our platform combines productivity tools with health features to help you stay balanced, focused, and healthy throughout your day.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Timer,
                title: "Smart Work Timer",
                description: "Focus sessions with automatic break reminders. Customize your work and break durations to fit your rhythm.",
                gradient: "from-primary/20 via-primary/10 to-transparent",
                iconColor: "text-primary",
                borderColor: "group-hover:border-primary/50"
              },
              {
                icon: Leaf,
                title: "Virtual Plant Garden",
                description: "Watch your digital companion grow as you complete wellness tasks. Building healthy habits has never been more fun.",
                gradient: "from-green-500/20 via-green-500/10 to-transparent",
                iconColor: "text-green-600 dark:text-green-400",
                borderColor: "group-hover:border-green-500/50"
              },
              {
                icon: TrendingUp,
                title: "Health Insights",
                description: "Track your wellness habits over time with detailed analytics. Easily find top healthcare specialists when needed.",
                gradient: "from-accent/30 via-accent/10 to-transparent",
                iconColor: "text-accent-foreground",
                borderColor: "group-hover:border-accent/50"
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="h-full"
              >
                <Card className={`glass-card h-full transition-all duration-300 group border border-white/5 hover:-translate-y-2 hover:shadow-2xl ${feature.borderColor}`}>
                  <CardHeader className="p-8">
                    <motion.div 
                      className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-inner border border-white/5`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <feature.icon className={`h-8 w-8 ${feature.iconColor} drop-shadow-md`} />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold mb-3">{feature.title}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground/90 font-medium leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-24 bg-background/80 backdrop-blur-xl relative z-10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container px-4 py-12 mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg border border-white/10">
                <Heart className="h-6 w-6 text-primary-foreground drop-shadow" />
              </div>
              <div>
                <span className="font-bold text-xl block tracking-tight">Health Pilot</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Health Companion</span>
              </div>
            </motion.div>
            <p className="text-sm text-center font-medium bg-clip-text text-transparent bg-gradient-to-r from-muted-foreground to-muted-foreground/70">
              Take care of your health.<br/>One micro-break at a time. 🌿
            </p>
            <div className="flex items-center md:justify-end gap-2">
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">About</Button>
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">Privacy</Button>
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">Help</Button>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground font-medium">
              © {new Date().getFullYear()} Health Pilot. Built with <span className="text-red-500 animate-pulse inline-block">❤️</span> for Hackathon 2k26.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold shadow-sm border border-primary/20">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

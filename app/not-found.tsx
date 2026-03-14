"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  ArrowLeft, 
  Leaf,
  HeartPulse
} from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating orbs */}
      <motion.div
        className="absolute top-32 left-16 w-64 h-64 rounded-full bg-primary/8 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-16 w-80 h-80 rounded-full bg-accent/8 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="text-center max-w-lg relative z-10">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
        >
          <div className="relative inline-block mb-8">
            <motion.span
              className="text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary/20 to-accent/20 select-none"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              404
            </motion.span>
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30">
                <HeartPulse className="h-10 w-10 text-white" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold mb-3 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Looks like this page took an unscheduled break. 
            Let&apos;s get you back on track!
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/">
            <Button className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 gap-2">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="h-12 px-6 rounded-xl border-border/50 gap-2"
            onClick={() => typeof window !== 'undefined' && window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </motion.div>

        {/* Branding */}
        <motion.div 
          className="mt-12 flex items-center justify-center gap-2 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Leaf className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium">WellnessNudge</span>
        </motion.div>
      </div>
    </div>
  )
}

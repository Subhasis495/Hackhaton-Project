"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { useState, useRef, useEffect } from "react"
import { 
  Timer, 
  Activity, 
  Stethoscope, 
  MapPin, 
  Trophy,
  Leaf,
  ChevronDown,
  User,
  HeartPulse,
  LogOut
} from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: Activity },
  { href: "/timer", label: "Focus Timer", icon: Timer },
  { href: "/burnout", label: "Burnout Check", icon: HeartPulse },
  { href: "/symptoms", label: "Symptom Triage", icon: Stethoscope },
  { href: "/clinics", label: "Find Clinics", icon: MapPin },
]

export function Navigation() {
  const pathname = usePathname()
  const { user, signOut, loading } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-border/50 rounded-none">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Leaf className="h-5 w-5 text-white" />
          </motion.div>
          <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
            Health Pilot
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-muted/30">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative"
              >
                <motion.div
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative z-10",
                    isActive 
                      ? "text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </motion.div>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg shadow-md"
                    layoutId="nav-pill"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile Section */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {user && !loading ? (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                className="flex items-center gap-2 px-3 py-2 rounded-full glass-card border border-primary/20 shadow-sm hover:border-primary/40 transition-all cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown className={cn(
                  "h-3 w-3 text-muted-foreground transition-transform duration-200",
                  showDropdown && "rotate-180"
                )} />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 rounded-xl glass-card border border-border/50 shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{displayName}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          signOut()
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive-foreground hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : !loading ? (
            <Link href="/auth">
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="h-4 w-4" />
                Sign In
              </motion.div>
            </Link>
          ) : null}
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-t border-border/50">
        <div className="flex justify-around py-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex-1"
              >
                <motion.div
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isActive ? "bg-primary/10" : "bg-transparent"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span>{item.label.split(' ')[0]}</span>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}


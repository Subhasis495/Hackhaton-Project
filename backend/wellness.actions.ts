"use server"

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function getUserStats() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("Unauthorized")
  }

  // Get total points and streak
  const { data: profile } = await supabase
    .from("profiles")
    .select("points, current_streak")
    .eq("id", user.id)
    .single()

  // Get today's completed breaks
  const today = new Date().toISOString().split('T')[0]
  const { data: dailyStats } = await supabase
    .from("daily_stats")
    .select("hydration_count, breathing_count, stretching_count")
    .eq("user_id", user.id)
    .eq("date", today)
    .single()

  // Get total breaks completed today
  const breaksCompleted = dailyStats 
    ? (dailyStats.hydration_count + dailyStats.breathing_count + dailyStats.stretching_count)
    : 0

  return {
    points: profile?.points || 0,
    streak: profile?.current_streak || 0,
    breaksCompleted,
    todayBreaks: {
      hydration: dailyStats?.hydration_count || 0,
      breathing: dailyStats?.breathing_count || 0,
      stretching: dailyStats?.stretching_count || 0,
    }
  }
}

export async function logBreak(type: "hydration" | "breathing" | "stretching", points: number, durationSeconds: number) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("Unauthorized")
  }

  try {
    // 1. Log the break event
    await supabase.from("break_logs").insert({
      user_id: user.id,
      break_type: type,
      points_earned: points,
      duration_seconds: durationSeconds
    })

    // 2. Update total points
    const { data: profile } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", user.id)
      .single()
      
    await supabase.from("profiles").update({
      points: (profile?.points || 0) + points
    }).eq("id", user.id)

    // 3. Update daily stats
    const today = new Date().toISOString().split('T')[0]
    const { data: dailyStats } = await supabase
      .from("daily_stats")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .single()

    const updateData: any = {}
    if (type === "hydration") updateData.hydration_count = (dailyStats?.hydration_count || 0) + 1
    if (type === "breathing") updateData.breathing_count = (dailyStats?.breathing_count || 0) + 1
    if (type === "stretching") updateData.stretching_count = (dailyStats?.stretching_count || 0) + 1

    if (dailyStats) {
      await supabase.from("daily_stats").update(updateData).eq("id", dailyStats.id)
    } else {
      await supabase.from("daily_stats").insert({
        user_id: user.id,
        date: today,
        ...updateData
      })
    }

    revalidatePath("/timer")
    return { success: true }
  } catch (error) {
    console.error("Failed to log break:", error)
    return { error: "Failed to log break" }
  }
}

export async function getRecentBreaks() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // Get breaks from the last 24 hours
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  
  const { data: breaks } = await supabase
    .from("break_logs")
    .select("break_type, points_earned, completed_at")
    .eq("user_id", user.id)
    .gte("completed_at", yesterday)
    .order("completed_at", { ascending: false })
    .limit(10)

  if (!breaks) return []

  // Transform date to relative time format string
  return breaks.map(log => {
      const diffMs = Date.now() - new Date(log.completed_at).getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHrs = Math.floor(diffMins / 60)
      
      let timeStr = "Just now"
      if (diffHrs > 0) timeStr = `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`
      else if (diffMins > 0) timeStr = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`

      return {
          type: log.break_type,
          time: timeStr,
          points: log.points_earned
      }
  })
}

export async function saveBurnoutAssessment(score: number) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase.from("burnout_assessments").insert({
    user_id: user.id,
    score: score
  })

  if (error) {
    console.error("Failed to save burnout assessment:", error)
    return { error: "Failed to save result" }
  }

  revalidatePath("/burnout")
  return { success: true }
}

export async function getBurnoutHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data: assessments } = await supabase
    .from("burnout_assessments")
    .select("score, assessment_date")
    .eq("user_id", user.id)
    .order("assessment_date", { ascending: true }) // Ascending for charting

  return assessments || []
}

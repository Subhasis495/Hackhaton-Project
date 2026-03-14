"use server"

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return {
    ...profile,
    email: user.email
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "Unauthorized" }
  }

  const fullName = formData.get("fullName") as string

  if (!fullName || fullName.trim() === "") {
    return { error: "Full name is required" }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName.trim() })
    .eq("id", user.id)

  if (error) {
    console.error("Failed to update profile:", error)
    return { error: "Failed to update profile" }
  }

  revalidatePath("/")
  return { success: true }
}

"use server"

import fs from "fs"
import path from "path"
import Papa from "papaparse"

export interface Clinic {
  id: string
  name: string
  specialty: string[]
  address: string
  distance: number
  rating: number
  reviewCount: number
  priceRange: "low" | "medium" | "high"
  acceptsWalkIn: boolean
  hours: string
  phone: string
  waitTime?: string
  lat: number
  lng: number
  consultationFee: number
}

// Distance calculator using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const d = R * c; 
  return Number(d.toFixed(1));
}

// Top level cache
let cachedHospitals: any[] | null = null;
let lastCacheTime = 0;

export async function getNearbyGovHospitals(userLat: number, userLng: number, radiusKm: number = 50): Promise<Clinic[]> {
  try {
    let allHospitals = cachedHospitals;
    const now = Date.now();
    
    // Cache for 1 hour to avoid re-reading 10MB constantly
    if (!allHospitals || (now - lastCacheTime > 3600000)) {
        const filePath = path.join(process.cwd(), "backend", "hospital_directory (1).csv")
        
        if (!fs.existsSync(filePath)) {
          console.error("CSV file not found:", filePath);
          return [];
        }
        
        const fileContent = fs.readFileSync(filePath, "utf8")
        
        const parsed = Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
        })
        
        allHospitals = parsed.data as any[]
        cachedHospitals = allHospitals;
        lastCacheTime = now;
    }
    
    const nearby: Clinic[] = []
    
    for (const row of allHospitals) {
      if (!row.Location_Coordinates) continue
      
      const coords = row.Location_Coordinates.split(",")
      if (coords.length !== 2) continue
      
      const lat = parseFloat(coords[0].trim())
      const lng = parseFloat(coords[1].trim())
      
      if (isNaN(lat) || isNaN(lng)) continue

      const distance = calculateDistance(userLat, userLng, lat, lng)
      
      if (distance <= radiusKm) {
        const hash = Math.abs(parseInt(row.Sr_No || "0") % 3) || 0
        const fees = [50, 100, 250] // Govt hospitals are cheaper
        
        let specialties = ["General Patient Care"]
        if (row.Specialties && row.Specialties !== "0") {
            specialties = row.Specialties.split(",").map((s: string) => s.trim()).filter(Boolean)
            if (specialties.length === 0) specialties = ["General Patient Care"];
        }

        nearby.push({
          id: row.Sr_No || Math.random().toString(),
          name: row.Hospital_Name || "Govt Hospital",
          specialty: specialties,
          address: row.Address_Original_First_Line || row.Location || "Address unavailable",
          distance: distance,
          rating: Number((3.5 + Math.random() * 1.5).toFixed(1)), // Simulate ratings 3.5-5.0
          reviewCount: Math.floor(Math.random() * 200) + 10,
          priceRange: "low",
          acceptsWalkIn: true, 
          hours: "24/7",
          phone: row.Telephone && row.Telephone !== "0" && row.Telephone.length > 5 ? row.Telephone : "Not Available",
          waitTime: `${15 + Math.floor(Math.random() * 45)} min`,
          lat: lat,
          lng: lng,
          consultationFee: fees[hash], 
        })
      }
    }
    
    // Sort by distance and limit to top 100 to avoid UI lagging
    return nearby.sort((a, b) => a.distance - b.distance).slice(0, 100)
    
  } catch (error) {
    console.error("Error parsing hospital CSV:", error)
    return []
  }
}

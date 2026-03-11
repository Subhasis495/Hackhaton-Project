"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  DollarSign,
  Star,
  Navigation,
  Filter,
  Building2,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Clinic {
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
}

const mockClinics: Clinic[] = [
  {
    id: "1",
    name: "Community Health Center",
    specialty: ["General Practitioner", "Family Medicine", "Pediatrics"],
    address: "123 Main Street, Suite 100",
    distance: 0.5,
    rating: 4.5,
    reviewCount: 128,
    priceRange: "low",
    acceptsWalkIn: true,
    hours: "8:00 AM - 6:00 PM",
    phone: "(555) 123-4567",
    waitTime: "15 min",
  },
  {
    id: "2",
    name: "Metro Medical Associates",
    specialty: ["General Practitioner", "Internal Medicine", "Dermatologist"],
    address: "456 Oak Avenue, Building B",
    distance: 1.2,
    rating: 4.8,
    reviewCount: 256,
    priceRange: "medium",
    acceptsWalkIn: false,
    hours: "9:00 AM - 5:00 PM",
    phone: "(555) 234-5678",
    waitTime: "30 min",
  },
  {
    id: "3",
    name: "Urgent Care Plus",
    specialty: ["Emergency Room", "General Practitioner", "Urgent Care"],
    address: "789 Emergency Lane",
    distance: 0.8,
    rating: 4.2,
    reviewCount: 89,
    priceRange: "medium",
    acceptsWalkIn: true,
    hours: "24/7",
    phone: "(555) 345-6789",
    waitTime: "45 min",
  },
  {
    id: "4",
    name: "Wellness Family Clinic",
    specialty: ["General Practitioner", "Pediatrics", "Psychiatrist"],
    address: "321 Wellness Way",
    distance: 2.1,
    rating: 4.6,
    reviewCount: 167,
    priceRange: "low",
    acceptsWalkIn: true,
    hours: "7:00 AM - 7:00 PM",
    phone: "(555) 456-7890",
  },
  {
    id: "5",
    name: "Specialty Care Center",
    specialty: ["Cardiologist", "Neurologist", "Pulmonologist"],
    address: "555 Medical Plaza, Floor 3",
    distance: 3.4,
    rating: 4.9,
    reviewCount: 312,
    priceRange: "high",
    acceptsWalkIn: false,
    hours: "8:30 AM - 4:30 PM",
    phone: "(555) 567-8901",
  },
  {
    id: "6",
    name: "Downtown ENT Clinic",
    specialty: ["ENT Specialist", "Allergist", "Sleep Specialist"],
    address: "888 Downtown Drive",
    distance: 1.5,
    rating: 4.4,
    reviewCount: 98,
    priceRange: "medium",
    acceptsWalkIn: false,
    hours: "9:00 AM - 6:00 PM",
    phone: "(555) 678-9012",
  },
  {
    id: "7",
    name: "Physical Therapy & Rehab",
    specialty: ["Physical Therapist", "Sports Medicine", "Orthopedist"],
    address: "777 Recovery Road",
    distance: 2.8,
    rating: 4.7,
    reviewCount: 203,
    priceRange: "medium",
    acceptsWalkIn: false,
    hours: "7:00 AM - 8:00 PM",
    phone: "(555) 789-0123",
  },
  {
    id: "8",
    name: "Eye Care Associates",
    specialty: ["Ophthalmologist", "Optometrist"],
    address: "222 Vision Lane",
    distance: 1.9,
    rating: 4.5,
    reviewCount: 145,
    priceRange: "medium",
    acceptsWalkIn: true,
    hours: "9:00 AM - 5:30 PM",
    phone: "(555) 890-1234",
    waitTime: "20 min",
  },
]

interface ClinicFinderProps {
  initialSpecialist?: string
}

export function ClinicFinder({ initialSpecialist }: ClinicFinderProps) {
  const [searchTerm, setSearchTerm] = useState(initialSpecialist || "")
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "price">("distance")
  const [filterWalkIn, setFilterWalkIn] = useState(false)
  const [filterPriceRange, setFilterPriceRange] = useState<"all" | "low" | "medium" | "high">("all")

  useEffect(() => {
    if (initialSpecialist) {
      setSearchTerm(initialSpecialist)
    }
  }, [initialSpecialist])

  const filteredClinics = mockClinics
    .filter((clinic) => {
      const matchesSearch =
        !searchTerm ||
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.specialty.some((s) =>
          s.toLowerCase().includes(searchTerm.toLowerCase())
        )
      const matchesWalkIn = !filterWalkIn || clinic.acceptsWalkIn
      const matchesPrice =
        filterPriceRange === "all" || clinic.priceRange === filterPriceRange
      return matchesSearch && matchesWalkIn && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance
        case "rating":
          return b.rating - a.rating
        case "price":
          const priceOrder = { low: 0, medium: 1, high: 2 }
          return priceOrder[a.priceRange] - priceOrder[b.priceRange]
        default:
          return 0
      }
    })

  const getPriceDisplay = (range: "low" | "medium" | "high") => {
    switch (range) {
      case "low":
        return { label: "Affordable", icon: "$", color: "text-chart-2" }
      case "medium":
        return { label: "Moderate", icon: "$$", color: "text-chart-4" }
      case "high":
        return { label: "Premium", icon: "$$$", color: "text-chart-5" }
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Find Clinics Near You
          </CardTitle>
          <CardDescription>
            Search for affordable clinics and medical specialists in your area
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by specialty or clinic name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("distance")}>
                  Distance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rating")}>
                  Rating
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price")}>
                  Price
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={filterWalkIn ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterWalkIn(!filterWalkIn)}
              className="gap-2"
            >
              Walk-in
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price: {filterPriceRange === "all" ? "All" : filterPriceRange}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterPriceRange("all")}>
                  All Prices
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriceRange("low")}>
                  $ Affordable
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriceRange("medium")}>
                  $$ Moderate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriceRange("high")}>
                  $$$ Premium
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground">
            {filteredClinics.length} clinics found
          </p>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Interactive map would display here
              </p>
              <Button variant="outline" size="sm" className="mt-2 gap-2">
                <Navigation className="h-4 w-4" />
                Use my location
              </Button>
            </div>
          </div>
          {/* Map pins simulation */}
          <div className="absolute top-8 left-1/4">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              1
            </div>
          </div>
          <div className="absolute top-16 right-1/3">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              2
            </div>
          </div>
          <div className="absolute bottom-12 left-1/2">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              3
            </div>
          </div>
        </div>
      </Card>

      {/* Clinic List */}
      <div className="space-y-4">
        {filteredClinics.map((clinic, idx) => {
          const price = getPriceDisplay(clinic.priceRange)
          return (
            <Card key={clinic.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  {/* Number indicator */}
                  <div className="w-12 bg-primary/5 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-primary">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{clinic.name}</h3>
                          {clinic.acceptsWalkIn && (
                            <Badge variant="secondary" className="text-xs">
                              Walk-in
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-1">
                          {clinic.specialty.slice(0, 3).map((spec) => (
                            <Badge
                              key={spec}
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {spec}
                            </Badge>
                          ))}
                          {clinic.specialty.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              +{clinic.specialty.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {clinic.distance} mi
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-chart-4 text-chart-4" />
                            {clinic.rating} ({clinic.reviewCount})
                          </span>
                          <span className={cn("font-medium", price.color)}>
                            {price.icon}
                          </span>
                          {clinic.waitTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {clinic.waitTime}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 shrink-0" />
                          {clinic.address}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <Button size="sm" className="gap-2">
                          <Navigation className="h-4 w-4" />
                          Directions
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Phone className="h-4 w-4" />
                          Call
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {clinic.hours}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {clinic.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredClinics.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg">No clinics found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { ClinicFinder } from "@/components/clinic-finder"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MapPin,
  Phone,
  Clock,
  DollarSign
} from "lucide-react"

function ClinicFinderWithParams() {
  const searchParams = useSearchParams()
  const specialist = searchParams.get("specialist") || ""
  
  return <ClinicFinder initialSpecialist={specialist} />
}

export default function ClinicsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Find Clinics & Specialists
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover affordable healthcare options near you. Filter by specialty, price range, and walk-in availability.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Clinic Finder */}
          <div className="lg:col-span-2">
            <Suspense fallback={
              <Card>
                <CardContent className="py-12 text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-4 animate-pulse" />
                  <p className="text-muted-foreground">Loading clinics...</p>
                </CardContent>
              </Card>
            }>
              <ClinicFinderWithParams />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Finding Affordable Care</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Community Health Centers</p>
                      <p className="text-muted-foreground">
                        Often offer sliding-scale fees based on income
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Walk-in Clinics</p>
                      <p className="text-muted-foreground">
                        No appointment needed, great for minor issues
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Call Ahead</p>
                      <p className="text-muted-foreground">
                        Ask about self-pay rates and payment plans
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Price Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Price Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="font-medium text-chart-2">$ Affordable</span>
                    <span className="text-muted-foreground">Under $75</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="font-medium text-chart-4">$$ Moderate</span>
                    <span className="text-muted-foreground">$75 - $150</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium text-chart-5">$$$ Premium</span>
                    <span className="text-muted-foreground">$150+</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Prices are estimates and may vary. Contact clinics directly for accurate pricing.
                </p>
              </CardContent>
            </Card>

            {/* Need Immediate Help */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Need Immediate Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-semibold">Emergency: 911</p>
                      <p className="text-muted-foreground text-xs">
                        For life-threatening emergencies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Health Line: 811</p>
                      <p className="text-muted-foreground text-xs">
                        Free health advice 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

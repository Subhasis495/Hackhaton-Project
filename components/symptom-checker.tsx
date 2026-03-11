"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  X, 
  Stethoscope,
  AlertCircle,
  ChevronRight,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const commonSymptoms = [
  "Headache",
  "Fatigue",
  "Cough",
  "Fever",
  "Sore Throat",
  "Back Pain",
  "Nausea",
  "Dizziness",
  "Chest Pain",
  "Shortness of Breath",
  "Joint Pain",
  "Skin Rash",
  "Eye Pain",
  "Ear Pain",
  "Stomach Pain",
  "Anxiety",
  "Insomnia",
  "Muscle Ache",
]

interface SpecialistRecommendation {
  specialist: string
  relevance: "high" | "medium" | "low"
  description: string
  urgency?: "emergency" | "urgent" | "routine"
}

const symptomToSpecialist: Record<string, SpecialistRecommendation[]> = {
  "Headache": [
    { specialist: "General Practitioner", relevance: "high", description: "For initial assessment and common headaches", urgency: "routine" },
    { specialist: "Neurologist", relevance: "medium", description: "For recurring or severe headaches", urgency: "routine" },
  ],
  "Fatigue": [
    { specialist: "General Practitioner", relevance: "high", description: "For initial blood work and assessment", urgency: "routine" },
    { specialist: "Endocrinologist", relevance: "medium", description: "If thyroid or hormonal issues suspected", urgency: "routine" },
  ],
  "Cough": [
    { specialist: "General Practitioner", relevance: "high", description: "For common respiratory infections", urgency: "routine" },
    { specialist: "Pulmonologist", relevance: "medium", description: "For persistent or chronic cough", urgency: "routine" },
  ],
  "Fever": [
    { specialist: "General Practitioner", relevance: "high", description: "For initial assessment", urgency: "routine" },
    { specialist: "Infectious Disease Specialist", relevance: "low", description: "For persistent or unexplained fever", urgency: "routine" },
  ],
  "Chest Pain": [
    { specialist: "Emergency Room", relevance: "high", description: "If severe or with shortness of breath", urgency: "emergency" },
    { specialist: "Cardiologist", relevance: "high", description: "For heart-related concerns", urgency: "urgent" },
  ],
  "Shortness of Breath": [
    { specialist: "Emergency Room", relevance: "high", description: "If sudden or severe", urgency: "emergency" },
    { specialist: "Pulmonologist", relevance: "high", description: "For respiratory assessment", urgency: "urgent" },
  ],
  "Back Pain": [
    { specialist: "General Practitioner", relevance: "high", description: "For initial assessment", urgency: "routine" },
    { specialist: "Orthopedist", relevance: "medium", description: "For structural issues", urgency: "routine" },
    { specialist: "Physical Therapist", relevance: "medium", description: "For rehabilitation", urgency: "routine" },
  ],
  "Joint Pain": [
    { specialist: "Rheumatologist", relevance: "high", description: "For inflammatory conditions", urgency: "routine" },
    { specialist: "Orthopedist", relevance: "high", description: "For structural issues", urgency: "routine" },
  ],
  "Skin Rash": [
    { specialist: "Dermatologist", relevance: "high", description: "For skin conditions", urgency: "routine" },
    { specialist: "Allergist", relevance: "medium", description: "If allergic reaction suspected", urgency: "routine" },
  ],
  "Eye Pain": [
    { specialist: "Ophthalmologist", relevance: "high", description: "For eye conditions", urgency: "urgent" },
    { specialist: "Optometrist", relevance: "medium", description: "For vision-related issues", urgency: "routine" },
  ],
  "Ear Pain": [
    { specialist: "ENT Specialist", relevance: "high", description: "For ear, nose, and throat issues", urgency: "routine" },
    { specialist: "General Practitioner", relevance: "high", description: "For common ear infections", urgency: "routine" },
  ],
  "Anxiety": [
    { specialist: "Psychiatrist", relevance: "high", description: "For mental health assessment", urgency: "routine" },
    { specialist: "Psychologist", relevance: "high", description: "For therapy and counseling", urgency: "routine" },
  ],
  "Insomnia": [
    { specialist: "Sleep Specialist", relevance: "high", description: "For sleep disorders", urgency: "routine" },
    { specialist: "Psychiatrist", relevance: "medium", description: "If related to mental health", urgency: "routine" },
  ],
  "Sore Throat": [
    { specialist: "General Practitioner", relevance: "high", description: "For common infections", urgency: "routine" },
    { specialist: "ENT Specialist", relevance: "medium", description: "For recurring issues", urgency: "routine" },
  ],
  "Nausea": [
    { specialist: "General Practitioner", relevance: "high", description: "For initial assessment", urgency: "routine" },
    { specialist: "Gastroenterologist", relevance: "medium", description: "For digestive issues", urgency: "routine" },
  ],
  "Dizziness": [
    { specialist: "General Practitioner", relevance: "high", description: "For initial assessment", urgency: "routine" },
    { specialist: "ENT Specialist", relevance: "medium", description: "For balance disorders", urgency: "routine" },
    { specialist: "Neurologist", relevance: "medium", description: "For neurological causes", urgency: "routine" },
  ],
  "Stomach Pain": [
    { specialist: "General Practitioner", relevance: "high", description: "For initial assessment", urgency: "routine" },
    { specialist: "Gastroenterologist", relevance: "high", description: "For digestive issues", urgency: "routine" },
  ],
  "Muscle Ache": [
    { specialist: "General Practitioner", relevance: "high", description: "For initial assessment", urgency: "routine" },
    { specialist: "Physical Therapist", relevance: "high", description: "For rehabilitation", urgency: "routine" },
    { specialist: "Sports Medicine", relevance: "medium", description: "For sports-related injuries", urgency: "routine" },
  ],
}

export function SymptomChecker() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const filteredSymptoms = commonSymptoms.filter(
    (symptom) =>
      symptom.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedSymptoms.includes(symptom)
  )

  const addSymptom = (symptom: string) => {
    setSelectedSymptoms([...selectedSymptoms, symptom])
    setSearchTerm("")
  }

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
    setShowResults(false)
  }

  const getRecommendations = (): SpecialistRecommendation[] => {
    const allRecommendations: SpecialistRecommendation[] = []
    const seenSpecialists = new Set<string>()

    // Check for emergency symptoms first
    const hasEmergency = selectedSymptoms.some(
      (symptom) =>
        symptomToSpecialist[symptom]?.some((rec) => rec.urgency === "emergency")
    )

    selectedSymptoms.forEach((symptom) => {
      const recommendations = symptomToSpecialist[symptom] || []
      recommendations.forEach((rec) => {
        if (!seenSpecialists.has(rec.specialist)) {
          seenSpecialists.add(rec.specialist)
          allRecommendations.push(rec)
        }
      })
    })

    // Sort by urgency and relevance
    return allRecommendations.sort((a, b) => {
      const urgencyOrder = { emergency: 0, urgent: 1, routine: 2 }
      const relevanceOrder = { high: 0, medium: 1, low: 2 }
      
      if (urgencyOrder[a.urgency || "routine"] !== urgencyOrder[b.urgency || "routine"]) {
        return urgencyOrder[a.urgency || "routine"] - urgencyOrder[b.urgency || "routine"]
      }
      return relevanceOrder[a.relevance] - relevanceOrder[b.relevance]
    })
  }

  const recommendations = showResults ? getRecommendations() : []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Symptom Checker
          </CardTitle>
          <CardDescription>
            Select your symptoms to find recommended specialists
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Symptoms */}
          {selectedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <Badge
                  key={symptom}
                  variant="secondary"
                  className="pl-3 pr-1 py-1.5 text-sm"
                >
                  {symptom}
                  <button
                    onClick={() => removeSymptom(symptom)}
                    className="ml-2 p-0.5 rounded-full hover:bg-foreground/10"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {symptom}</span>
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Symptom Suggestions */}
          {searchTerm && filteredSymptoms.length > 0 && (
            <div className="border rounded-lg divide-y">
              {filteredSymptoms.slice(0, 5).map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => addSymptom(symptom)}
                  className="w-full px-4 py-3 text-left hover:bg-muted transition-colors"
                >
                  {symptom}
                </button>
              ))}
            </div>
          )}

          {/* Common Symptoms Grid */}
          {!searchTerm && selectedSymptoms.length === 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-3">Common symptoms:</p>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.slice(0, 12).map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => addSymptom(symptom)}
                    className="px-3 py-1.5 text-sm rounded-full border hover:bg-muted transition-colors"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Find Specialists Button */}
          {selectedSymptoms.length > 0 && (
            <Button
              onClick={() => setShowResults(true)}
              className="w-full"
              size="lg"
            >
              Find Recommended Specialists
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Specialists</CardTitle>
            <CardDescription>
              Based on your symptoms: {selectedSymptoms.join(", ")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Emergency Warning */}
            {recommendations.some((r) => r.urgency === "emergency") && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Seek Immediate Care</p>
                  <p className="text-sm text-muted-foreground">
                    Based on your symptoms, you should consider seeking emergency medical attention.
                  </p>
                </div>
              </div>
            )}

            {/* Specialist List */}
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div
                  key={`${rec.specialist}-${idx}`}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border",
                    rec.urgency === "emergency" && "border-destructive bg-destructive/5",
                    rec.urgency === "urgent" && "border-chart-5 bg-chart-5/5"
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                      rec.relevance === "high" && "bg-primary/10",
                      rec.relevance === "medium" && "bg-accent/20",
                      rec.relevance === "low" && "bg-muted"
                    )}
                  >
                    <Stethoscope
                      className={cn(
                        "h-5 w-5",
                        rec.relevance === "high" && "text-primary",
                        rec.relevance === "medium" && "text-accent-foreground",
                        rec.relevance === "low" && "text-muted-foreground"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold">{rec.specialist}</h4>
                      {rec.urgency === "emergency" && (
                        <Badge variant="destructive" className="text-xs">Emergency</Badge>
                      )}
                      {rec.urgency === "urgent" && (
                        <Badge className="text-xs bg-chart-5 text-foreground">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rec.description}
                    </p>
                  </div>
                  <Link 
                    href={`/clinics?specialist=${encodeURIComponent(rec.specialist)}`}
                    className="shrink-0"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <MapPin className="h-4 w-4" />
                      Find
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center pt-4 border-t">
              This is not medical advice. Please consult with a healthcare professional for proper diagnosis and treatment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

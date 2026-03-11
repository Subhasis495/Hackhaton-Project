import { Navigation } from "@/components/navigation"
import { SymptomChecker } from "@/components/symptom-checker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Shield,
  AlertTriangle,
  Info
} from "lucide-react"

export default function SymptomsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Symptom Checker
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Select your symptoms to receive recommendations for appropriate medical specialists. This tool helps guide you to the right healthcare provider.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Symptom Checker */}
          <div className="lg:col-span-2">
            <SymptomChecker />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Important Notice */}
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Warning Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Seek immediate medical attention if you experience:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    Severe chest pain or pressure
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    Difficulty breathing or shortness of breath
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    Sudden confusion or trouble speaking
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    Sudden severe headache
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    Loss of consciousness
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-medium text-xs">
                      1
                    </span>
                    <div>
                      <p className="font-medium">Select Symptoms</p>
                      <p className="text-muted-foreground">
                        Search or browse common symptoms
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-medium text-xs">
                      2
                    </span>
                    <div>
                      <p className="font-medium">Get Recommendations</p>
                      <p className="text-muted-foreground">
                        See which specialists can help
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-medium text-xs">
                      3
                    </span>
                    <div>
                      <p className="font-medium">Find Care</p>
                      <p className="text-muted-foreground">
                        Locate clinics and specialists nearby
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* Privacy Note */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Your Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your symptom information is processed locally and is not stored or shared. This tool is designed to help guide you to appropriate care while respecting your privacy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

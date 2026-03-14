"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { saveBurnoutAssessment, getBurnoutHistory } from "@/backend/wellness.actions"
import { 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"

// Burnout assessment questions (adapted from standard burnout inventories)
const questions = [
  "I feel emotionally drained from my work.",
  "I feel used up at the end of the workday.",
  "I feel fatigued when I get up in the morning and have to face another day on the job.",
  "Working with people all day is really a strain for me.",
  "I feel I treat some people as if they were impersonal objects.",
  "I feel burned out from my work.",
  "I feel I'm working too hard on my job.",
  "I feel frustrated by my job.",
  "I feel I'm at the end of my rope.",
]

const options = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Always" },
]

export default function BurnoutPage() {
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [score, setScore] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  useEffect(() => {
    async function loadHistory() {
      if (user) {
        const data = await getBurnoutHistory()
        setHistory(data)
      }
      setIsLoadingHistory(false)
    }
    loadHistory()
  }, [user])

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300)
    } else {
      calculateAndSaveScore(newAnswers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculateAndSaveScore = async (finalAnswers: number[]) => {
    const totalScore = finalAnswers.reduce((sum, val) => sum + (val >= 0 ? val : 0), 0)
    const maxPossibleScore = questions.length * 4
    const normalizedScore = Math.round((totalScore / maxPossibleScore) * 100)
    
    setScore(normalizedScore)
    setIsCompleted(true)
    
    if (user) {
      setIsSaving(true)
      await saveBurnoutAssessment(normalizedScore)
      const data = await getBurnoutHistory()
      setHistory(data)
      setIsSaving(false)
    }
  }

  const resetAssessment = () => {
    setAnswers(new Array(questions.length).fill(-1))
    setCurrentQuestion(0)
    setIsCompleted(false)
    setScore(0)
  }

  const getResultDetails = () => {
    if (score < 25) {
      return {
        title: "Low Risk",
        color: "text-green-500",
        bg: "bg-green-500/10",
        icon: CheckCircle,
        message: "You seem to be managing your work-life balance well. Keep up the good habits, continue taking breaks, and prioritize your well-being.",
        recommendations: [
          "Maintain your current wellness routine.",
          "Continue taking regular micro-breaks.",
          "Keep setting clear boundaries between work and personal time."
        ]
      }
    } else if (score < 55) {
      return {
        title: "Moderate Risk",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        icon: AlertTriangle,
        message: "You are showing some signs of early burnout or stress. It's time to pay a bit more attention to your wellness before it escalates.",
        recommendations: [
          "Use the Work Timer more strictly to enforce breaks.",
          "Try adding a 5-minute breathing exercise to your daily routine.",
          "Disconnect completely from tech 1 hour before bed."
        ]
      }
    } else {
      return {
        title: "High Risk",
        color: "text-red-500",
        bg: "bg-red-500/10",
        icon: AlertTriangle,
        message: "You are experiencing significant signs of burnout. Please take these symptoms seriously.",
        recommendations: [
          "Strongly consider speaking with a healthcare professional or counselor.",
          "Review your workload with your manager if possible.",
          "Take time off to rest and disconnect completely."
        ]
      }
    }
  }

  const result = isCompleted ? getResultDetails() : null
  const ResultIcon = result?.icon || HeartPulse

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      <Navigation />
      
      <main className="container max-w-4xl px-4 py-8 mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div 
              className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <HeartPulse className="h-6 w-6 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Burnout Check
              </h1>
              <p className="text-muted-foreground">
                Assess your stress levels and get personalized recommendations
              </p>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <Card className="glass-card border-blue-500/20 bg-blue-500/5 dark:bg-blue-900/10">
          <CardContent className="flex gap-3 py-4">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>About This Assessment:</strong> This is a self-assessment tool to help identify potential burnout risks. It is not a medical diagnosis. If you're experiencing severe symptoms, please consult a healthcare professional.
            </p>
          </CardContent>
        </Card>

        {!isCompleted ? (
          // Assessment UI
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(((currentQuestion) / questions.length) * 100)}% Complete
                  </span>
                </div>
                <Progress value={((currentQuestion) / questions.length) * 100} className="h-2" />
              </CardHeader>
              
              <CardContent className="py-8 min-h-[200px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-2xl font-medium text-center mb-8 px-4 text-balance">
                      {questions[currentQuestion]}
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {options.map((option) => (
                        <Button
                          key={option.value}
                          variant={answers[currentQuestion] === option.value ? "default" : "outline"}
                          className={cn(
                            "flex-1 py-6",
                            answers[currentQuestion] === option.value 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-primary/10"
                          )}
                          onClick={() => handleAnswer(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>

              <CardFooter className="justify-between border-t border-border/50 pt-6">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </Button>
                {answers[currentQuestion] !== -1 && currentQuestion === questions.length - 1 && (
                   <Button onClick={() => calculateAndSaveScore(answers)} className="gap-2">
                     See Results <ArrowRight className="h-4 w-4" />
                   </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          // Results UI
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="grid md:grid-cols-2 gap-6"
          >
            <Card className="glass-card overflow-hidden">
              <div className={cn("h-3 w-full", result?.bg, "border-b border-border/50")} />
              <CardHeader className="text-center pt-8">
                <div className={cn("mx-auto mb-4 h-20 w-20 rounded-full flex items-center justify-center", result?.bg)}>
                  <ResultIcon className={cn("h-10 w-10", result?.color)} />
                </div>
                <CardTitle className="text-4xl font-bold">{score}%</CardTitle>
                <CardDescription className={cn("text-lg font-medium", result?.color)}>
                  {result?.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-muted-foreground">
                  {result?.message}
                </p>
                
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Recommendations</h4>
                  <ul className="space-y-2">
                    {result?.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3 justify-center pb-8 border-t border-border/50 pt-6">
                <Button onClick={resetAssessment} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Take Again
                </Button>
                {score >= 55 && (
                  <Button asChild>
                    <a href="/symptoms">Check Symptoms</a>
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* History Card */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Your History</CardTitle>
                <CardDescription>Keep track of your stress levels over time</CardDescription>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Sign in to save your assessment history.</p>
                    <Button asChild variant="outline">
                      <a href="/auth">Sign In</a>
                    </Button>
                  </div>
                ) : isLoadingHistory ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">This is your first assessment! Great job taking the first step.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative h-48 w-full border-b border-l border-border/50 p-2">
                       {/* Simple CSS Chart representing History */}
                       <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-between px-2 gap-2">
                         {history.slice(-10).map((item, i) => (
                            <div key={i} className="relative flex-1 group flex flex-col justify-end h-full">
                              <div 
                                className={cn(
                                  "w-full rounded-t-sm transition-all duration-500",
                                  item.score < 25 ? "bg-green-500" : item.score < 55 ? "bg-amber-500" : "bg-red-500"
                                )}
                                style={{ height: `${Math.max(item.score, 5)}%` }}
                              />
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs p-1 rounded whitespace-nowrap z-10">
                                {item.score}% - {new Date(item.assessment_date).toLocaleDateString()}
                              </div>
                            </div>
                         ))}
                       </div>
                    </div>
                    <div className="space-y-2 mt-4 max-h-[200px] overflow-y-auto pr-2">
                      {[...history].reverse().map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border/50 text-sm">
                          <span className="text-muted-foreground">
                            {new Date(item.assessment_date).toLocaleDateString()}
                          </span>
                          <span className={cn(
                            "font-bold",
                            item.score < 25 ? "text-green-500" : item.score < 55 ? "text-amber-500" : "text-red-500"
                          )}>
                            {item.score}% Score
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}

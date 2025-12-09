'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AssessmentResults from './AssessmentResults'

interface QuestionModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Question {
  id: number
  question: string
  type: 'text' | 'number' | 'email' | 'select' | 'yesno'
  section?: string
  options?: string[]
  placeholder?: string
  min?: number
  max?: number
}

const questions: Question[] = [
  // Section 1: Personal Profile
  {
    id: 1,
    question: 'What is your name?',
    type: 'text',
    section: 'Personal Profile',
    placeholder: 'Enter your name',
  },
  {
    id: 2,
    question: 'What is your gender?',
    type: 'select',
    section: 'Personal Profile',
    options: ['Male', 'Female', 'Other', 'Prefer not to say'],
  },
  {
    id: 3,
    question: 'What is your age?',
    type: 'number',
    section: 'Personal Profile',
    placeholder: 'Enter your age',
    min: 1,
    max: 120,
  },
  // Section 2: Sleep Quality
  {
    id: 4,
    question: 'How many hours of sleep do you average per night?',
    type: 'number',
    section: 'Sleep Quality',
    placeholder: 'e.g., 7.5',
    min: 0,
    max: 24,
  },
  {
    id: 5,
    question: 'Do you wake up feeling rested?',
    type: 'yesno',
    section: 'Sleep Quality',
  },
  // Section 3: Nutrition & Intake
  {
    id: 6,
    question: 'How many meals do you eat per day?',
    type: 'number',
    section: 'Nutrition & Intake',
    placeholder: 'e.g., 3',
    min: 1,
    max: 10,
  },
  {
    id: 7,
    question: 'How many days per week do you consume sweets?',
    type: 'number',
    section: 'Nutrition & Intake',
    placeholder: '0-7',
    min: 0,
    max: 7,
  },
  {
    id: 8,
    question: 'How many days per week do you fast (intermittent or extended)?',
    type: 'number',
    section: 'Nutrition & Intake',
    placeholder: '0-7',
    min: 0,
    max: 7,
  },
  // Section 4: Activity & Movement
  {
    id: 9,
    question: 'What is your overall activity level?',
    type: 'select',
    section: 'Activity & Movement',
    options: ['Low', 'Moderate', 'High'],
  },
  {
    id: 10,
    question: 'How many cardio sessions do you do per week?',
    type: 'number',
    section: 'Activity & Movement',
    placeholder: 'e.g., 3',
    min: 0,
    max: 14,
  },
  // Section 5: Receive Your Assessment
  {
    id: 11,
    question: 'What is your email address?',
    type: 'email',
    section: 'Receive Your Assessment',
    placeholder: 'your.email@example.com',
  },
]

export default function QuestionModal({ isOpen, onClose }: QuestionModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const currentQuestion = questions[currentStep]
  const isLastStep = currentStep === questions.length - 1
  const progress = ((currentStep + 1) / questions.length) * 100
  const showResults = analysis !== null
  
  // Get current section name
  const currentSection = currentQuestion.section || ''

  const isValidAnswer = (): boolean => {
    const answer = answers[currentQuestion.id]
    if (!answer) return false
    
    // Email validation
    if (currentQuestion.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(answer)
    }
    
    // Number validation
    if (currentQuestion.type === 'number') {
      const num = parseFloat(answer)
      if (isNaN(num)) return false
      if (currentQuestion.min !== undefined && num < currentQuestion.min) return false
      if (currentQuestion.max !== undefined && num > currentQuestion.max) return false
    }
    
    return true
  }

  const handleNext = async () => {
    if (isLastStep) {
      setIsSubmitting(true)
      setError(null)
      
      try {
        // Send data to API for ChatGPT analysis
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answers),
        })

        if (!response.ok) {
          throw new Error('Failed to generate assessment')
        }

        const data = await response.json()
        setAnalysis(data.analysis)
      } catch (err) {
        console.error('Error generating assessment:', err)
        setError('Failed to generate assessment. Please try again.')
        setIsSubmitting(false)
      }
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleClose = () => {
    onClose()
    // Reset form state
    setCurrentStep(0)
    setAnswers({})
    setAnalysis(null)
    setError(null)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zenya-black/80 backdrop-blur-md z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 md:p-5"
          >
            <div
              className="glassmorphism rounded-3xl p-6 md:p-8 lg:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
                aria-label="Close modal"
                disabled={isSubmitting}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Zenya Lab – Lifestyle & Biological Age Snapshot
                </h2>
                <p className="text-sm text-zenya-cyan/70">
                  A brief assessment to help you understand your current lifestyle profile and foundational longevity markers.
                </p>
              </div>

              {/* Section Header */}
              {currentSection && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zenya-cyan/30 to-transparent" />
                    <span className="text-sm font-semibold text-zenya-cyan uppercase tracking-wider">
                      {currentSection}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zenya-cyan/30 to-transparent" />
                  </div>
                </div>
              )}

              {/* Show Results or Form */}
              {showResults ? (
                <AssessmentResults
                  analysis={analysis!}
                  formData={answers}
                  onClose={handleClose}
                />
              ) : (
                <>
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-zenya-cyan/70">
                        Question {currentStep + 1} of {questions.length}
                      </span>
                      <span className="text-sm text-zenya-cyan/70">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="h-1 bg-zenya-teal/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-zenya-cyan to-zenya-mint"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Loading State */}
                  {isSubmitting && (
                    <div className="mb-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zenya-teal border-t-zenya-cyan mb-4"></div>
                      <p className="text-zenya-cyan/70">
                        Analyzing your responses and generating your personalized assessment...
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Question Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                    {currentQuestion.question}
                  </h3>

                  {/* Input Field */}
                  {currentQuestion.type === 'text' && (
                    <input
                      type="text"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="w-full px-4 py-3 bg-zenya-teal/30 border border-zenya-cyan/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-zenya-mint focus:glow-mint transition-all duration-300"
                      placeholder={currentQuestion.placeholder || 'Your answer...'}
                      autoFocus
                    />
                  )}

                  {currentQuestion.type === 'email' && (
                    <input
                      type="email"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="w-full px-4 py-3 bg-zenya-teal/30 border border-zenya-cyan/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-zenya-mint focus:glow-mint transition-all duration-300"
                      placeholder={currentQuestion.placeholder || 'your.email@example.com'}
                      autoFocus
                    />
                  )}

                  {currentQuestion.type === 'number' && (
                    <input
                      type="number"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="w-full px-4 py-3 bg-zenya-teal/30 border border-zenya-cyan/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-zenya-mint focus:glow-mint transition-all duration-300"
                      placeholder={currentQuestion.placeholder || 'Enter a number...'}
                      min={currentQuestion.min}
                      max={currentQuestion.max}
                      autoFocus
                    />
                  )}

                  {currentQuestion.type === 'select' && (
                    <div className="relative">
                      <select
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="select-premium w-full px-4 py-3 bg-zenya-teal/30 border border-zenya-cyan/20 rounded-xl text-white focus:outline-none focus:border-zenya-mint focus:glow-mint transition-all duration-300 appearance-none cursor-pointer pr-10"
                        autoFocus
                      >
                        <option value="" className="bg-zenya-teal text-white">
                          Select an option...
                        </option>
                        {currentQuestion.options?.map((option) => (
                          <option key={option} value={option} className="bg-zenya-teal text-white">
                            {option}
                          </option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-zenya-cyan"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {currentQuestion.type === 'yesno' && (
                    <div className="flex gap-4">
                      {['Yes', 'No'].map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswerChange(option)}
                          className={`flex-1 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                            answers[currentQuestion.id] === option
                              ? 'bg-zenya-cyan text-zenya-black glow-mint'
                              : 'bg-zenya-teal/30 text-white border border-zenya-cyan/20 hover:border-zenya-mint'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

                  {/* Navigation Buttons */}
                  {!isSubmitting && (
                    <div className="flex justify-between items-center mt-10">
                      <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="px-6 py-3 text-zenya-cyan hover:text-zenya-mint disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        Back
                      </button>

                      <button
                        onClick={handleNext}
                        disabled={!isValidAnswer()}
                        className="px-8 py-3 bg-zenya-cyan text-zenya-black font-semibold rounded-xl hover:glow-mint disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        {isLastStep ? 'Submit Assessment' : 'Next'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'

interface FormData {
  email: string
}

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 1.8,
      ease: 'easeOut',
    },
  },
}

const successVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

export default function WaitlistForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    // TODO: Replace with your actual API endpoint
    try {
      // Example: await fetch('/api/waitlist', { method: 'POST', body: JSON.stringify(data) })
      console.log('Form submitted:', data)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) || 'Please enter a valid email address'
  }

  if (isSubmitted) {
    return (
      <motion.div
        variants={successVariants}
        initial="hidden"
        animate="visible"
        className="glassmorphism rounded-2xl p-5 md:p-10 max-w-md w-full mx-auto"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-zenya-cyan flex items-center justify-center"
          >
            <svg
              className="w-8 h-8 text-zenya-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
          <p className="text-zenya-cyan text-lg font-medium">
            You're on the list!
          </p>
          <p className="text-white/60 text-sm text-center">
            We'll notify you when we launch.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="glassmorphism rounded-2xl p-5 md:p-10 max-w-md w-full mx-auto space-y-6"
    >
      <div className="space-y-2">
        <input
          {...register('email', {
            required: 'Email is required',
            validate: validateEmail,
          })}
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 bg-zenya-teal/50 border border-zenya-cyan/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-zenya-mint focus:glow-mint transition-all duration-300"
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm"
          >
            {errors.email.message}
          </motion.p>
        )}
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-6 py-3 bg-zenya-cyan text-zenya-black font-semibold rounded-xl hover:glow-mint transition-all duration-300"
      >
        Join Waitlist
      </motion.button>
    </motion.form>
  )
}


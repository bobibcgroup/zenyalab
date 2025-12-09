'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import QuestionModal from './QuestionModal'

const mainHeadline = 'Longevity, Coming Soon.'
const subheadline = 'Experience the science of living younger, longer.'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

const logoVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: 'easeOut',
    },
  },
}

const subheadlineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 0.8,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 1.4,
      ease: 'easeOut',
    },
  },
}

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 2,
      ease: 'easeOut',
    },
  },
}

export default function HeroSection() {
  const words = mainHeadline.split(' ')
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <motion.div 
      className="relative z-10 flex flex-col items-center justify-center px-5 text-center"
      variants={floatingVariants}
      animate="animate"
    >
      {/* Depth layers behind text for better integration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zenya-black/20 to-transparent pointer-events-none" />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 209, 199, 0.03) 0%, transparent 70%)',
          backdropFilter: 'blur(0.5px)',
        }}
      />
      
      {/* Logo */}
      <motion.h2
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        className="mb-6 md:mb-8 lg:mb-10 text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold tracking-[0.2em] relative z-20"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(0, 209, 199, 0.5) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 40px rgba(0, 209, 199, 0.25)',
          letterSpacing: '0.2em',
        }}
      >
        ZENYA LAB
      </motion.h2>
      
      {/* Subtle divider line */}
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        className="mb-6 md:mb-8 lg:mb-10 w-16 h-px bg-gradient-to-r from-transparent via-zenya-cyan/30 to-transparent relative z-20"
      />
      
      {/* Main Headline */}
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-6 md:mb-8 lg:mb-10 text-[2.5rem] md:text-4xl lg:text-[3.5rem] xl:text-5xl font-black tracking-[0.02em] leading-tight relative z-20"
        style={{
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          color: '#00D1C7', // Fallback color
        }}
      >
        {/* Subtle glow backdrop with breathing effect */}
        <motion.div 
          className="absolute inset-0 blur-3xl opacity-20"
          style={{
            background: 'linear-gradient(135deg, #00D1C7 0%, #A3FFE4 100%)',
            transform: 'scale(1.2)',
            zIndex: -1,
          }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [1.2, 1.25, 1.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <span 
          className="text-gradient-premium relative z-20 block"
          style={{ 
            filter: 'none',
            display: 'inline-block',
            textShadow: '0 0 40px rgba(0, 209, 199, 0.3), 0 0 80px rgba(163, 255, 228, 0.15)',
          }}
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              variants={wordVariants}
              className="inline-block mr-2 md:mr-3"
            >
              {word}
            </motion.span>
          ))}
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={subheadlineVariants}
        initial="hidden"
        animate="visible"
        className="text-[1.125rem] md:text-xl lg:text-[1.5rem] font-light text-zenya-cyan/70 max-w-2xl leading-relaxed px-4 relative z-20 mb-6 md:mb-8 lg:mb-10"
        style={{
          textShadow: '0 2px 20px rgba(0, 209, 199, 0.2)',
        }}
      >
        {subheadline}
      </motion.p>

      {/* CTA Button */}
      <motion.button
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        onClick={() => setIsModalOpen(true)}
        className="px-8 md:px-10 py-4 md:py-5 bg-zenya-cyan text-zenya-black font-semibold text-lg md:text-xl rounded-xl hover:glow-mint hover:scale-105 transition-all duration-300 relative z-20"
      >
        Begin Living More
      </motion.button>

      {/* Question Modal */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.div>
  )
}


'use client'

import { motion } from 'framer-motion'
import SplineBackground from '@/components/SplineBackground'
import HeroSection from '@/components/HeroSection'
import FloatingParticles from '@/components/FloatingParticles'

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.4,
    transition: {
      duration: 0.6,
      delay: 2.2,
      ease: 'easeOut',
    },
  },
}

export default function Home() {
  return (
    <main className="relative h-screen overflow-hidden">
      {/* Spline 3D Background */}
      <SplineBackground />
      
      {/* Floating Particles */}
      <FloatingParticles />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 md:px-8 lg:px-10 py-20 md:py-24">
          <HeroSection />
        </div>

        {/* Footer */}
        <motion.footer
          variants={footerVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-5 md:bottom-8 left-0 right-0 text-center z-20 px-5"
        >
          <p className="text-xs md:text-sm font-light text-white/40">
            Zenya Lab · Advanced human optimization & longevity.
          </p>
        </motion.footer>
      </div>
    </main>
  )
}


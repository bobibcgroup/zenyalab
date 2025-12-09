'use client'

import { useState, Suspense, useMemo } from 'react'
import Spline from '@splinetool/react-spline/next'
import { motion } from 'framer-motion'

export default function SplineBackground() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Spline scene URL - update this if you exported a new version from Spline
  // To force browser cache refresh, increment the version number below
  const SCENE_VERSION = '2' // Increment this when you update the Spline scene
  const sceneUrl = useMemo(() => {
    return `https://prod.spline.design/OU98m3jtpI1f2IZC/scene.splinecode?v=${SCENE_VERSION}`
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  return (
    <div className="fixed inset-0 z-[1] overflow-hidden">
      {/* Loading Spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zenya-black">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-zenya-teal border-t-zenya-cyan"></div>
            <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full bg-zenya-cyan opacity-20"></div>
          </div>
        </div>
      )}

      {/* Spline Scene */}
      {!hasError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 0.05 : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full w-full"
        >
          <Suspense fallback={null}>
            <Spline
              scene={sceneUrl}
              onLoad={handleLoad}
              onError={handleError}
              className="h-full w-full"
            />
          </Suspense>
        </motion.div>
      )}

      {/* Dark Gradient Overlay for Text Readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(12, 12, 13, 0.5) 60%, rgba(12, 12, 13, 0.8) 100%)',
        }}
      />

      {/* Fallback Background */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-zenya-black via-zenya-teal to-zenya-black" />
      )}
    </div>
  )
}


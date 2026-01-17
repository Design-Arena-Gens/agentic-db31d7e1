'use client'

import { motion } from 'framer-motion'
import { PlatformInfo as PlatformInfoType } from '@/lib/platform'

interface PlatformInfoProps {
  platform: PlatformInfoType
  optimization: any
  onClose: () => void
}

export function PlatformInfo({ platform, optimization, onClose }: PlatformInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Platform Information</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="Device Type" value={platform.type} />
            <InfoCard label="Operating System" value={platform.os} />
            <InfoCard label="Browser" value={platform.browser} />
            <InfoCard
              label="Screen Size"
              value={`${platform.screenSize.width}×${platform.screenSize.height}`}
            />
          </div>

          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-lg font-semibold mb-4">Capabilities</h3>
            <div className="grid grid-cols-2 gap-3">
              <Capability
                label="Touch Device"
                enabled={platform.isTouchDevice}
              />
              <Capability
                label="Vibration"
                enabled={platform.hasVibration}
              />
              <Capability
                label="Wake Lock"
                enabled={platform.supportsWakeLock}
              />
              <Capability
                label="Speech Recognition"
                enabled={platform.supportsSpeechRecognition}
              />
              <Capability
                label="Speech Synthesis"
                enabled={platform.supportsSpeechSynthesis}
              />
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-lg font-semibold mb-4">Optimizations Applied</h3>
            <div className="space-y-2 text-sm">
              <OptimizationItem
                label="UI Scale"
                value={`${optimization.uiScale}x`}
              />
              <OptimizationItem
                label="Animations"
                value={optimization.enableAnimations ? 'Enabled' : 'Disabled'}
              />
              <OptimizationItem
                label="Max History"
                value={`${optimization.maxHistoryItems} items`}
              />
              <OptimizationItem
                label="Audio Quality"
                value={optimization.audioQuality}
              />
              <OptimizationItem
                label="Background Mode"
                value={optimization.enableBackgroundMode ? 'Supported' : 'Not Supported'}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-gray-800/50 rounded-lg">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-medium capitalize">{value}</p>
    </div>
  )
}

function Capability({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded">
      <span className={enabled ? 'text-green-500' : 'text-red-500'}>
        {enabled ? '✓' : '✗'}
      </span>
      <span className="text-sm">{label}</span>
    </div>
  )
}

function OptimizationItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

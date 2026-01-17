'use client'

import { motion } from 'framer-motion'
import { VoiceEngineStatus } from '@/lib/voiceEngine'

interface StatusIndicatorProps {
  status: VoiceEngineStatus
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const statusConfig = {
    idle: { color: 'bg-gray-600', text: 'Ready', icon: '⚪' },
    listening: { color: 'bg-red-500', text: 'Listening', icon: '🔴' },
    processing: { color: 'bg-yellow-500', text: 'Processing', icon: '🟡' },
    speaking: { color: 'bg-green-500', text: 'Speaking', icon: '🟢' },
    error: { color: 'bg-red-700', text: 'Error', icon: '🔴' },
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-center justify-center gap-3">
      <motion.div
        className={`w-3 h-3 rounded-full ${config.color}`}
        animate={
          status === 'listening' || status === 'speaking'
            ? { scale: [1, 1.3, 1] }
            : {}
        }
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      <span className="text-sm font-medium text-gray-300">{config.text}</span>
    </div>
  )
}

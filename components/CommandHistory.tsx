'use client'

import { motion } from 'framer-motion'
import { VoiceCommand } from '@/lib/voiceEngine'

interface CommandHistoryProps {
  commands: VoiceCommand[]
  onClose: () => void
}

export function CommandHistory({ commands, onClose }: CommandHistoryProps) {
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
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Command History</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {commands.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No commands yet. Start speaking to begin!
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4">
            {commands.map((command) => (
              <div
                key={command.id}
                className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium">"{command.transcript}"</p>
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                    {command.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {command.response && (
                  <p className="text-sm text-gray-400 border-l-2 border-blue-500 pl-3 mt-2">
                    {command.response}
                  </p>
                )}

                {command.error && (
                  <p className="text-sm text-red-400 border-l-2 border-red-500 pl-3 mt-2">
                    Error: {command.error}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                  <span>Confidence: {Math.round(command.confidence * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

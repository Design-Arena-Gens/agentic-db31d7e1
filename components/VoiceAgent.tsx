'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAgentStore } from '@/lib/store'
import { VoiceEngine, VoiceCommand } from '@/lib/voiceEngine'
import { AIEngine } from '@/lib/aiEngine'
import { detectPlatform, optimizeForPlatform } from '@/lib/platform'
import { StatusIndicator } from './StatusIndicator'
import { CommandHistory } from './CommandHistory'
import { PlatformInfo } from './PlatformInfo'
import { ImprovementPanel } from './ImprovementPanel'

export function VoiceAgent() {
  const voiceEngineRef = useRef<VoiceEngine | null>(null)
  const aiEngineRef = useRef<AIEngine | null>(null)

  const {
    status,
    platform,
    commands,
    currentTranscript,
    isSupported,
    continuousMode,
    errorMessage,
    setStatus,
    setPlatform,
    addCommand,
    setCurrentTranscript,
    setIsSupported,
    setContinuousMode,
    setError,
  } = useAgentStore()

  const [showHistory, setShowHistory] = useState(false)
  const [showPlatformInfo, setShowPlatformInfo] = useState(false)
  const [showImprovements, setShowImprovements] = useState(false)

  useEffect(() => {
    const platformInfo = detectPlatform()
    setPlatform(platformInfo)

    const voiceEngine = new VoiceEngine()
    const aiEngine = new AIEngine()

    voiceEngineRef.current = voiceEngine
    aiEngineRef.current = aiEngine

    setIsSupported(voiceEngine.isSupported())

    voiceEngine.setOnStatusChange((newStatus) => {
      setStatus(newStatus)
      setError(null)
    })

    voiceEngine.setOnTranscript(async (transcript, confidence) => {
      setCurrentTranscript('')

      const command: VoiceCommand = {
        id: `cmd-${Date.now()}`,
        transcript,
        timestamp: new Date(),
        confidence,
      }

      try {
        setStatus('processing')
        const response = await aiEngine.processCommand(transcript, platformInfo.type)
        command.response = response
        addCommand(command)

        await voiceEngine.speak(response)
      } catch (error) {
        command.error = error instanceof Error ? error.message : 'Unknown error'
        addCommand(command)
        setError(command.error)
      }
    })

    voiceEngine.setOnError((error) => {
      setError(error)
      setStatus('idle')
    })

    return () => {
      voiceEngine.stopListening()
      voiceEngine.cancelSpeech()
    }
  }, [])

  const handleMicClick = () => {
    if (!voiceEngineRef.current) return

    if (status === 'listening' || status === 'processing') {
      voiceEngineRef.current.stopListening()
      setStatus('idle')
    } else if (status === 'speaking') {
      voiceEngineRef.current.cancelSpeech()
      setStatus('idle')
    } else {
      setError(null)
      voiceEngineRef.current.startListening()
    }
  }

  const handleContinuousModeToggle = () => {
    if (!voiceEngineRef.current) return
    const newMode = !continuousMode
    setContinuousMode(newMode)
    voiceEngineRef.current.enableContinuousMode(newMode)
  }

  if (!isSupported) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Voice Not Supported</h1>
          <p className="text-gray-400">
            Your browser doesn't support Web Speech API. Please use Chrome, Edge, or Safari on desktop or mobile.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Autonomous Agent</h1>
              <p className="text-xs text-gray-500">v1.0.0 - Self-Improving AI</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition-colors"
            >
              History {commands.length > 0 && `(${commands.length})`}
            </button>
            <button
              onClick={() => setShowPlatformInfo(!showPlatformInfo)}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition-colors"
            >
              Platform
            </button>
            <button
              onClick={() => setShowImprovements(!showImprovements)}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-sm transition-colors"
            >
              Improvements
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Status Indicator */}
          <StatusIndicator status={status} />

          {/* Main Control */}
          <div className="flex flex-col items-center mt-12">
            <motion.button
              onClick={handleMicClick}
              className={`
                w-32 h-32 rounded-full flex items-center justify-center text-6xl
                transition-all duration-300 shadow-2xl
                ${status === 'listening' ? 'bg-red-500 scale-110 animate-pulse' : ''}
                ${status === 'processing' ? 'bg-yellow-500 animate-spin' : ''}
                ${status === 'speaking' ? 'bg-green-500 animate-pulse' : ''}
                ${status === 'idle' ? 'bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105' : ''}
                ${status === 'error' ? 'bg-red-700' : ''}
              `}
              whileTap={{ scale: 0.95 }}
            >
              {status === 'listening' && '🎤'}
              {status === 'processing' && '⚙️'}
              {status === 'speaking' && '🔊'}
              {status === 'idle' && '🎙️'}
              {status === 'error' && '❌'}
            </motion.button>

            <p className="mt-6 text-gray-400 text-center">
              {status === 'idle' && 'Tap to speak'}
              {status === 'listening' && 'Listening...'}
              {status === 'processing' && 'Processing...'}
              {status === 'speaking' && 'Speaking...'}
              {status === 'error' && 'Error occurred'}
            </p>

            {currentTranscript && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-lg text-center"
              >
                {currentTranscript}
              </motion.p>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500 rounded-lg text-sm"
              >
                {errorMessage}
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-12 flex justify-center gap-4">
            <button
              onClick={handleContinuousModeToggle}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all
                ${continuousMode
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-gray-800 hover:bg-gray-700'
                }
              `}
            >
              {continuousMode ? '🔄 Continuous Mode ON' : '⏸️ Continuous Mode OFF'}
            </button>
          </div>

          {/* Latest Command */}
          {commands.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 p-6 bg-gray-900/50 border border-gray-800 rounded-xl"
            >
              <h3 className="text-sm font-medium text-gray-400 mb-2">Latest Command</h3>
              <p className="text-lg mb-2">"{commands[0].transcript}"</p>
              {commands[0].response && (
                <p className="text-gray-400 text-sm border-l-2 border-blue-500 pl-3">
                  {commands[0].response}
                </p>
              )}
              <p className="text-xs text-gray-600 mt-2">
                Confidence: {Math.round(commands[0].confidence * 100)}% • {commands[0].timestamp.toLocaleTimeString()}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Side Panels */}
      <AnimatePresence>
        {showHistory && (
          <CommandHistory
            commands={commands}
            onClose={() => setShowHistory(false)}
          />
        )}

        {showPlatformInfo && platform && (
          <PlatformInfo
            platform={platform}
            optimization={optimizeForPlatform(platform)}
            onClose={() => setShowPlatformInfo(false)}
          />
        )}

        {showImprovements && aiEngineRef.current && (
          <ImprovementPanel
            aiEngine={aiEngineRef.current}
            onClose={() => setShowImprovements(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

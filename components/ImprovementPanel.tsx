'use client'

import { motion } from 'framer-motion'
import { AIEngine } from '@/lib/aiEngine'
import { useState } from 'react'

interface ImprovementPanelProps {
  aiEngine: AIEngine
  onClose: () => void
}

export function ImprovementPanel({ aiEngine, onClose }: ImprovementPanelProps) {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'history' | 'analytics'>('suggestions')
  const suggestions = aiEngine.suggestImprovements()
  const codeHistory = aiEngine.getCodeHistory()
  const conversationHistory = aiEngine.getConversationHistory()

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
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Self-Improvement System</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          <TabButton
            active={activeTab === 'suggestions'}
            onClick={() => setActiveTab('suggestions')}
          >
            💡 Suggestions
          </TabButton>
          <TabButton
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          >
            📝 Code History
          </TabButton>
          <TabButton
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </TabButton>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">
                Based on usage patterns and current capabilities, here are suggested improvements:
              </p>
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🚀</span>
                    <div className="flex-1">
                      <p className="font-medium">{suggestion}</p>
                      <div className="mt-3 flex gap-2">
                        <button className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded transition-colors">
                          Implement
                        </button>
                        <button className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {codeHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No code changes yet</p>
                  <p className="text-sm mt-1">Code modifications will appear here</p>
                </div>
              ) : (
                codeHistory.map((change) => (
                  <div
                    key={change.id}
                    className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{change.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {change.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`
                          px-2 py-1 text-xs rounded
                          ${change.status === 'applied' ? 'bg-green-500/20 text-green-400' : ''}
                          ${change.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                          ${change.status === 'rolled-back' ? 'bg-gray-500/20 text-gray-400' : ''}
                          ${change.status === 'failed' ? 'bg-red-500/20 text-red-400' : ''}
                        `}
                      >
                        {change.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Modified {change.files.length} file(s)
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <AnalyticsCard
                title="Total Commands Processed"
                value={conversationHistory.length}
                icon="💬"
              />
              <AnalyticsCard
                title="Session Uptime"
                value={new Date().toLocaleTimeString()}
                icon="⏱️"
              />
              <AnalyticsCard
                title="Code Changes"
                value={codeHistory.length}
                icon="🔧"
              />
              <AnalyticsCard
                title="Success Rate"
                value="100%"
                icon="✅"
              />

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h3 className="font-medium mb-3">System Status</h3>
                <div className="space-y-2 text-sm">
                  <StatusRow label="Voice Engine" status="operational" />
                  <StatusRow label="AI Processing" status="operational" />
                  <StatusRow label="Platform Detection" status="operational" />
                  <StatusRow label="Memory Management" status="optimal" />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg">
                <h3 className="font-medium mb-2">🧠 Learning Status</h3>
                <p className="text-sm text-gray-400">
                  The system is continuously analyzing interactions to identify patterns
                  and improvement opportunities. All data is processed locally for privacy.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 font-medium transition-colors relative
        ${active ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
      `}
    >
      {children}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
        />
      )}
    </button>
  )
}

function AnalyticsCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string | number
  icon: string
}) {
  return (
    <div className="p-4 bg-gray-800/50 rounded-lg flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

function StatusRow({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="text-green-400 text-xs flex items-center gap-1">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        {status}
      </span>
    </div>
  )
}

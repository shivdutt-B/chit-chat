"use client"

import type React from "react"
import { useState } from "react"
import { UserPlus, Zap, X, ArrowRight, ArrowLeft, Sparkles, User } from "lucide-react"
import { mockIceBreakers } from "../../data/mockData"
import type { IceBreaker } from "../../types"

interface NewChatModalProps {
  isOpen: boolean
  onClose: () => void
  onStartChat: (participant: string, message?: string) => void
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ 
  isOpen, 
  onClose, 
  onStartChat 
}) => {
  const [step, setStep] = useState(1) // 1: Enter participant, 2: Select icebreaker, 3: Start chat
  const [participant, setParticipant] = useState("")
  const [selectedMessage, setSelectedMessage] = useState("")
  const [generatedIcebreaker, setGeneratedIcebreaker] = useState("")

  const handleClose = () => {
    setStep(1)
    setParticipant("")
    setSelectedMessage("")
    setGeneratedIcebreaker("")
    onClose()
  }

  const handleNextStep = () => {
    if (step === 1 && participant.trim()) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleGenerateIcebreaker = () => {
    const aiIcebreakers = [
      `Hey ${participant.split('@')[0] || participant}! I hope you're having a great day. I wanted to reach out and see how things are going with you! 😊`,
      `Hi ${participant.split('@')[0] || participant}! I've been meaning to connect with you. How has your week been treating you?`,
      `Hello ${participant.split('@')[0] || participant}! I thought of you recently and wanted to check in. What's the most exciting thing you're working on right now?`,
      `Hey ${participant.split('@')[0] || participant}! Hope you're doing well. I'd love to catch up and hear what's new in your world! ✨`,
      `Hi ${participant.split('@')[0] || participant}! I was just thinking about our team and wanted to reach out. How are you finding everything lately?`
    ]
    const randomIcebreaker = aiIcebreakers[Math.floor(Math.random() * aiIcebreakers.length)]
    setGeneratedIcebreaker(randomIcebreaker)
    setSelectedMessage(randomIcebreaker)
  }

  const handleStartChat = () => {
    console.log('handleStartChat called')
    console.log('onStartChat:', onStartChat)
    console.log('participant:', participant)
    console.log('selectedMessage:', selectedMessage)
    
    if (participant.trim()) {
      if (typeof onStartChat === 'function') {
        onStartChat(participant.trim(), selectedMessage.trim() || undefined)
        handleClose()
      } else {
        console.error('onStartChat is not a function:', typeof onStartChat)
      }
    }
  }

  if (!isOpen) return null

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {[1, 2, 3].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
            step === stepNumber 
              ? 'bg-blue-500 text-white' 
              : step > stepNumber 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-500'
          }`}>
            {step > stepNumber ? '✓' : stepNumber}
          </div>
          {stepNumber < 3 && (
            <div className={`w-8 h-0.5 mx-2 transition-colors duration-200 ${
              step > stepNumber ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Who would you like to chat with?</h3>
        <p className="text-gray-600">Enter their name or email address to get started</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name or Email
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
            placeholder="e.g. John Doe or john@example.com"
            value={participant}
            onChange={(e) => setParticipant(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && participant.trim() && handleNextStep()}
          />
        </div>
        
        <button
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            participant.trim()
              ? "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          onClick={handleNextStep}
          disabled={!participant.trim()}
        >
          Next: Choose Ice Breaker
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose an Ice Breaker</h3>
        <p className="text-gray-600">Select a message to start your conversation with {participant}</p>
      </div>

      {/* AI Generate Button */}
      <button
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-sm"
        onClick={handleGenerateIcebreaker}
      >
        <Zap className="w-4 h-4" />
        Generate AI Ice Breaker
      </button>

      {/* Generated Ice Breaker */}
      {generatedIcebreaker && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">"{generatedIcebreaker}"</p>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedMessage === generatedIcebreaker
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-300'
                }`}
                onClick={() => setSelectedMessage(generatedIcebreaker)}
              >
                {selectedMessage === generatedIcebreaker ? 'Selected ✓' : 'Use This Message'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-made Ice Breakers */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Or choose from these options:</h4>
        <div className="space-y-2">
          {mockIceBreakers.slice(0, 3).map((icebreaker: IceBreaker) => (
            <button
              key={icebreaker.id}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                selectedMessage === icebreaker.content
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedMessage(icebreaker.content)}
            >
              <p className="text-sm text-gray-700 mb-1">"{icebreaker.content}"</p>
              <span className="text-xs text-gray-500">{icebreaker.context}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <button
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
          onClick={handlePreviousStep}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            selectedMessage
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          onClick={handleNextStep}
          disabled={!selectedMessage}
        >
          Next: Start Chat
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
          <UserPlus className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Start!</h3>
        <p className="text-gray-600">Review your chat details and start the conversation</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Chat with:</label>
          <p className="text-lg font-semibold text-gray-900">{participant}</p>
        </div>
        
        {selectedMessage && (
          <div>
            <label className="text-sm font-medium text-gray-600">Opening message:</label>
            <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 italic">"{selectedMessage}"</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <button
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
          onClick={handlePreviousStep}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-200 shadow-sm"
          onClick={handleStartChat}
        >
          <UserPlus className="w-4 h-4" />
          Start Chat
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl max-w-lg w-[90%] max-h-[90vh] overflow-hidden z-50 border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">New Chat</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {renderStepIndicator()}
          
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </>
  )
}

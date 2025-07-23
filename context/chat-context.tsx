"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { nanoid } from "nanoid"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  toolInvocations?: Array<{
    toolName: string
    result?: any
  }>
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

type ConversationContextType = {
  conversations: Conversation[]
  currentConversationId: string | null
  currentConversation: Conversation | null
  createNewConversation: () => string
  switchConversation: (id: string) => void
  updateConversation: (id: string, messages: Message[]) => void
  deleteConversation: (id: string) => void
  generateTitle: (messages: Message[]) => string
}

const ConversationContext = createContext<ConversationContextType | null>(null)

export function useConversations() {
  const context = useContext(ConversationContext)
  if (!context) {
    throw new Error("useConversations must be used within ConversationProvider")
  }
  return context
}

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  // Load conversations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ai-conversations")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setConversations(
          parsed.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
          })),
        )
      } catch (error) {
        console.error("Failed to load conversations:", error)
      }
    }
  }, [])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("ai-conversations", JSON.stringify(conversations))
    }
  }, [conversations])

  const generateTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find((m) => m.role === "user")
    if (!firstUserMessage) return "New Chat"

    // Take first 50 characters of the first user message
    const title = firstUserMessage.content.slice(0, 50)
    return title.length < firstUserMessage.content.length ? title + "..." : title
  }

  const createNewConversation = (): string => {
    const id = nanoid()
    const newConversation: Conversation = {
      id,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(id)
    return id
  }

  const switchConversation = (id: string) => {
    setCurrentConversationId(id)
  }

  const updateConversation = (id: string, messages: Message[]) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === id) {
          const title = messages.length > 0 ? generateTitle(messages) : "New Chat"
          return {
            ...conv,
            messages,
            title,
            updatedAt: new Date(),
          }
        }
        return conv
      }),
    )
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (currentConversationId === id) {
      const remaining = conversations.filter((conv) => conv.id !== id)
      setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  const currentConversation = conversations.find((conv) => conv.id === currentConversationId) || null

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        currentConversationId,
        currentConversation,
        createNewConversation,
        switchConversation,
        updateConversation,
        deleteConversation,
        generateTitle,
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}

"use client"

import { createContext, useContext, useState, type ReactNode, useCallback, useMemo } from "react"
import { nanoid } from "nanoid"
import type { Message } from "ai"

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  lastMessage?: string
  date: Date
  messageCount: number
}

type ChatContextType = {
  conversations: Conversation[]
  activeConversationId: string | null
  activeMessages: Message[]
  setActiveConversationMessages: (messages: Message[]) => void
  selectConversation: (id: string) => void
  createNewConversation: () => string
  deleteConversation: (id: string) => void
  updateConversationTitle: (id: string, title: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  const activeConversation = useMemo(() => {
    return activeConversationId ? conversations.find((c) => c.id === activeConversationId) || null : null
  }, [conversations, activeConversationId])

  const activeMessages = useMemo(() => {
    return activeConversation?.messages || []
  }, [activeConversation])

  const setActiveConversationMessages = useCallback(
    (messages: Message[]) => {
      if (!activeConversationId) return

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId) {
            const lastUserMessage = messages.filter((m) => m.role === "user").pop()?.content as string

            return {
              ...conv,
              messages,
              lastMessage: lastUserMessage || conv.lastMessage,
              messageCount: messages.length,
            }
          }
          return conv
        }),
      )
    },
    [activeConversationId],
  )

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id)
  }, [])

  const createNewConversation = useCallback(() => {
    const id = nanoid()
    const newConversation: Conversation = {
      id,
      title: "New Conversation",
      messages: [],
      date: new Date(),
      messageCount: 0,
    }

    setConversations((prev) => [newConversation, ...prev])
    setActiveConversationId(id)
    return id
  }, [])

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id))

      if (activeConversationId === id) {
        const remaining = conversations.filter((c) => c.id !== id)
        setActiveConversationId(remaining.length > 0 ? remaining[0].id : null)
      }
    },
    [conversations, activeConversationId],
  )

  const updateConversationTitle = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === id) {
          return { ...conv, title }
        }
        return conv
      }),
    )
  }, [])

  const contextValue = useMemo(
    () => ({
      conversations,
      activeConversationId,
      activeMessages,
      setActiveConversationMessages,
      selectConversation,
      createNewConversation,
      deleteConversation,
      updateConversationTitle,
    }),
    [
      conversations,
      activeConversationId,
      activeMessages,
      setActiveConversationMessages,
      selectConversation,
      createNewConversation,
      deleteConversation,
      updateConversationTitle,
    ],
  )

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

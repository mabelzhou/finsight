"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Send, Square, RotateCcw, Trash2, User, Bot } from "lucide-react"
import { nanoid } from "nanoid"
import { ScrollAreaViewport } from "@radix-ui/react-scroll-area"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  toolInvocations?: Array<{
    toolName: string
    result?: any
  }>
}

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState("")
  const abortControllerRef = useRef<AbortController | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>(undefined);
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  const prevMessages = usePrevious(messages);

  // Focus input and scroll to bottom when new message is added
  useEffect(() => {
    const messageWasAdded =
      prevMessages && messages.length > prevMessages.length;

    if (messageWasAdded) {
      inputRef.current?.focus();
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, prevMessages]);


  // // Auto-scroll to bottom when messages change
  // useEffect(() => {
  //   endRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages, streamingMessage]);

  // // Autofocus on input 
  // useEffect(() => {
  //   inputRef.current?.focus();
  // }, [messages]);

  const handleDelete = (id: string) => {
    setMessages(messages.filter((message) => message.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)
    setStreamingMessage("")

    // Add user message
    const newUserMessage: Message = {
      id: nanoid(),
      role: "user",
      content: userMessage,
    }
    setMessages((prev) => [...prev, newUserMessage])

    try {
      // Create abort controller for this request
      abortControllerRef.current = new AbortController()

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map(({ id, toolInvocations, ...msg }) => msg),
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      let assistantMessage = ""
      const toolInvocations: Array<{ toolName: string; result?: any }> = []
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const data = JSON.parse(line.slice(2))
              if (data.type === "text-delta") {
                assistantMessage += data.textDelta
                setStreamingMessage(assistantMessage)
              } else if (data.type === "tool-call") {
                toolInvocations.push({
                  toolName: data.toolName,
                })
              } else if (data.type === "tool-result") {
                const lastTool = toolInvocations[toolInvocations.length - 1]
                if (lastTool) {
                  lastTool.result = data.result
                }
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }

      // Add the complete assistant message
      if (assistantMessage || toolInvocations.length > 0) {
        const newAssistantMessage: Message = {
          id: nanoid(),
          role: "assistant",
          content: assistantMessage,
          ...(toolInvocations.length > 0 && { toolInvocations }),
        }
        setMessages((prev) => [...prev, newAssistantMessage])
      }

      setStreamingMessage("")
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Chat error:", error)
        const errorMessage: Message = {
          id: nanoid(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
      setStreamingMessage("")
    }
  }

  const reload = async () => {
    if (messages.length === 0) return

    // Find the last user message
    const lastUserMessageIndex = messages.findLastIndex((msg) => msg.role === "user")
    if (lastUserMessageIndex === -1) return

    // Remove all messages after the last user message
    const messagesToKeep = messages.slice(0, lastUserMessageIndex + 1)
    setMessages(messagesToKeep)

    // Re-trigger the API call with the last user message
    const lastUserMessage = messages[lastUserMessageIndex]
    setIsLoading(true)
    setStreamingMessage("")

    try {
      abortControllerRef.current = new AbortController()

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesToKeep.map(({ id, toolInvocations, ...msg }) => msg),
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      let assistantMessage = ""
      const toolInvocations: Array<{ toolName: string; result?: any }> = []
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const data = JSON.parse(line.slice(2))
              if (data.type === "text-delta") {
                assistantMessage += data.textDelta
                setStreamingMessage(assistantMessage)
              } else if (data.type === "tool-call") {
                toolInvocations.push({
                  toolName: data.toolName,
                })
              } else if (data.type === "tool-result") {
                const lastTool = toolInvocations[toolInvocations.length - 1]
                if (lastTool) {
                  lastTool.result = data.result
                }
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }

      // Add the complete assistant message
      if (assistantMessage || toolInvocations.length > 0) {
        const newAssistantMessage: Message = {
          id: nanoid(),
          role: "assistant",
          content: assistantMessage,
          ...(toolInvocations.length > 0 && { toolInvocations }),
        }
        setMessages((prev) => [...prev, newAssistantMessage])
      }

      setStreamingMessage("")
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Chat error:", error)
        const errorMessage: Message = {
          id: nanoid(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] w-full p-4">
      <Card className="flex-1 flex flex-col h-full border-none shadow-none">
        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <ScrollAreaViewport className="h-full w-full">
            <div className="space-y-4">
              {/* Empty state */}
              {messages.length === 0 && !streamingMessage && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Start a conversation with the Finsight!</p>
                  <p className="text-sm mt-2">Try asking about company performance.</p>
                </div>
              )}

              {/* Message list */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 group ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        {message.toolInvocations && message.toolInvocations.length > 0 ? (
                          <div className="space-y-2">
                            {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
                            {message.toolInvocations.map((tool, index) => (
                              <div key={`${message.id}-${tool.toolName}-${index}`} className="bg-background/50 rounded p-2 text-sm">
                                <div className="font-medium text-primary">🔧 {tool.toolName}</div>
                                {tool.result && (
                                  <div className="mt-1 text-muted-foreground">
                                    {typeof tool.result === "object"
                                      ? JSON.stringify(tool.result, null, 2)
                                      : String(tool.result)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Streaming message */}
              {streamingMessage && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[80%] bg-muted rounded-lg px-4 py-2">
                    <p className="whitespace-pre-wrap">{streamingMessage}</p>
                  </div>
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && !streamingMessage && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </ScrollAreaViewport>
        </ScrollArea>

        {/* Input area */}
        <CardContent className="p-4 border-t">
          <div className="flex gap-2 mb-2">
            {isLoading && (
              <Button variant="outline" size="sm" onClick={stop}>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}
            {messages.length > 0 && !isLoading && (
              <Button variant="outline" size="sm" onClick={reload}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
              ref={inputRef}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

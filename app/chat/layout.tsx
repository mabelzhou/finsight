"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/theme-toggle"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ConversationProvider, useConversations } from "@/context/chat-context"
import type { ReactNode } from "react"

function ChatHeader() {
  const { currentConversation } = useConversations()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{currentConversation?.title || "New Chat"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto px-3">
        <ModeToggle />
      </div>
    </header>
  )
}

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <ConversationProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <ChatHeader />
          {children} {/* Chatbox will be rendered here */}
        </SidebarInset>
      </SidebarProvider>
    </ConversationProvider>
  )
}

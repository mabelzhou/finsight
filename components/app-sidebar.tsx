"use client"

import type * as React from "react"
import { MessageCircleQuestion, Settings2, Trash2, Plus, MessageCircle, MoreHorizontal } from "lucide-react"
import { RiOpenaiFill } from "react-icons/ri"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useConversations } from "@/context/chat-context"

const data = {
  teams: [
    {
      name: "OpenAI",
      logo: RiOpenaiFill,
      plan: "Enterprise",
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { conversations, currentConversationId, createNewConversation, switchConversation, deleteConversation } =
    useConversations()

  const handleNewChat = () => {
    createNewConversation()
  }

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteConversation(id)
  }

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <RiOpenaiFill className="h-6 w-6" />
          <span className="font-semibold">GPT-4.1</span>
        </div>

        <div className="px-2">
          <Button onClick={handleNewChat} className="w-full justify-start gap-2 bg-transparent" variant="outline">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((conversation) => (
                <SidebarMenuItem key={conversation.id}>
                  <SidebarMenuButton
                    onClick={() => switchConversation(conversation.id)}
                    isActive={currentConversationId === conversation.id}
                    className="group"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="truncate">{conversation.title}</span>
                  </SidebarMenuButton>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction className="opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteConversation(e, conversation.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}

              {conversations.length === 0 && (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">No conversations yet</div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

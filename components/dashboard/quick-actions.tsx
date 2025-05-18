"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Action {
  id: string
  label: string
  icon: ReactNode
  onClick: () => void
  variant?: "default" | "outline" | "secondary" | "ghost" | "link"
}

interface QuickActionsProps {
  actions: Action[]
  className?: string
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant || "outline"}
            className="h-auto flex-col gap-2 py-4"
            onClick={action.onClick}
          >
            <div className="h-8 w-8">{action.icon}</div>
            <span className="text-xs font-normal">{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

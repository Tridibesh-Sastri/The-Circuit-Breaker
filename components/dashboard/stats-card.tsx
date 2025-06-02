import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
    text: string
  }
  className?: string
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-primary/10 p-1.5 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center text-xs mt-1">
            <span className={cn("flex items-center", trend.isPositive ? "text-emerald-500" : "text-rose-500")}>
              {trend.isPositive ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground ml-1">{trend.text}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, AlertTriangle, Calendar, CheckCircle } from "lucide-react"

interface Equipment {
  id: string
  name: string
  lastMaintenance?: string
  nextMaintenance?: string
  status: string
}

interface MaintenanceTrackerProps {
  equipment: Equipment[]
}

export function MaintenanceTracker({ equipment }: MaintenanceTrackerProps) {
  const getMaintenanceStatus = (item: Equipment) => {
    if (!item.nextMaintenance) return "no-schedule"

    const nextDate = new Date(item.nextMaintenance)
    const today = new Date()
    const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntil < 0) return "overdue"
    if (daysUntil <= 7) return "due-soon"
    if (daysUntil <= 30) return "upcoming"
    return "scheduled"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "bg-red-100 text-red-800"
      case "due-soon":
        return "bg-orange-100 text-orange-800"
      case "upcoming":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const overdueItems = equipment.filter((item) => getMaintenanceStatus(item) === "overdue")
  const dueSoonItems = equipment.filter((item) => getMaintenanceStatus(item) === "due-soon")
  const upcomingItems = equipment.filter((item) => getMaintenanceStatus(item) === "upcoming")

  return (
    <div className="space-y-6">
      {/* Maintenance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Due Soon</p>
                <p className="text-2xl font-bold text-orange-600">{dueSoonItems.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-yellow-600">{upcomingItems.length}</p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Up to Date</p>
                <p className="text-2xl font-bold text-green-600">
                  {equipment.length - overdueItems.length - dueSoonItems.length - upcomingItems.length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {equipment.map((item) => {
              const status = getMaintenanceStatus(item)
              const nextDate = item.nextMaintenance ? new Date(item.nextMaintenance) : null
              const lastDate = item.lastMaintenance ? new Date(item.lastMaintenance) : null

              return (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {lastDate && <p>Last maintenance: {lastDate.toLocaleDateString()}</p>}
                      {nextDate && <p>Next maintenance: {nextDate.toLocaleDateString()}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(status)}>{status.replace("-", " ")}</Badge>
                    <Button size="sm" variant="outline">
                      Schedule
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

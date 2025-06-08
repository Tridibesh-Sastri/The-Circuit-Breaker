"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, MapPin, DollarSign, User, Wrench } from "lucide-react"

interface Equipment {
  id: string
  name: string
  category: string
  model: string
  serialNumber: string
  manufacturer: string
  purchaseDate: string
  cost: number
  location: string
  status: "available" | "in-use" | "maintenance" | "damaged" | "retired"
  condition: "excellent" | "good" | "fair" | "poor"
  description: string
  specifications: Record<string, string>
  image?: string
  lastMaintenance?: string
  nextMaintenance?: string
  currentUser?: string
}

interface EquipmentCardProps {
  equipment: Equipment
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "in-use":
        return "bg-orange-100 text-orange-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      case "damaged":
        return "bg-red-100 text-red-800"
      case "retired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "fair":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isMaintenanceDue = () => {
    if (!equipment.nextMaintenance) return false
    return new Date(equipment.nextMaintenance) <= new Date()
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getStatusColor(equipment.status)}>{equipment.status.replace("-", " ")}</Badge>
          <Badge className={getConditionColor(equipment.condition)}>{equipment.condition}</Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{equipment.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {equipment.manufacturer} {equipment.model}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Basic Info */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>{equipment.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{equipment.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>${equipment.cost.toLocaleString()}</span>
          </div>
        </div>

        {/* Current User */}
        {equipment.currentUser && (
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <User className="h-4 w-4" />
            <span>Used by: {equipment.currentUser}</span>
          </div>
        )}

        {/* Maintenance Alert */}
        {isMaintenanceDue() && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            <Wrench className="h-4 w-4" />
            <span>Maintenance due</span>
          </div>
        )}

        {/* Specifications */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Key Specifications:</p>
          <div className="space-y-1">
            {Object.entries(equipment.specifications)
              .slice(0, 3)
              .map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-gray-600">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Serial Number */}
        <div className="text-xs text-gray-500">S/N: {equipment.serialNumber}</div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          {equipment.status === "available" && <Button className="w-full">Book Equipment</Button>}
          {equipment.status === "in-use" && (
            <Button className="w-full" variant="outline">
              View Booking
            </Button>
          )}
          {equipment.status === "maintenance" && (
            <Button className="w-full" variant="outline" disabled>
              Under Maintenance
            </Button>
          )}
          <Button className="w-full" variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

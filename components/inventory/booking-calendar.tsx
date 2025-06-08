"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"

interface Equipment {
  id: string
  name: string
  status: string
  bookings: Booking[]
}

interface Booking {
  id: string
  userId: string
  userName: string
  startDate: string
  endDate: string
  purpose: string
  status: "pending" | "approved" | "active" | "completed" | "cancelled"
}

interface BookingCalendarProps {
  equipment: Equipment[]
}

export function BookingCalendar({ equipment }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Get all bookings for the selected date
  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    const bookings: (Booking & { equipmentName: string })[] = []

    equipment.forEach((item) => {
      item.bookings.forEach((booking) => {
        const startDate = new Date(booking.startDate)
        const endDate = new Date(booking.endDate)
        const checkDate = new Date(dateString)

        if (checkDate >= startDate && checkDate <= endDate) {
          bookings.push({
            ...booking,
            equipmentName: item.name,
          })
        }
      })
    })

    return bookings
  }

  const todayBookings = getBookingsForDate(selectedDate)
  const pendingBookings = equipment.flatMap((item) =>
    item.bookings
      .filter((booking) => booking.status === "pending")
      .map((booking) => ({ ...booking, equipmentName: item.name })),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Equipment Booking Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
              Today
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings for {selectedDate.toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No bookings for this date</p>
              ) : (
                todayBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{booking.equipmentName}</h4>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{booking.userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(booking.startDate).toLocaleDateString()} -{" "}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-2">{booking.purpose}</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {booking.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Reject
                          </Button>
                        </>
                      )}
                      {booking.status === "active" && (
                        <Button size="sm" variant="outline">
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pending approvals</p>
              ) : (
                pendingBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{booking.equipmentName}</h4>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{booking.userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(booking.startDate).toLocaleDateString()} -{" "}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-2">{booking.purpose}</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm">Approve</Button>
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{item.name}</h4>
                  <Badge
                    className={item.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {item.bookings.filter((b) => b.status === "active").length > 0 ? (
                    <p>Currently booked</p>
                  ) : (
                    <p>Available for booking</p>
                  )}
                </div>
                <Button size="sm" className="w-full mt-2" disabled={item.status !== "available"}>
                  Book Now
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

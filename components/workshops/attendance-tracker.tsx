"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Search, Download, CheckCircle, XCircle } from "lucide-react"

interface Workshop {
  id: string
  title: string
  date: string
  time: string
  enrolled: number
  capacity: number
  status: string
}

interface AttendanceTrackerProps {
  workshops: Workshop[]
}

interface Attendee {
  id: string
  name: string
  email: string
  department: string
  year: string
  present: boolean
  checkedInAt?: string
}

export function AttendanceTracker({ workshops }: AttendanceTrackerProps) {
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [attendees, setAttendees] = useState<Attendee[]>([])

  // Mock attendees data
  const mockAttendees: Attendee[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@university.edu",
      department: "Electrical Engineering",
      year: "3rd Year",
      present: true,
      checkedInAt: "2024-01-15T14:05:00Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@university.edu",
      department: "Computer Engineering",
      year: "2nd Year",
      present: false,
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@university.edu",
      department: "Electronics",
      year: "4th Year",
      present: true,
      checkedInAt: "2024-01-15T14:02:00Z",
    },
  ]

  const handleWorkshopSelect = (workshopId: string) => {
    setSelectedWorkshop(workshopId)
    setAttendees(mockAttendees) // In real app, fetch attendees for this workshop
  }

  const toggleAttendance = (attendeeId: string) => {
    setAttendees((prev) =>
      prev.map((attendee) =>
        attendee.id === attendeeId
          ? {
              ...attendee,
              present: !attendee.present,
              checkedInAt: !attendee.present ? new Date().toISOString() : undefined,
            }
          : attendee,
      ),
    )
  }

  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const presentCount = attendees.filter((a) => a.present).length
  const attendanceRate = attendees.length > 0 ? (presentCount / attendees.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Workshop Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Attendance Tracker
          </CardTitle>
          <CardDescription>Track and manage workshop attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Workshop</label>
              <select
                value={selectedWorkshop}
                onChange={(e) => handleWorkshopSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a workshop...</option>
                {workshops.map((workshop) => (
                  <option key={workshop.id} value={workshop.id}>
                    {workshop.title} - {new Date(workshop.date).toLocaleDateString()} at {workshop.time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedWorkshop && (
        <>
          {/* Attendance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Registered</p>
                    <p className="text-2xl font-bold">{attendees.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Present</p>
                    <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                    <p className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</p>
                  </div>
                  <div className="text-2xl">📊</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendee List */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Attendee List</CardTitle>
                  <CardDescription>Mark attendance for workshop participants</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">Mark All Present</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search attendees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Attendee Table */}
              <div className="space-y-2">
                {filteredAttendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox checked={attendee.present} onCheckedChange={() => toggleAttendance(attendee.id)} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{attendee.name}</h4>
                          {attendee.present && <Badge className="bg-green-100 text-green-800">Present</Badge>}
                        </div>
                        <div className="text-sm text-gray-600">
                          {attendee.email} • {attendee.department} • {attendee.year}
                        </div>
                        {attendee.checkedInAt && (
                          <div className="text-xs text-green-600">
                            Checked in at {new Date(attendee.checkedInAt).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {attendee.present ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredAttendees.length === 0 && (
                <div className="text-center py-8 text-gray-500">No attendees found matching your search.</div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

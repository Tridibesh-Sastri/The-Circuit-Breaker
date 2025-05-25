"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Search, Plus, MapPin, Users, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import type { Event } from "@/lib/supabase"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [searchQuery, date, events])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      // Explicitly include all events regardless of creator role
      const { data, error } = await supabase.from("events").select("*").order("start_date", { ascending: true })

      if (error) {
        throw error
      }

      if (data) {
        setEvents(data)
        setFilteredEvents(data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let result = [...events]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query),
      )
    }

    // Apply date filter
    if (date) {
      const selectedDate = new Date(date)
      selectedDate.setHours(0, 0, 0, 0)

      result = result.filter((event) => {
        const eventStartDate = new Date(event.start_date)
        eventStartDate.setHours(0, 0, 0, 0)
        const eventEndDate = new Date(event.end_date)
        eventEndDate.setHours(0, 0, 0, 0)

        return eventStartDate <= selectedDate && selectedDate <= eventEndDate
      })
    }

    setFilteredEvents(result)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setDate(undefined)
  }

  // Group events by upcoming, ongoing, and past
  const now = new Date()
  const upcomingEvents = filteredEvents.filter((event) => new Date(event.start_date) > now)
  const ongoingEvents = filteredEvents.filter(
    (event) => new Date(event.start_date) <= now && new Date(event.end_date) >= now,
  )
  const pastEvents = filteredEvents.filter((event) => new Date(event.end_date) < now)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Events</h1>
        <p className="text-gray-400">Discover workshops, seminars, and other electronics club events.</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events..."
            className="pl-10 bg-gray-900/60 border-white/10 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-white/10 text-white hover:bg-gray-800">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-900 border-white/10">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="bg-gray-900 text-white"
            />
          </PopoverContent>
        </Popover>

        {(searchQuery || date) && (
          <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}

        <Link href="/dashboard/events/new">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </Link>
      </div>

      {/* Events Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="bg-gray-900/60 border border-white/10 p-1">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-gray-800">
            Upcoming
            {upcomingEvents.length > 0 && (
              <Badge className="ml-2 bg-purple-500 hover:bg-purple-600">{upcomingEvents.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ongoing" className="data-[state=active]:bg-gray-800">
            Ongoing
            {ongoingEvents.length > 0 && (
              <Badge className="ml-2 bg-emerald-500 hover:bg-emerald-600">{ongoingEvents.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-gray-800">
            Past Events
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-gray-800">
            Calendar View
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Events */}
        <TabsContent value="upcoming" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-gray-900/60 border-white/10">
                  <CardContent className="p-0">
                    <Skeleton className="h-40 w-full bg-gray-800" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4 bg-gray-800" />
                      <Skeleton className="h-4 w-full bg-gray-800" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-1/3 bg-gray-800" />
                        <Skeleton className="h-4 w-1/3 bg-gray-800" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No Upcoming Events</h3>
              <p>Check back later for new events or create one yourself!</p>
              <Link href="/dashboard/events/new">
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        {/* Ongoing Events */}
        <TabsContent value="ongoing" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="bg-gray-900/60 border-white/10">
                  <CardContent className="p-0">
                    <Skeleton className="h-40 w-full bg-gray-800" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4 bg-gray-800" />
                      <Skeleton className="h-4 w-full bg-gray-800" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-1/3 bg-gray-800" />
                        <Skeleton className="h-4 w-1/3 bg-gray-800" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : ongoingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ongoingEvents.map((event) => (
                <EventCard key={event.id} event={event} isOngoing />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No Ongoing Events</h3>
              <p>There are no events happening right now.</p>
            </div>
          )}
        </TabsContent>

        {/* Past Events */}
        <TabsContent value="past" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-gray-900/60 border-white/10">
                  <CardContent className="p-0">
                    <Skeleton className="h-40 w-full bg-gray-800" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4 bg-gray-800" />
                      <Skeleton className="h-4 w-full bg-gray-800" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-1/3 bg-gray-800" />
                        <Skeleton className="h-4 w-1/3 bg-gray-800" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} isPast />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No Past Events</h3>
              <p>There are no past events to display.</p>
            </div>
          )}
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="mt-6">
          <Card className="bg-gray-900/60 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Calendar View</h2>
              <p className="text-center text-gray-400 py-12">Calendar view will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Define the EventCard component inline to fix the import error
function EventCard({
  event,
  isOngoing = false,
  isPast = false,
}: {
  event: Event
  isOngoing?: boolean
  isPast?: boolean
}) {
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <Link href={`/dashboard/events/${event.id}`}>
      <Card
        className={`h-full bg-gray-900/60 border-white/10 hover:border-purple-500/50 transition-all duration-300 ${
          isOngoing ? "border-l-4 border-l-emerald-500" : isPast ? "opacity-75" : ""
        }`}
      >
        <CardContent className="p-0">
          <div className="relative h-40 w-full bg-gray-800">
            {event.image_url ? (
              <img
                src={event.image_url || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CalendarIcon className="h-16 w-16 text-gray-600" />
              </div>
            )}
            {isOngoing && <Badge className="absolute top-2 right-2 bg-emerald-500">Happening Now</Badge>}
          </div>

          <div className="p-4">
            <h3 className="font-medium text-lg mb-1 line-clamp-1">{event.title}</h3>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{event.description}</p>

            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm text-gray-400">
                <CalendarIcon className="h-4 w-4 mr-2 text-purple-400" />
                <span>
                  {formatDate(startDate)}{" "}
                  {startDate.toDateString() !== endDate.toDateString() && `- ${formatDate(endDate)}`}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2 text-purple-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>
                  {formatTime(startDate)} - {formatTime(endDate)}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                <span>{event.location}</span>
              </div>
              {event.max_participants && (
                <div className="flex items-center text-sm text-gray-400">
                  <Users className="h-4 w-4 mr-2 text-purple-400" />
                  <span>Max Participants: {event.max_participants}</span>
                </div>
              )}
            </div>
          </div>

          <CardFooter className="px-4 py-3 border-t border-gray-800">
            <Button
              variant="ghost"
              className="w-full justify-between text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
            >
              {isPast ? "View Details" : isOngoing ? "Join Now" : "Register"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </Link>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateCompetitionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCompetitionCreated: (competition: any) => void
}

export function CreateCompetitionDialog({ open, onOpenChange, onCompetitionCreated }: CreateCompetitionDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "hackathon",
    category: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    maxTeamSize: 4,
    minTeamSize: 1,
    difficulty: "Intermediate",
    maxParticipants: 100,
    organizer: "Circuit Breaker Club",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const competition = {
      id: Date.now().toString(),
      ...formData,
      status: "upcoming" as const,
      participants: 0,
      prizes: [],
      rules: [],
      requirements: [],
      judges: [],
      tags: [],
    }

    onCompetitionCreated(competition)

    // Reset form
    setFormData({
      title: "",
      description: "",
      type: "hackathon",
      category: "",
      startDate: "",
      endDate: "",
      registrationDeadline: "",
      maxTeamSize: 4,
      minTeamSize: 1,
      difficulty: "Intermediate",
      maxParticipants: 100,
      organizer: "Circuit Breaker Club",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Competition</DialogTitle>
          <DialogDescription>Set up a new competition for the community.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Competition Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                  <SelectItem value="design-challenge">Design Challenge</SelectItem>
                  <SelectItem value="coding-contest">Coding Contest</SelectItem>
                  <SelectItem value="innovation-challenge">Innovation Challenge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
              <Input
                id="registrationDeadline"
                type="date"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData((prev) => ({ ...prev, registrationDeadline: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minTeamSize">Min Team Size *</Label>
              <Input
                id="minTeamSize"
                type="number"
                value={formData.minTeamSize}
                onChange={(e) => setFormData((prev) => ({ ...prev, minTeamSize: Number.parseInt(e.target.value) }))}
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxTeamSize">Max Team Size *</Label>
              <Input
                id="maxTeamSize"
                type="number"
                value={formData.maxTeamSize}
                onChange={(e) => setFormData((prev) => ({ ...prev, maxTeamSize: Number.parseInt(e.target.value) }))}
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants *</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData((prev) => ({ ...prev, maxParticipants: Number.parseInt(e.target.value) }))}
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., IoT, Embedded Systems"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Competition</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

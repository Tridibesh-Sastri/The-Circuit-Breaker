"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface CreateWorkshopDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWorkshopCreated: (workshop: any) => void
}

export function CreateWorkshopDialog({ open, onOpenChange, onWorkshopCreated }: CreateWorkshopDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    date: "",
    time: "",
    duration: 120,
    capacity: 25,
    level: "Beginner",
    category: "",
    location: "",
    certificateEligible: true,
  })
  const [materials, setMaterials] = useState<string[]>([])
  const [prerequisites, setPrerequisites] = useState<string[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [newMaterial, setNewMaterial] = useState("")
  const [newPrerequisite, setNewPrerequisite] = useState("")
  const [newSkill, setNewSkill] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const workshop = {
      id: Date.now().toString(),
      ...formData,
      materials,
      prerequisites,
      skills,
      enrolled: 0,
      status: "upcoming" as const,
    }

    onWorkshopCreated(workshop)

    // Reset form
    setFormData({
      title: "",
      description: "",
      instructor: "",
      date: "",
      time: "",
      duration: 120,
      capacity: 25,
      level: "Beginner",
      category: "",
      location: "",
      certificateEligible: true,
    })
    setMaterials([])
    setPrerequisites([])
    setSkills([])
  }

  const addItem = (
    item: string,
    setItem: (item: string) => void,
    list: string[],
    setList: (list: string[]) => void,
  ) => {
    if (item.trim() && !list.includes(item.trim())) {
      setList([...list, item.trim()])
      setItem("")
    }
  }

  const removeItem = (index: number, list: string[], setList: (list: string[]) => void) => {
    setList(list.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workshop</DialogTitle>
          <DialogDescription>Fill in the details to create a new workshop for the community.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Workshop Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor *</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData((prev) => ({ ...prev, instructor: e.target.value }))}
                required
              />
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

          {/* Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) }))}
                min="30"
                step="30"
                required
              />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, level: value }))}
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
                placeholder="e.g., Microcontrollers, PCB Design"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData((prev) => ({ ...prev, capacity: Number.parseInt(e.target.value) }))}
                min="1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Lab A-101, Online"
              required
            />
          </div>

          {/* Materials */}
          <div className="space-y-2">
            <Label>Required Materials</Label>
            <div className="flex gap-2">
              <Input
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="Add material..."
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), addItem(newMaterial, setNewMaterial, materials, setMaterials))
                }
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem(newMaterial, setNewMaterial, materials, setMaterials)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {materials.map((material, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {material}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem(index, materials, setMaterials)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="space-y-2">
            <Label>Prerequisites</Label>
            <div className="flex gap-2">
              <Input
                value={newPrerequisite}
                onChange={(e) => setNewPrerequisite(e.target.value)}
                placeholder="Add prerequisite..."
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), addItem(newPrerequisite, setNewPrerequisite, prerequisites, setPrerequisites))
                }
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem(newPrerequisite, setNewPrerequisite, prerequisites, setPrerequisites)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {prerequisites.map((prerequisite, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {prerequisite}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeItem(index, prerequisites, setPrerequisites)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills Taught</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill..."
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addItem(newSkill, setNewSkill, skills, setSkills))
                }
              />
              <Button type="button" variant="outline" onClick={() => addItem(newSkill, setNewSkill, skills, setSkills)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem(index, skills, setSkills)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Certificate Eligible */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="certificate"
              checked={formData.certificateEligible}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, certificateEligible: checked as boolean }))
              }
            />
            <Label htmlFor="certificate">Certificate eligible</Label>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Workshop</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { useState, useRef, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface TagInputProps {
  id?: string
  placeholder?: string
  tags: string[]
  setTags: (tags: string[]) => void
  maxTags?: number
  className?: string
}

export function TagInput({ id, placeholder = "Add tags...", tags, setTags, maxTags = 10, className }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue.trim())
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().replace(/\s+/g, "-")

    if (normalizedTag && !tags.includes(normalizedTag) && tags.length < maxTags) {
      setTags([...tags, normalizedTag])
      setInputValue("")
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div
      className={`flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background ${className}`}
      onClick={handleContainerClick}
    >
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="gap-1">
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              removeTag(index)
            }}
            className="rounded-full p-0.5 hover:bg-muted"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {tag}</span>
          </button>
        </Badge>
      ))}

      <Input
        ref={inputRef}
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="h-auto flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  )
}

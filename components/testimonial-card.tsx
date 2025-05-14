import Image from "next/image"
import { Quote } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  avatar: string
}

export function TestimonialCard({ quote, name, role, avatar }: TestimonialCardProps) {
  return (
    <Card className="bg-gray-900/60 border-white/10 hover:border-emerald-500/50 transition-all duration-300 h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <Quote className="h-6 w-6 text-emerald-500 mb-4" />
        <p className="text-gray-300 italic">{quote}</p>
      </CardContent>
      <CardFooter className="flex items-center gap-4">
        <div className="relative h-12 w-12 rounded-full overflow-hidden">
          <Image src={avatar || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </CardFooter>
    </Card>
  )
}

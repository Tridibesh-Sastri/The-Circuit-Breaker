import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Category {
  id: string
  name: string
  count: number
}

interface Tag {
  id: string
  name: string
  count: number
}

interface ForumCategoriesProps {
  categories: Category[]
  popularTags: Tag[]
}

export function ForumCategories({ categories, popularTags }: ForumCategoriesProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex justify-between">
                <Link href={`/dashboard/forum/category/${category.id}`} className="text-sm hover:underline">
                  {category.name}
                </Link>
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link key={tag.id} href={`/dashboard/forum/tag/${tag.name}`}>
                <Badge variant="outline" className="cursor-pointer">
                  {tag.name}
                  <span className="ml-1 text-xs text-muted-foreground">({tag.count})</span>
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

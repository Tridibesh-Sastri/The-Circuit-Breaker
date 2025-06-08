"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface ApprovalItem {
  id: string
  title?: string
  submittedBy: string
  submittedAt: string
  type: "project" | "resource" | "role"
  user?: string
  currentRole?: string
  requestedRole?: string
}

interface PendingApprovalsProps {
  pendingApprovals: {
    projects: ApprovalItem[]
    resources: ApprovalItem[]
    roleRequests: ApprovalItem[]
  }
}

export function PendingApprovals({ pendingApprovals }: PendingApprovalsProps) {
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [feedback, setFeedback] = useState("")

  const handleApprove = (item: ApprovalItem) => {
    setSelectedItem(item)
    setIsApproveDialogOpen(true)
  }

  const handleReject = (item: ApprovalItem) => {
    setSelectedItem(item)
    setIsRejectDialogOpen(true)
  }

  const confirmApprove = () => {
    // In a real application, this would call an API to approve the item
    toast({
      title: "Item approved",
      description: `You have approved ${getItemTitle(selectedItem)}`,
    })
    setIsApproveDialogOpen(false)
    setFeedback("")
  }

  const confirmReject = () => {
    // In a real application, this would call an API to reject the item
    toast({
      title: "Item rejected",
      description: `You have rejected ${getItemTitle(selectedItem)}`,
    })
    setIsRejectDialogOpen(false)
    setFeedback("")
  }

  const getItemTitle = (item: ApprovalItem | null) => {
    if (!item) return ""

    if (item.type === "role") {
      return `${item.user}'s request for ${item.requestedRole} role`
    }

    return item.title || ""
  }

  const renderApprovalTable = (items: ApprovalItem[], type: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{type === "role" ? "User" : "Title"}</TableHead>
          <TableHead>{type === "role" ? "Requested Role" : "Submitted By"}</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
              No pending {type} approvals
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{type === "role" ? item.user : item.title}</TableCell>
              <TableCell>
                {type === "role" ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {item.requestedRole}
                  </Badge>
                ) : (
                  item.submittedBy
                )}
              </TableCell>
              <TableCell>{formatDistanceToNow(new Date(item.submittedAt), { addSuffix: true })}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                    onClick={() => handleApprove(item)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleReject(item)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Review and manage pending submissions and requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="projects" className="space-y-4">
            <TabsList>
              <TabsTrigger value="projects">
                Projects
                {pendingApprovals.projects.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {pendingApprovals.projects.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="resources">
                Resources
                {pendingApprovals.resources.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {pendingApprovals.resources.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="roles">
                Role Requests
                {pendingApprovals.roleRequests.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {pendingApprovals.roleRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="projects">
              <div className="rounded-md border">{renderApprovalTable(pendingApprovals.projects, "project")}</div>
            </TabsContent>
            <TabsContent value="resources">
              <div className="rounded-md border">{renderApprovalTable(pendingApprovals.resources, "resource")}</div>
            </TabsContent>
            <TabsContent value="roles">
              <div className="rounded-md border">{renderApprovalTable(pendingApprovals.roleRequests, "role")}</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Item</DialogTitle>
            <DialogDescription>Are you sure you want to approve {getItemTitle(selectedItem)}?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="feedback" className="text-sm font-medium">
                Feedback (optional)
              </label>
              <Textarea
                id="feedback"
                placeholder="Add any comments or feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Item</DialogTitle>
            <DialogDescription>Are you sure you want to reject {getItemTitle(selectedItem)}?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="reject-feedback" className="text-sm font-medium">
                Feedback <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="reject-feedback"
                placeholder="Please provide a reason for rejection..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReject} variant="destructive" disabled={!feedback.trim()}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

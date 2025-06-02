import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeamMemberCard } from "./team-member-card"

interface TeamMember {
  name: string
  designation: string
  branch: string
  year: string
  email?: string
}

interface TeamStructureProps {
  advisors: TeamMember[]
  foundingMembers: TeamMember[]
  coreMembers: TeamMember[]
  projectTeam: TeamMember[]
  academicsTeam: TeamMember[]
  eventTeam: TeamMember[]
  mediaTeam: TeamMember[]
}

export function TeamStructure({
  advisors,
  foundingMembers,
  coreMembers,
  projectTeam,
  academicsTeam,
  eventTeam,
  mediaTeam,
}: TeamStructureProps) {
  const renderTeamSection = (title: string, members: TeamMember[]) => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <TeamMemberCard
              key={index}
              name={member.name}
              designation={member.designation}
              branch={member.branch}
              year={member.year}
              email={member.email}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {renderTeamSection("Student Advisors", advisors)}
      {renderTeamSection("Founding Members", foundingMembers)}
      {renderTeamSection("Core Members", coreMembers)}
      {renderTeamSection("Hardware & Project Team", projectTeam)}
      {renderTeamSection("Academics Team", academicsTeam)}
      {renderTeamSection("Event Management Team", eventTeam)}
      {renderTeamSection("Media & Outreach Team", mediaTeam)}
    </div>
  )
}

import type { Metadata } from "next"
import { MissionVision } from "@/components/about/mission-vision"
import { ClubHistory } from "@/components/about/club-history"
import { ContactInfo } from "@/components/about/contact-info"
import { TeamStructure } from "@/components/about/team-structure"

export const metadata: Metadata = {
  title: "About Us | The Circuit Breaker",
  description: "Learn about The Circuit Breaker Electronics Club, our mission, vision, team, and history.",
}

export default function AboutPage() {
  // Team members data from the provided information
  const advisors = [
    {
      name: "Md.Usman",
      designation: "Student Advisor",
      branch: "ECE",
      year: "3rd",
      email: "ece.20212046@gmail.com",
    },
    {
      name: "Warish Ali",
      designation: "Student Advisor",
      branch: "ECE",
      year: "3rd",
      email: "warishali7777@gmail.com",
    },
  ]

  const foundingMembers = [
    {
      name: "Shivam Kumar",
      designation: "Founding Member cum President",
      branch: "ECE",
      year: "3rd",
      email: "infoaboutjh@gmail.com",
    },
    {
      name: "Sumyadip Mondal",
      designation: "Founding Member Cum General Secretary",
      branch: "ECE",
      year: "3rd",
      email: "goobloomondal@gmail.com",
    },
    {
      name: "Pratim Das",
      designation: "Founding Member Cum Academic Lead",
      branch: "ECE",
      year: "3rd",
      email: "dpratim9@gmail.com",
    },
    {
      name: "Tridibesh Sastri",
      designation: "Founding Member Cum Project & Hardware Lead",
      branch: "ECE",
      year: "3rd",
      email: "tridibeshs30@gmail.com",
    },
  ]

  const coreMembers = [
    {
      name: "Aishik Paul",
      designation: "Executive Member",
      branch: "ECE",
      year: "3rd",
    },
    {
      name: "Rupam Roy",
      designation: "Executive Member",
      branch: "ECE",
      year: "3rd",
    },
    {
      name: "Sayan Dey",
      designation: "Executive Member",
      branch: "ECE",
      year: "3rd",
    },
  ]

  const projectTeam = [
    {
      name: "Tridibesh Sastri",
      designation: "Project Lead",
      branch: "ECE",
      year: "3rd",
    },
    {
      name: "Suman Kapri",
      designation: "Project Associate",
      branch: "ECE",
      year: "2nd",
    },
  ]

  const academicsTeam = [
    {
      name: "Pratim Das",
      designation: "Academic Lead",
      branch: "ECE",
      year: "3rd",
    },
    {
      name: "Tuhin Ghoshal",
      designation: "Executive Member",
      branch: "ECE",
      year: "3rd",
    },
    {
      name: "Kaushik Saha",
      designation: "Executive Member",
      branch: "ECE",
      year: "3rd",
    },
    {
      name: "Deeptangshu Ghosh",
      designation: "Executive Member",
      branch: "ECE",
      year: "2nd",
    },
    {
      name: "Suman Kapri",
      designation: "Executive Member",
      branch: "ECE",
      year: "2nd",
    },
    {
      name: "Souvik Das",
      designation: "Executive Member",
      branch: "ECE",
      year: "2nd",
    },
    {
      name: "Sushovan Das",
      designation: "Executive Member",
      branch: "ECE",
      year: "1st",
    },
  ]

  const eventTeam = [
    {
      name: "Asutosh Kumar Hrittik",
      designation: "Event Management Lead",
      branch: "ECE",
      year: "3rd",
    },
    {
      name: "Prince Kumar",
      designation: "Sponsor & Collaboration Lead",
      branch: "ECE",
      year: "3rd",
    },
    {
      name: "Golu Kumar",
      designation: "Executive Member",
      branch: "ECE",
      year: "3rd",
    },
    {
      name: "Arko Mondal",
      designation: "Executive Member",
      branch: "ECE",
      year: "2nd",
    },
    {
      name: "Subha Guchhait",
      designation: "Executive Member",
      branch: "ECE",
      year: "2nd",
    },
  ]

  const mediaTeam = [
    {
      name: "Azad Kumar",
      designation: "Design Lead",
      branch: "ECE",
      year: "3rd",
    },
    {
      name: "Subhrata Singha",
      designation: "Media Lead",
      branch: "ECE",
      year: "3rd",
    },
    {
      name: "Payal Samaddar",
      designation: "PR Lead",
      branch: "ECE",
      year: "3rd",
    },
    {
      name: "Santanu Datta",
      designation: "Executive Member",
      branch: "ECE",
      year: "2nd",
    },
    {
      name: "Snehal Banerjee",
      designation: "Executive Member",
      branch: "AEIE",
      year: "2nd",
    },
    {
      name: "Adrika Upadhyay",
      designation: "Executive Member",
      branch: "ECE",
      year: "2nd",
    },
    {
      name: "Sajal Saha",
      designation: "Executive Member",
      branch: "ECE",
      year: "2nd",
    },
    {
      name: "Dipanwita Biswas",
      designation: "Executive Member",
      branch: "IT",
      year: "1st",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">About The Circuit Breaker</h1>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Our Mission, Vision & Values</h2>
        <MissionVision />
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Our History</h2>
        <ClubHistory />
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Our Team</h2>
        <TeamStructure
          advisors={advisors}
          foundingMembers={foundingMembers}
          coreMembers={coreMembers}
          projectTeam={projectTeam}
          academicsTeam={academicsTeam}
          eventTeam={eventTeam}
          mediaTeam={mediaTeam}
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Contact Us</h2>
        <ContactInfo />
      </section>
    </div>
  )
}

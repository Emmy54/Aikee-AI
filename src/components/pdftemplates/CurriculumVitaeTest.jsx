import React from "react";
import CurriculumVitae from "./CurriculumVitae";

export default function CurriculumVitaeTest() {
  const sampleData = {
    name: "John Doe",
    jobTitle: "Full Stack Developer",
    summary: "Experienced developer with 5+ years building web applications using React, Node.js, and modern tools.",
    phone: "+1-555-0123",
    email: "john.doe@example.com",
    website: "johndoe.dev",
    address: "San Francisco, CA 94105",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    skills: [
      { name: "React", rating: 5, color: "#61DAFB" },
      { name: "JavaScript", rating: 5, color: "#F7DF1E" },
      { name: "Node.js", rating: 4, color: "#339933" },
      { name: "CSS/Tailwind", rating: 4, color: "#06B6D4" },
    ],
    educations: [
      {
        school: "Tech University",
        degree: "Bachelor of Science in Computer Science",
        years: "2015 - 2019",
        dotColor: "bg-green-500",
      },
      {
        school: "Online Academy",
        degree: "Advanced React Developer Certification",
        years: "2020 - 2021",
        dotColor: "bg-blue-500",
      },
    ],
    experiences: [
      {
        company: "TechCorp Inc.",
        location: "San Francisco, CA - 2021 - Present",
        description: "Led development of customer-facing React applications. Improved performance by 40% through optimization.",
        dotColor: "bg-purple-500",
      },
      {
        company: "StartupXYZ",
        location: "Remote - 2019 - 2021",
        description: "Built full-stack web applications using MERN stack. Managed database design and API development.",
        dotColor: "bg-pink-500",
      },
      {
        company: "Tech Junior Ltd.",
        location: "New York, NY - 2018 - 2019",
        description: "Entry-level developer role focusing on front-end development and bug fixes.",
        dotColor: "bg-orange-500",
      },
    ],
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1>CurriculumVitae Component Test</h1>
      <p>Sample CV with test data:</p>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <CurriculumVitae {...sampleData} />
      </div>
    </div>
  );
}

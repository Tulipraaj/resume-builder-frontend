import React from "react";

const ResumeTemplate = ({ resumeData = {} }) => {
  const {
    personalDetails = {},
    objective = "",
    skills = [],
    education = [],
    experience = [],
    projects = [],
    achievements = [],
  } = resumeData;

  return (
    <div className="resume-container">
      <div className="header">
        <h1>{personalDetails.fullName || "Full Name"}</h1>
        <p>
          {personalDetails.phone || "Phone"} | {personalDetails.email || "Email"}
        </p>
        <p>{personalDetails.address || "Address"}</p>
        <p>
          <a href={personalDetails.linkedin || "#"} target="_blank">
            LinkedIn
          </a>
          &nbsp;|&nbsp;
          <a href={personalDetails.github || "#"} target="_blank">
            GitHub
          </a>
        </p>
      </div>

      <section className="section page-break">
        <h2>Objective</h2>
        <p>{objective || "Your objective goes here."}</p>
      </section>

      <section className="section page-break">
        <h2>Education</h2>
        {education.map((edu, index) => (
          <div key={index} className="education-item">
            <p>
              <strong>{edu.institution || "Institution"}</strong> (
              {edu.yearOfGraduation || "Year"})&nbsp;&nbsp;&nbsp;&nbsp;
              <strong>Score: {edu.percentage || "Percentage"}</strong>
            </p>
            <p>{edu.degree || "Degree"}&nbsp;&nbsp;</p>
          </div>
        ))}
      </section>

      <section className="section page-break">
        <h2>Skills</h2>
        <ul>
          {skills.length > 0
            ? skills.map((skill, index) => <li key={index}>{skill}</li>)
            : "Add your skills here."}
        </ul>
      </section>

      <section className="section page-break">
        <h2>Experience</h2>
        {experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <p>
              <strong>
                {exp.jobTitle || "Job Title"} - {exp.companyName || "Company"}{" "}
              </strong>
              ({new Date(exp.startDate || "").toLocaleDateString()} -{" "}
              {new Date(exp.endDate || "").toLocaleDateString()})
            </p>
            <p>{exp.description || "Description of your role."}</p>
          </div>
        ))}
      </section>

      <section className="section no-page-break">
        <h2>Projects</h2>
        {projects.map((proj, index) => (
          <div key={index} className="project-item">
            <p>
              <strong>{proj.projName || "Project Name"}</strong>
            </p>
            <p>{proj.projDescription || "Project description goes here."}</p>
          </div>
        ))}
      </section>

      <section className="section page-break">
        <h2>Achievements</h2>
        <ul>
          {achievements.length > 0
            ? achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))
            : "Add your achievements here."}
        </ul>
      </section>
    </div>
  );
};

export default ResumeTemplate;

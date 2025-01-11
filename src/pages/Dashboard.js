import React, {useState, useEffect} from 'react';
import axios from "axios"
import "../styles/dashboard.css"
import {jwtDecode} from "jwt-decode"
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie"

function Dashboard(){
  const [resumeData, setResumeData] = useState({
    personalDetails: { name: "", email: "", phone: "", address: "", linkedin: "", github: "" },
    objective: {},
    skills: [""], 
    education: [{ degree: "", institution: "", yearOfGraduation: "", percentage: "" }],
    experience: [{ jobTitle: "", companyName: "", startDate: "", endDate: "", description: "" },],
    projects: [{ projName: "", projDescription: "" }],
    achievements: [""],
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [authProvider, setAuthProvider] = useState("local");

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch user details first
        const userResponse = await axios.get(`https://resume-builder-backend-topaz.vercel.app/api/users/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = userResponse.data;
        setUserName(userData.name);
        setUserEmail(userData.email);
        setAuthProvider(userData.authProvider || 'local');

        // Pre-fill personal details if this is an OAuth user and no resume exists yet
        if (userData.authProvider === 'google') {
          setResumeData(prevData => ({
            ...prevData,
            personalDetails: {
              ...prevData.personalDetails,
              fullName: userData.name || prevData.personalDetails.fullName,
              email: userData.email || prevData.personalDetails.email,
            }
          }));
        }

        // Fetch resume details
        const resumeDetails = await axios.get(
          `https://resume-builder-backend-topaz.vercel.app/api/resumes/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}`}
          }
        );

        if (resumeDetails.data) {
          const resume = resumeDetails.data;
          
          // Normalize dates in the "experience" array
          const normalizedExperience = resume.experience.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? exp.startDate.split('T')[0] : "",
            endDate: exp.endDate ? exp.endDate.split('T')[0] : "",
          }));
      
          setResumeData({
            ...resume,
            experience: normalizedExperience,
          });
        }

      } catch (error) {
        console.error("Error fetching user details:", error);
        if (error.response?.status === 404) {
          console.log("No existing resume found");
        } else {
          setError("Error loading user data. Please try again later.");
        }
      }
    };

    fetchUserDetails();
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setResumeData((prevData) => ({
      ...prevData,
      personalDetails: {
        ...prevData.personalDetails,
        [name] : value,
      },
    }));
  };

  const handleObjective = (e) => {
    const { name, value } = e.target
    setResumeData((prevData) => ({
      ...prevData,
      [name] : value,
    }))
  }

  const handleAdd = (arrayName, newValue) => {
    setResumeData((prevData) => ({
      ...prevData,
      [arrayName]: [...prevData[arrayName], newValue],
    }));
  };
  
  const handleArrayChange = (e, arrayName, index, fieldName) => {
    if (!resumeData[arrayName] || !Array.isArray(resumeData[arrayName])) {
      console.error(`Invalid arrayName: ${arrayName}`);
      return;
    }
  
    const updatedArray = [...resumeData[arrayName]];
  
    // Check if it's an array of strings (e.g., achievements)
    if (typeof updatedArray[index] === "string" && !fieldName) {
      updatedArray[index] = e.target.value; // Directly update the string
    } else if (fieldName) {
      updatedArray[index][fieldName] = e.target.value; // Update an object property
    } else {
      console.error(`Invalid operation for array: ${arrayName}`);
      return;
    }
  
    setResumeData({ ...resumeData, [arrayName]: updatedArray });
  };
  
  const handleRemove = (arrayName, index) => {
    const updatedArray = resumeData[arrayName].filter((_, i) => i !== index);
    setResumeData({ ...resumeData, [arrayName]: updatedArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const payload = {...resumeData, userId}

      const response = await axios.post(
        "https://resume-builder-backend-topaz.vercel.app/api/resumes/create-or-update",
        payload,
        {
          headers : {
            Authorization: `Bearer ${token}`
          },
        }
      )
      setMessage('Resume saved successfully');
    } catch(err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save resume details");
    }
  };

  const navigate = useNavigate();

  const handleChooseTemplate = () => {
    Cookies.set("resumeData", JSON.stringify(resumeData));
    navigate("/choose-template");
  }

  return(
    <div className='dashboard-container'>
      <h1>Dashboard</h1>
      <h2>Welcome, {userName}!</h2>
      {authProvider === 'google' && (
        <p className="oauth-notice">Signed in with Google</p>
      )}
      <form onSubmit={handleSubmit} className="resume-form">
        <div className='form-group'>
          <label htmlFor="fullName">Full Name</label>
          <input 
            type='text'
            id='fullName'
            name='fullName'
            placeholder='Enter your Full Name'
            value={resumeData.personalDetails.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor="email">Email</label>
          <input 
            type='text'
            id='email'
            name='email'
            placeholder='Enter your Email Id'
            value={resumeData.personalDetails.email || userEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor="phone">Phone</label>
          <input 
            type='text'
            id='phone'
            name='phone'
            placeholder='Enter your Phone number'
            value={resumeData.personalDetails.phone || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor="address">Address</label>
          <input 
            type='text'
            id='address'
            name='address'
            placeholder='Enter your Address'
            value={resumeData.personalDetails.address || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor="linkedin">LinkedIn</label>
          <input 
            type='text'
            id='linkedin'
            name='linkedin'
            placeholder='Enter your LinkedIn Profile URL'
            value={resumeData.personalDetails.linkedin || ""}
            onChange={handleChange}
          />
        </div>

        <div className='form-group'>
          <label htmlFor="github">GitHub</label>
          <input 
            type='text'
            id='github'
            name='github'
            placeholder='Enter your GitHub Profile URL'
            value={resumeData.personalDetails.github || ""}
            onChange={handleChange}
          />
        </div>

        <div className='form-group'>
          <label htmlFor="objective">Objective</label>
          <input 
            type='text'
            id='objective'
            name='objective'
            placeholder='Enter your Objective'
            value={resumeData.objective || ""}
            onChange={handleObjective}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='education'>Education</label>
          {resumeData.education.map((edu, index) => (
            <div key={index} className='array-field'>
              <div>
                <label htmlFor="degree">Degree</label>
                <input 
                  type='text'
                  value={edu.degree}
                  onChange={(e) => handleArrayChange(e, "education", index, "degree")}
                  placeholder='Degree'
                  required
                />

                <label htmlFor="Institution">Institution</label>
                <input 
                  type='text'
                  value={edu.institution}
                  onChange={(e) => handleArrayChange(e, "education", index, "institution")}
                  placeholder='Institution'
                  required
                />

                <label htmlFor="Year of Graduation">Year of Graduation</label>
                <input 
                  type='text'
                  value={edu.yearOfGraduation}
                  onChange={(e) => handleArrayChange(e, "education", index, "yearOfGraduation")}
                  placeholder='Year of Graduation'
                  required
                />

                <label htmlFor="Percentage">Percentage</label>
                <input 
                  type='text'
                  value={edu.percentage}
                  onChange={(e) => handleArrayChange(e, "education", index, "percentage")}
                  placeholder='Percentage'
                  required
                />

                <button className="remove-button" type='button' onClick={() => handleRemove("education", index)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button className="add-button" type='button' onClick={() => handleAdd("education", {degree: "", institution: "", yearOfGraduation:""})}>
            Add Education
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="achievements">Skills</label>
          {resumeData.skills.map((skill, index) => (
            <div key={index} className="array-field">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleArrayChange(e, "skills", index)}
                placeholder="Skill"
                required
              />
              <button className="remove-button" type="button" onClick={() => handleRemove("skills", index)}>
                Remove
              </button>
            </div>
          ))}
          <button className="add-button" type="button" onClick={() => handleAdd("skills", "")}>
            Add Skill
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience</label>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="array-field">
              <label htmlFor="Jobtitle">Job Title</label> 
              <input
                type="text"
                value={exp.jobTitle}
                onChange={(e) => handleArrayChange(e, "experience", index, "jobTitle")}
                placeholder="Job Title"
                required
              />

              <label htmlFor="companyname">Company Name</label>
              <input
                type="text"
                value={exp.companyName}
                onChange={(e) => handleArrayChange(e, "experience", index, "companyName")}
                placeholder="Company Name"
                required
              />

              <label htmlFor="startdate">Start Date</label>
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) => handleArrayChange(e, "experience", index, "startDate")}
                required
              />

              <label htmlFor="enddate">End Date</label>
              <input
                type="date"
                value={exp.endDate}
                onChange={(e) => handleArrayChange(e, "experience", index, "endDate")}
                required
              />

              <label htmlFor="description">Description</label>
              <textarea
                value={exp.description}
                onChange={(e) => handleArrayChange(e, "experience", index, "description")}
                placeholder="Description"
                required
              />
              <button className="remove-button" type="button" onClick={() => handleRemove("experience", index)}>
                Remove
              </button>
            </div>
          ))}
          <button className="add-button" type="button" onClick={() => handleAdd("experience", { jobTitle: "", companyName: "", startDate: "", endDate: "", description: "" })}>
            Add Experience
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="projects">Projects</label>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="array-field">
              <label htmlFor="projtitle">Project Title</label>
              <input
                type="text"
                value={project.projName}
                onChange={(e) => handleArrayChange(e, "projects", index, "projName")}
                placeholder="Project Title"
                required
              />

              <label htmlFor="projdescription">Project Description</label>
              <textarea
                value={project.projDescription}
                onChange={(e) => handleArrayChange(e, "projects", index, "projDescription")}
                placeholder="Project Description"
                required
              />
              <button className="remove-button" type="button" onClick={() => handleRemove("projects", index)}>
                Remove
              </button>
            </div>
          ))}
          <button className="add-button" type="button" onClick={() => handleAdd("projects", { projName: "", projDescription: "" })}>
            Add Project
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="achievements">Achievements</label>
          {resumeData.achievements.map((achievement, index) => (
            <div key={index} className="array-field">
              <input
                type="text"
                value={achievement}
                onChange={(e) => handleArrayChange(e, "achievements", index)}
                placeholder="Achievement"
                required
              />
              <button className="remove-button" type="button" onClick={() => handleRemove("achievements", index)}>
                Remove
              </button>
            </div>
          ))}
          <button className="add-button" type="button" onClick={() => handleAdd("achievements", "")}>
            Add Achievement
          </button>
        </div>

        <div className="form-actions">
          <button className="save-button" type="submit">Save Resume</button>
          <button className="save-button" onClick={handleChooseTemplate} type="button">Choose Template</button>
        </div>
      </form>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}
    </div>
  );
}

export default Dashboard;
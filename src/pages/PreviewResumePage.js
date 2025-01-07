import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import ResumeTemplate from "../components/ResumeTemplate"; // Import the ResumeTemplate component
import { PDFExport } from "@progress/kendo-react-pdf"; // Import PDFExport
import "../styles/previewresume.css";

function PreviewResumePage() {
  const [resumeData, setResumeData] = useState(null);
  const pdfExportComponent = useRef(); // Reference to PDFExport component

  useEffect(() => {
    const storedResumeData = Cookies.get("resumeData");
    if (storedResumeData) {
      setResumeData(JSON.parse(storedResumeData));
    }
  }, []); // Empty dependency array to ensure this runs only once after the initial render

  const generatePDF = () => {
    // Trigger the save method of PDFExport only when the user clicks the button
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save(); // Trigger the save method to generate and download the PDF
    }
  };

  return (
    <div>
      {/* PDFExport component wrapping ResumeTemplate */}
      <PDFExport ref={pdfExportComponent} paperSize="A4" margin={0} fileName="Resume.pdf">
        {/* Render ResumeTemplate inside the PDFExport component */}
        {resumeData ? (
          <ResumeTemplate resumeData={resumeData} />
        ) : (
          <p>Loading resume data...</p>
        )}
      </PDFExport>

      {/* Button to trigger PDF generation */}
      <button className="download-button" onClick={generatePDF}>
        Download as PDF
      </button>
    </div>
  );
}

export default PreviewResumePage;

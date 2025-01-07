import "../styles/choosetemplate.css";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ChooseTemplatePage() {
    const [resumeData, setResumeData] = useState(null);

    useEffect(() => {
        const storedData = Cookies.get("resumeData");
        if (storedData) {
            setResumeData(JSON.parse(storedData));
        }
    }, []);

    const navigate = useNavigate();
    const handleTemplateSelection = (template) => {
        const updatedData = { ...resumeData, template };
        Cookies.set("resumeData", JSON.stringify(updatedData));
        navigate("/preview-resume");
    };

    return (
        <div className="choose-template-container">
            <h1>Choose a template</h1>
            {resumeData && <p>Welcome, {resumeData.personalDetails.fullName}</p>}
            <button onClick={() => handleTemplateSelection("default-template")}>
                Select Default Template
            </button>
        </div>
    );
}

export default ChooseTemplatePage;

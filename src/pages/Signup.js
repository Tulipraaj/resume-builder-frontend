import React, {useState} from 'react';
import axios from "axios"
import "../styles/signup.css"
import { useNavigate } from 'react-router-dom';

function Signup(){
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confpass: ''
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const [error, setError] = useState("")

    const navigate = useNavigate()
    const handleSubmit = async(e) => {
        e.preventDefault()

        if(formData.password !== formData.confpass) {
            setError("Passwords do not match!")
            return;
        }

        setError("")
        try {
            const result = await axios.post("https://resume-builder-backend-eta.vercel.app/api/users/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            })

            alert(result.data.message)
            if (result){
                navigate('/')
            }
        } catch (error) {
            console.error(error);
            setError("Error registering user. Please try again")
            
        }
    }

    return(
        <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
            <h1 className="signup-title">Sign Up</h1>
            <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="confirmpassword">Confirm Password</label>
                <input
                    type="password"
                    id="confirmpassword"
                    name="confpass"
                    placeholder="Confirm your password"
                    value={formData.confpass}
                    onChange={handleChange}
                    required
                />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="signup-button">Register</button>
        </form>
    </div>
    )
};

export default Signup;

import React, { useState } from 'react';
import axios from 'axios';
import "../styles/signup.css"; 
import {useNavigate} from "react-router-dom"

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(""); 
        try {
            const result = await axios.post("https://resume-builder-backend-eta.vercel.app/api/users/login", {
                email: formData.email,
                password: formData.password,
            });

            alert(result.data.message); 
            localStorage.setItem("token", result.data.token); 
            if(result){
              navigate("/dashboard")
            }
        } catch (error) {
            console.error(error);
            setError("Error logging in. Please try again.");
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h1 className="signup-title">Login</h1>
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

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="signup-button">Login</button>
            </form>
        </div>
    );
}

export default Login;

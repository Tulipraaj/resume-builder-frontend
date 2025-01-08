import React, { useState, useEffect } from 'react';
import axios from "axios";
import "../styles/signup.css";
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confpass: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Load Google's OAuth script
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: "1082362001839-nt2rhkjd4adjsjbjnmf7n18spib12fj4.apps.googleusercontent.com",
                callback: handleGoogleCallback
            });

            window.google.accounts.id.renderButton(
                document.getElementById("googleSignUpDiv"),
                { 
                    theme: "outline", 
                    size: "large", 
                    width: "100%",
                    text: "signup_with" 
                }
            );
        };

        return () => {
            // Cleanup
            const scriptElement = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (scriptElement) {
                document.body.removeChild(scriptElement);
            }
        };
    }, []);

    const handleGoogleCallback = async (response) => {
        try {
            const result = await axios.post("https://resume-builder-backend-eta.vercel.app/api/users/google-login", {
                token: response.credential
            });

            alert(result.data.message);
            localStorage.setItem("token", result.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setError("Error signing up with Google. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confpass) {
            setError("Passwords do not match!");
            return;
        }

        setError("");
        try {
            const result = await axios.post("https://resume-builder-backend-eta.vercel.app/api/users/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            alert(result.data.message);
            if (result.data.token) {
                localStorage.setItem("token", result.data.token);
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Error registering user. Please try again");
        }
    }

    return (
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

                <div className="oauth-separator">
                    <span>OR</span>
                </div>

                <div id="googleSignUpDiv"></div>
            </form>
        </div>
    )
};

export default Signup;
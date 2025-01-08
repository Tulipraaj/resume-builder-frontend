import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/signup.css";
import { useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

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
                client_id: '1082362001839-nt2rhkjd4adjsjbjnmf7n18spib12fj4.apps.googleusercontent.com', // Replace with your Google Client ID
                callback: handleGoogleCallback
            });

            window.google.accounts.id.renderButton(
                document.getElementById("googleSignInDiv"),
                { theme: "outline", size: "large", width: "100%" }
            );
        };

        return () => {
            // Cleanup
            document.body.removeChild(script);
        };
    }, []);

    const handleGoogleCallback = async (response) => {
        try {
            // Send the ID token to your backend
            const result = await axios.post("https://resume-builder-backend-eta.vercel.app/api/users/google-login", {
                token: response.credential
            });

            alert(result.data.message);
            localStorage.setItem("token", result.data.token);
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setError("Error logging in with Google. Please try again.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
            if (result) {
                navigate("/dashboard");
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
                
                <div className="oauth-separator">
                    <span>OR</span>
                </div>

                <div id="googleSignInDiv"></div>
            </form>
        </div>
    );
}

export default Login;
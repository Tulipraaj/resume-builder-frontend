import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/signup.css";
import { useNavigate } from "react-router-dom";

// Create an Axios instance with a default timeout
const axiosInstance = axios.create({
    baseURL: "https://resume-builder-backend-topaz.vercel.app/api", // Base URL for your API
    timeout: 30000, // 10 seconds timeout
});

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const initializeGoogleAuth = () => {
            const script = document.createElement('script');
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                try {
                    window.google.accounts.id.initialize({
                        client_id: '1082362001839-nt2rhkjd4adjsjbjnmf7n18spib12fj4.apps.googleusercontent.com',
                        callback: handleGoogleCallback,
                        ux_mode: 'popup',
                        auto_select: false,
                        context: 'signin',
                    });

                    window.google.accounts.id.renderButton(
                        document.getElementById("googleSignInDiv"),
                        { 
                            theme: "outline", 
                            size: "large", 
                            width: "100%",
                            text: "signin_with",
                            shape: "rectangular",
                        }
                    );
                } catch (error) {
                    console.error('Error initializing Google Sign-In:', error);
                    setError("Failed to initialize Google Sign-In. Please try again later.");
                }
            };

            script.onerror = () => {
                setError("Failed to load Google Sign-In. Please check your internet connection.");
            };

            document.body.appendChild(script);
            return () => {
                const scriptElement = document.querySelector(`script[src="${script.src}"]`);
                if (scriptElement) document.body.removeChild(scriptElement);
            };
        };

        initializeGoogleAuth();
    }, []);

    const handleGoogleCallback = async (response) => {
        setIsLoading(true);
        setError("");
        
        try {
            const result = await axiosInstance.post("/users/google-login", {
                token: response.credential,
            });

            if (result.data.token) {
                localStorage.setItem("token", result.data.token);
                navigate("/dashboard");
            } else {
                throw new Error("No token received from server");
            }
        } catch (error) {
            console.error('Google login error:', error);
            setError(error.response?.data?.message || "Error logging in with Google. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); // Clear error when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await axiosInstance.post("/users/login", {
                email: formData.email,
                password: formData.password,
            });

            if (result.data.token) {
                localStorage.setItem("token", result.data.token);
                navigate("/dashboard");
            } else {
                throw new Error("No token received from server");
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || "Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button 
                    type="submit" 
                    className="signup-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                
                <div className="oauth-separator">
                    <span>OR</span>
                </div>

                <div id="googleSignInDiv"></div>
            </form>
        </div>
    );
}

export default Login;

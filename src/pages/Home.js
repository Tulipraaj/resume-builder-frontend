import React from 'react';
import {Link} from "react-router-dom";
import "../styles/home.css"

function Home(){
    return (
        <div className="home-container">
            <h1 className="home-title">Ace your Resume</h1>
            <p className="home-subtitle">Create professional resumes in just a few clicks!</p>

            <div className="home-buttons">
                <Link to="/login" className="home-button">Login</Link>
                <Link to="/signup" className="home-button">Sign Up</Link>
            </div>
        </div>
    )
};

export default Home;

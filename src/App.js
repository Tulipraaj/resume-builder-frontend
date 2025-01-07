import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ChooseTemplatePage from './pages/ChooseTemplatePage'; 
import PreviewResumePage from './pages/PreviewResumePage';;

function App() {
        return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/choose-template" element={<ChooseTemplatePage />} />
                <Route path="/preview-resume" element={<PreviewResumePage />} />
            </Routes>
        </Router>
    );
}

export default App;

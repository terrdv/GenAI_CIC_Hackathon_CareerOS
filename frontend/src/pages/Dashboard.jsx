import React from 'react';
import '../css/Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h2>Welcome to CareerOS Dashboard</h2>
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Skills Assessment</h3>
                    <p>Evaluate your current skill set</p>
                </div>
                <div className="dashboard-card">
                    <h3>Job Recommendations</h3>
                    <p>Discover opportunities that match your profile</p>
                </div>
                <div className="dashboard-card">
                    <h3>Mock Interview Progress</h3>
                    <p>Past Interview Stats</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
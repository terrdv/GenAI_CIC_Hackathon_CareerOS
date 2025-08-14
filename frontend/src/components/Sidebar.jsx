import React from 'react';
import { BarChart3, Users, FileText } from 'lucide-react';
import '../css/Sidebar.css';

const Sidebar = ({ currentPage, onPageChange }) => {
    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'interviews', label: 'Interviews', icon: Users },
        { id: 'resume-analysis', label: 'Resume Analysis', icon: FileText },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1>CareerOS</h1>
            </div>
            <nav className="sidebar-nav">
                {sidebarItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onPageChange(item.id)}
                            className={`sidebar-button ${currentPage === item.id ? 'active' : ''}`}
                        >
                            <Icon />
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;

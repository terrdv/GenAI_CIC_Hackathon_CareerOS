import React from 'react';
import { BarChart3, Users } from 'lucide-react';
import '../css/Sidebar.css'

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'interviews', label: 'Interviews', icon: Users }
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">CareerOS</h1>
      </div>
      <nav className="mt-6">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
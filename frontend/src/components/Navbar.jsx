import React from 'react';


const Navbar = ({ currentPage }) => {
  const getPageTitle = (page) => {
    switch (page) {
      case 'dashboard':
        return 'Dashboard';
      case 'interviews':
        return 'Interviews';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {getPageTitle(currentPage)}
        </h2>
      </div>
    </div>
  );
};

export default Navbar;
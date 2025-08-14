import React from 'react';
import { Code, Database } from 'lucide-react';

const JobCard = ({ job, index, animateCards }) => {
  const IconComponent = job.icon;
  
  return (
    <div 
      className={`job-card ${animateCards ? 'animate-in' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="job-header">
        <div className={`job-icon ${job.color}`}>
          <IconComponent size={20} />
        </div>
      </div>
      <div className="job-content">
        <h3 className="job-title">{job.title}</h3>
      </div>
    </div>
  );
};

export default JobCard;

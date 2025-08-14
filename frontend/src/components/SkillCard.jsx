import React from 'react';
import { Code, Database } from 'lucide-react';

const SkillCard = ({ skill, index, animateCards }) => {
  const IconComponent = Code;
  
  return (
    <div 
      key={skill.id}
      className={`skill-card ${animateCards ? 'animate-in' : ''}`}
      style={{ animationDelay: `${400 + index * 100}ms` }}
    >
      <div className="skill-header">
        <div className={`skill-icon blue`}>
          <IconComponent size={20} />
        </div>
        <div className="skill-info">
          <h3 className="skill-name">{skill.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;

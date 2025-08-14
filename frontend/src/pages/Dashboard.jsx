import React, { useState, useEffect } from 'react';
import {
 TrendingUp,
 Users,
 FileText,
 Target,
 Award,
 Calendar,
 CheckCircle,
 Star,
 Zap,
 BarChart3,
 Code,
 Database,
 Globe,
 Smartphone,
 Briefcase,
 Building,
 MapPin,
 DollarSign
} from 'lucide-react';
import JobCard from '../components/JobCard';
import SkillCard from '../components/SkillCard';
import '../css/Dashboard.css';


const Dashboard = () => {
 const [animateCards, setAnimateCards] = useState(false);


 useEffect(() => {
   // Trigger card animations after component mounts
   const timer = setTimeout(() => setAnimateCards(true), 100);
   return () => clearTimeout(timer);
 }, []);


 const recommendedJobs = [
   {
     id: 1,
     title: 'Frontend Developer',
     icon: Code,
     color: 'blue'
   },
   {
     id: 2,
     title: 'Full Stack Engineer',
     icon: Code,
     color: 'green'
   },
   {
     id: 3,
     title: 'Data Engineer',
     icon: Database,
     color: 'purple'
   },
   {
     id: 4,
     title: 'DevOps Engineer',
     icon: Code,
     color: 'orange'
   }
 ];


 const skillsList = [
   { id: 1, name: 'JavaScript', icon: Code, color: 'yellow' },
   { id: 2, name: 'React', icon: Code, color: 'blue' },
   { id: 3, name: 'Python', icon: Code, color: 'green' },
   { id: 4, name: 'SQL', icon: Code, color: 'purple' },
   { id: 5, name: 'Node.js', icon: Code, color: 'green' },
   { id: 6, name: 'Git', icon: Code, color: 'orange' }
 ];


 return (
   <div className="dashboard-container">
     {/* Hero Section */}
     <div className="dashboard-hero">
       <div className="hero-content">
         <h1 className="hero-title">
           Welcome back to <span className="text-gradient">CareerOS</span>! 🚀
         </h1>
         <p className="hero-subtitle">
           Your AI-powered career development companion!
         </p>
       </div>
     </div>


     {/* Recommended Jobs Section */}
     <div className="jobs-section">
       <h2 className="section-title">
         <Briefcase size={24} />
         Recommended Jobs for You
       </h2>
       <div className="jobs-grid">
         {recommendedJobs.map((job, index) => (
           <JobCard 
             key={job.id}
             job={job}
             index={index}
             animateCards={animateCards}
           />
         ))}
       </div>
     </div>


     {/* Skills Section */}
     <div className="skills-section">
       <h2 className="section-title">
         <Target size={24} />
         Your Skills Overview
       </h2>
       <div className="skills-grid">
         {skillsList.map((skill, index) => (
           <SkillCard 
             key={skill.id}
             skill={skill}
             index={index}
             animateCards={animateCards}
           />
         ))}
       </div>
     </div>
   </div>
 );
};


export default Dashboard;
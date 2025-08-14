import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
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
  DollarSign,
} from "lucide-react";
import JobCard from "../components/JobCard";
import SkillCard from "../components/SkillCard";
import "../css/Dashboard.css";

const Dashboard = () => {
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    // Trigger card animations after component mounts
    const timer = setTimeout(() => setAnimateCards(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const [recommendedJobs, setRecommendedJobs] = useState([
    { name: "Nothing Yet!" },
  ]);
  const [skillsList, setSkillsList] = useState([
    { name: "Analyze your resume first." },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("jobs,skills")
        .eq("id", user.id)
        .single();
      if (error || !data) return;
      try {
        const jobs = Array.isArray(data.jobs)
          ? data.jobs
          : JSON.parse(data.jobs);
        setRecommendedJobs(jobs.map((job, i) => ({ name: job, id: i })));
      } catch {
        setRecommendedJobs([{ name: "Nothing Yet!" }]);
      }
      try {
        const skills = Array.isArray(data.skills)
          ? data.skills
          : JSON.parse(data.skills);
        setSkillsList(skills.map((skill, i) => ({ name: skill, id: i })));
      } catch {
        setSkillsList([{ name: "Analyze your resume first." }]);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome back to <span className="text-gradient">careerOS</span>! 🚀
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

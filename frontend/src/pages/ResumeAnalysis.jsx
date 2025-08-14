import React, { useState } from 'react';

function ResumeAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setAnalysisResult(null);
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      const mockResult = {
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
        experience: '3-5 years',
        education: 'Bachelor\'s Degree',
        strengths: ['Strong technical skills', 'Good project experience', 'Clear communication'],
        areas: ['Could add more leadership experience', 'Consider adding certifications'],
        score: 85
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="resume-analysis-container">
      <h1>Resume Analysis</h1>
      <p className="subtitle">Upload your resume to get AI-powered insights and recommendations</p>
      
      <div className="upload-section">
        <div className="file-upload-area">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            id="resume-upload"
            className="file-input"
          />
          <label htmlFor="resume-upload" className="file-label">
            <div className="upload-icon">📄</div>
            <div className="upload-text">
              {selectedFile ? selectedFile.name : 'Choose a file or drag it here'}
            </div>
            <div className="upload-hint">PDF, DOC, or DOCX (max 10MB)</div>
          </label>
        </div>
        
        <button 
          onClick={handleAnalyze}
          disabled={!selectedFile || isAnalyzing}
          className="analyze-button"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {isAnalyzing && (
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Analyzing your resume...</p>
        </div>
      )}

      {analysisResult && (
        <div className="analysis-results">
          <div className="score-section">
            <h2>Overall Score</h2>
            <div 
              className="score-circle"
              style={{ borderColor: getScoreColor(analysisResult.score) }}
            >
              <span className="score-number">{analysisResult.score}</span>
              <span className="score-label">/100</span>
            </div>
          </div>

          <div className="results-grid">
            <div className="result-card">
              <h3>Skills Identified</h3>
              <div className="skills-list">
                {analysisResult.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="result-card">
              <h3>Experience Level</h3>
              <p className="result-value">{analysisResult.experience}</p>
            </div>

            <div className="result-card">
              <h3>Education</h3>
              <p className="result-value">{analysisResult.education}</p>
            </div>

            <div className="result-card">
              <h3>Key Strengths</h3>
              <ul className="strengths-list">
                {analysisResult.strengths.map((strength, index) => (
                  <li key={index}>✅ {strength}</li>
                ))}
              </ul>
            </div>

            <div className="result-card">
              <h3>Areas for Improvement</h3>
              <ul className="improvements-list">
                {analysisResult.areas.map((area, index) => (
                  <li key={index}>💡 {area}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalysis;

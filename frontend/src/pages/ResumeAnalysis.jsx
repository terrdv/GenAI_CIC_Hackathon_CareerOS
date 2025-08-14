import React, { useState } from 'react';
import '../css/ResumeAnalysis.css';
import { supabase } from '../supabase';

function ResumeAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisHtml, setAnalysisHtml] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadStatus('');
    setShowAnalysis(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }
    const { data: {user}, error1} = await supabase.auth.getUser();
    const userId = user?.id;
    const { data, error2 } = await supabase.storage.from('resume').upload(`${userId}/resume.pdf`, selectedFile);
    if (error1 || error2) throw error1 || error2;
    setIsUploading(true);
    setUploadStatus('Uploading...');
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('resume', selectedFile);
      
      // Here you would make the actual API call to your backend
      // const response = await fetch('/api/resume/upload', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // For now, simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadStatus('File uploaded successfully!');
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('resume-upload');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // Get Supabase session token
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        throw new Error('Could not get session token');
      }
      const session_token = session.access_token;

      // Call backend API
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/analyzeResume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_token }),
      });
      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }
      const result = await response.json();
      setAnalysisHtml(result.feedback || 'No feedback received.');
      setShowAnalysis(true);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setAnalysisHtml('Error analyzing resume.');
      setShowAnalysis(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus('');
    setShowAnalysis(false);
    const fileInput = document.getElementById('resume-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="resume-analysis-container">
      <h1>Resume Upload</h1>
      <p className="subtitle">Upload your resume to get started</p>
      
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
            <div className="upload-hint">PDF, DOC, or DOCX (max 3MB)</div>
          </label>
        </div>
        
        {selectedFile && (
          <div className="file-info">
            <h3>Selected File:</h3>
            <p><strong>Name:</strong> {selectedFile.name}</p>
            <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}
        
        <div className="upload-actions">
          <button 
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="upload-button"
          >
            {isUploading ? 'Uploading...' : 'Upload Resume'}
          </button>
          
          {selectedFile && (
            <button 
              onClick={resetUpload}
              disabled={isUploading}
              className="reset-button"
            >
              Clear Selection
            </button>
          )}
        </div>

        {uploadStatus && (
          <div className={`upload-status ${uploadStatus.includes('successfully') ? 'success' : uploadStatus.includes('failed') ? 'error' : 'info'}`}>
            <span>{uploadStatus}</span>
          </div>
        )}

        <br/>

        {/* Analyze Button - appears after successful upload */}
        {uploadStatus.includes('successfully') && !showAnalysis && (
          <div className="upload-actions">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="upload-button"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </div>
        )}

        {/* Analysis Results */}
        {showAnalysis && (
          <div className="analysis-results">
            <h3>Resume Analysis Results</h3>
            <div className="feedback-section">
              <div dangerouslySetInnerHTML={{ __html: analysisHtml }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalysis;
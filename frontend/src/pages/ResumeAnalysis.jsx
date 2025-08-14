import React, { useState } from 'react';

function ResumeAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }
    
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

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus('');
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
            <div className="upload-hint">PDF, DOC, or DOCX (max 10MB)</div>
          </label>
        </div>
        
        {selectedFile && (
          <div className="file-info">
            <h3>Selected File:</h3>
            <p><strong>Name:</strong> {selectedFile.name}</p>
            <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Type:</strong> {selectedFile.type || 'Unknown'}</p>
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
      </div>
    </div>
  );
}

export default ResumeAnalysis;

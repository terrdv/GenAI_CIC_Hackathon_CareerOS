import React, { useState, useRef } from 'react';
import '../css/ResumeAnalysis.css';

function ResumeAnalysis() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
        setUploadStatus('');
    };

    const triggerFileDialog = () => {
        if (!isUploading) fileInputRef.current?.click();
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('Select a file first.');
            return;
        }
        setIsUploading(true);
        setUploadStatus('Uploading...');
        try {
            const formData = new FormData();
            formData.append('resume', selectedFile);
            // TODO: replace with real API call
            await new Promise(r => setTimeout(r, 1200));
            setUploadStatus('Upload successful.');
        } catch (err) {
            setUploadStatus('Upload failed.');
        } finally {
            setIsUploading(false);
        }
    };

    const resetFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setUploadStatus('');
    };

    return (
        <div className="resume-analysis-container fade-in">
            <h1 className="ra-heading">Resume Analysis</h1>
            <p className="ra-intro">Upload your resume to receive structured feedback.</p>

            <div className="ra-upload-panel">
                <input
                    ref={fileInputRef}
                    id="resumeFile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="file-input-hidden"
                />

                <div className="ra-actions">
                    <button
                        type="button"
                        className="primary-btn"
                        onClick={triggerFileDialog}
                        disabled={isUploading}
                    >
                        {selectedFile ? 'Change File' : 'Choose File'}
                    </button>

                    {selectedFile && (
                        <button
                            type="button"
                            className="action-btn action-btn-compact"
                            onClick={resetFile}
                            disabled={isUploading}
                        >
                            Remove
                        </button>
                    )}

                    <button
                        type="button"
                        className="action-btn action-btn-compact"
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>

                <div className="ra-file-meta">
                    {selectedFile
                        ? <span className="file-selected">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
                        : <span className="file-none">No file selected.</span>}
                </div>

                {uploadStatus && (
                    <div className="ra-status">
                        {uploadStatus}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResumeAnalysis;
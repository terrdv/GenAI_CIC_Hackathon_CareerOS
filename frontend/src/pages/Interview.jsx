import React, { useState, useRef } from 'react';
import { fetchCurrentQuestion, sendAudioResponse } from '../services/api';

function Interview() {
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const startInterview = async () => {
    try {
      setError('');
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setInterviewStarted(true);
      
      // Fetch the first question from backend using API service
      await fetchCurrentQuestionFromBackend();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Please allow microphone access to start the interview');
    }
  };

  const fetchCurrentQuestionFromBackend = async () => {
    try {
      setError('');
      setIsProcessing(true);
      
      // Use the API service function
      const data = await fetchCurrentQuestion();
      setCurrentQuestion(data.question || 'No question available');
      
    } catch (error) {
      console.error('Error fetching question:', error);
      setError('Failed to fetch question from backend: ' + error.message);
      // Fallback to placeholder question
      setCurrentQuestion("Question will be loaded from backend...");
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      setError('');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Audio recording is not supported in this browser');
        return;
      }

      // Get fresh stream for recording
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      setIsRecording(true);
      audioChunksRef.current = [];
      
      // Check supported MIME types
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/mp4') 
        ? 'audio/mp4' 
        : 'audio/ogg';
      
      console.log('Using MIME type:', mimeType);
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        console.log('Data available:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstart = () => {
        console.log('Recording started');
      };
      
      mediaRecorder.onstop = async () => {
        console.log('Recording stopped, chunks:', audioChunksRef.current.length);
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          console.log('Audio blob created:', audioBlob.size, 'bytes');
          setAudioBlob(audioBlob);
          
          // Automatically send audio to backend using API service
          await sendAudioToBackend(audioBlob);
        } else {
          setError('No audio data was recorded. Please try again.');
        }
        
        // Stop all tracks to release microphone
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setError('Recording error: ' + event.error.message);
        setIsRecording(false);
      };
      
      // Start recording with 1 second timeslice for better chunk handling
      mediaRecorder.start(1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording: ' + error.message);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && isRecording) {
        console.log('Stopping recording...');
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setError('Error stopping recording: ' + error.message);
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    if (!audioBlob) {
      setError('No audio recorded yet');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      console.log('Sending audio to backend, size:', audioBlob.size, 'bytes');
      
      // Use the API service function
      const result = await sendAudioResponse(audioBlob, currentQuestion);
      
      // Handle response from backend
      if (result.nextQuestion) {
        setCurrentQuestion(result.nextQuestion);
        console.log('Next question loaded:', result.nextQuestion);
      } else if (result.message) {
        console.log('Backend response:', result.message);
      }
      
      console.log('Audio sent to backend successfully!');
      setAudioBlob(null);
      
    } catch (error) {
      console.error('Error sending audio to backend:', error);
      setError('Failed to send audio to backend: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setCurrentQuestion('');
    setIsRecording(false);
    setAudioBlob(null);
    setError('');
    
    // Stop any ongoing recording
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error('Error stopping recording during reset:', error);
      }
    }
    
    // Stop any active stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  return (
    <div className="interview-container">
      <h1>AI Interview Practice</h1>
      <p className="subtitle">Practice your interview skills with our AI interviewer</p>
      
      {!interviewStarted ? (
        <div className="interview-setup">
          <div className="setup-card">
            <h2>Ready to Practice?</h2>
            <p>This interview will help you prepare for common questions and improve your responses.</p>
            <button onClick={startInterview} className="start-button">
              Start Interview
            </button>
          </div>
        </div>
      ) : (
        <div className="interview-interface">
          {/* Interviewer Section */}
          <div className="interviewer-section">
            <div className="interviewer-avatar">
              <div className="avatar-circle">🤖</div>
            </div>
            <div className="interviewer-info">
              <h3>AI Interviewer</h3>
              <p>Question loaded from backend</p>
            </div>
          </div>

          {/* Question Display */}
          <div className="question-section">
            <div className="question-card">
              <h2>Current Question:</h2>
              <p className="question-text">{currentQuestion}</p>
            </div>
          </div>

          {/* Response Section */}
          <div className="response-section">
            <div className="response-card">
              <h3>Your Response:</h3>
              <div className="response-input-area">
                {/* Error Display */}
                {error && (
                  <div className="error-message">
                    <span>⚠️ {error}</span>
                  </div>
                )}
                
                {/* Microphone Interface */}
                <div className="microphone-section">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="mic-button"
                      title="Start Recording"
                      disabled={!interviewStarted || isProcessing}
                    >
                      <div className="mic-icon">🎤</div>
                      <span className="mic-text">Start Recording</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="mic-button recording"
                      title="Stop Recording"
                    >
                      <div className="mic-icon">⏹️</div>
                      <span className="mic-text">Stop Recording</span>
                    </button>
                  )}
                  
                  {isRecording && (
                    <div className="recording-indicator">
                      <div className="recording-dot"></div>
                      <span>Recording in progress...</span>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="processing-indicator">
                      <div className="loading-spinner"></div>
                      <span>Processing your response...</span>
                    </div>
                  )}
                </div>

                {/* Audio Playback (Optional - for debugging) */}
                {audioBlob && (
                  <div className="audio-playback">
                    <h4>Recorded Audio Preview:</h4>
                    <audio controls src={URL.createObjectURL(audioBlob)} />
                    <p className="audio-info">Size: {(audioBlob.size / 1024).toFixed(1)} KB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interview Controls */}
          <div className="interview-controls">
            <button onClick={resetInterview} className="reset-button">
              Restart Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interview;

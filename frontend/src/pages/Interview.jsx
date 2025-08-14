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
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            setInterviewStarted(true);
            await fetchCurrentQuestionFromBackend();
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Please allow microphone access to start the interview');
        }
    };

    const fetchCurrentQuestionFromBackend = async () => {
        try {
            setError('');
            setIsProcessing(true);
            const data = await fetchCurrentQuestion();
            setCurrentQuestion(data.question || 'No question available');
        } catch (err) {
            console.error('Error fetching question:', err);
            setError('Failed to fetch question from backend: ' + err.message);
            setCurrentQuestion('Question will be loaded from backend...');
        } finally {
            setIsProcessing(false);
        }
    };

    const startRecording = async () => {
        try {
            setError('');
            if (!navigator.mediaDevices?.getUserMedia) {
                setError('Audio recording is not supported in this browser');
                return;
            }
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
            const mimeType = MediaRecorder.isTypeSupported('audio/webm')
                ? 'audio/webm'
                : MediaRecorder.isTypeSupported('audio/mp4')
                    ? 'audio/mp4'
                    : 'audio/ogg';
            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };
            mediaRecorder.onstop = async () => {
                if (audioChunksRef.current.length > 0) {
                    const blob = new Blob(audioChunksRef.current, { type: mimeType });
                    setAudioBlob(blob);
                    await sendAudioToBackend(blob);
                } else {
                    setError('No audio data was recorded. Please try again.');
                }
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(t => t.stop());
                    streamRef.current = null;
                }
            };
            mediaRecorder.onerror = (evt) => {
                setError('Recording error: ' + evt.error.message);
                setIsRecording(false);
            };
            mediaRecorder.start(1000);
        } catch (err) {
            console.error('Error starting recording:', err);
            setError('Failed to start recording: ' + err.message);
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        try {
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.stop();
                setIsRecording(false);
            }
        } catch (err) {
            setError('Error stopping recording: ' + err.message);
            setIsRecording(false);
        }
    };

    const sendAudioToBackend = async (blob) => {
        if (!blob) {
            setError('No audio recorded yet');
            return;
        }
        setIsProcessing(true);
        setError('');
        try {
            const result = await sendAudioResponse(blob, currentQuestion);
            if (result.nextQuestion) {
                setCurrentQuestion(result.nextQuestion);
            } else if (result.message) {
                console.log(result.message);
            }
            setAudioBlob(null);
        } catch (err) {
            setError('Failed to send audio to backend: ' + err.message);
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
        if (mediaRecorderRef.current && isRecording) {
            try { mediaRecorderRef.current.stop(); } catch (_) {}
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    };

    return (
        <div className="interview-container fade-in">
            <h1>AI Interview Practice</h1>
            <p className="subtitle">Practice your interview skills with our AI interviewer</p>

            {!interviewStarted ? (
                <div className="interview-setup">
                    <div className="setup-card">
                        <h2>Ready to Practice?</h2>
                        <p>This interview will help you prepare for common questions and improve your responses.</p>
                        <button onClick={startInterview} className="start-button primary-btn">
                            Start Interview
                        </button>
                    </div>
                </div>
            ) : (
                <div className="interview-interface">
                    <div className="interviewer-section">
                        <div className="interviewer-avatar">
                            <div className="avatar-circle">🤖</div>
                        </div>
                        <div className="interviewer-info">
                            <h3>AI Interviewer</h3>
                            <p>Question loaded from backend</p>
                        </div>
                    </div>

                    <div className="question-section">
                        <div className="question-card">
                            <h2>Current Question:</h2>
                            <p className="question-text">{currentQuestion}</p>
                        </div>
                    </div>

                    <div className="response-section">
                        <div className="response-card">
                            <h3>Your Response:</h3>
                            <div className="response-input-area">
                                {error && (
                                    <div className="error-message">
                                        <span>⚠️ {error}</span>
                                    </div>
                                )}

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

                                {audioBlob && (
                                    <div className="audio-playback">
                                        <h4>Recorded Audio Preview:</h4>
                                        <audio controls src={URL.createObjectURL(audioBlob)} />
                                        <p className="audio-info">
                                            Size: {(audioBlob.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="interview-controls">
                        <button onClick={resetInterview} className="reset-button action-btn action-btn-compact">
                            Restart Interview
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Interview;
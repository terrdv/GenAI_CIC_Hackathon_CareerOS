// API service functions for CareerOS application

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to create headers
const createHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Interview API functions

/**
 * Fetch the current interview question from backend
 * @returns {Promise<Object>} Response containing the question
 */
export const fetchCurrentQuestion = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/interview/current-question`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching current question:', error);
    throw error;
  }
};

/**
 * Send audio response to backend for analysis
 * @param {Blob} audioBlob - The recorded audio blob
 * @param {string} question - The current question being answered
 * @returns {Promise<Object>} Response containing next question or analysis results
 */
export const sendAudioResponse = async (audioBlob, question) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'interview-response.webm');
    formData.append('question', question);
    
    const response = await fetch(`${API_BASE_URL}/api/interview/analyze`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header for FormData
      // The browser will set it automatically with the boundary
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error sending audio response:', error);
    throw error;
  }
};

/**
 * Get interview session information
 * @param {string} sessionId - The interview session ID
 * @returns {Promise<Object>} Session information
 */
export const getInterviewSession = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/interview/session/${sessionId}`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching interview session:', error);
    throw error;
  }
};

/**
 * Start a new interview session
 * @returns {Promise<Object>} New session information
 */
export const startInterviewSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/interview/session/start`, {
      method: 'POST',
      headers: createHeaders(true),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error starting interview session:', error);
    throw error;
  }
};

/**
 * End an interview session
 * @param {string} sessionId - The interview session ID
 * @returns {Promise<Object>} Session summary
 */
export const endInterviewSession = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/interview/session/${sessionId}/end`, {
      method: 'POST',
      headers: createHeaders(true),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error ending interview session:', error);
    throw error;
  }
};

/**
 * Get interview history for a user
 * @returns {Promise<Array>} Array of interview sessions
 */
export const getInterviewHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/interview/history`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching interview history:', error);
    throw error;
  }
};

// Resume Analysis API functions

/**
 * Upload and analyze resume
 * @param {File} resumeFile - The resume file to analyze
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeResume = async (resumeFile) => {
  try {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    
    const response = await fetch(`${API_BASE_URL}/api/resume/analyze`, {
      method: 'POST',
      body: formData,
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
};

// Dashboard API functions

/**
 * Get dashboard data for the current user
 * @returns {Promise<Object>} Dashboard information
 */
export const getDashboardData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Authentication API functions

/**
 * User login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login response with token
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * User registration
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify(userData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} Logout response
 */
export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: createHeaders(true),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export default {
  // Interview functions
  fetchCurrentQuestion,
  sendAudioResponse,
  getInterviewSession,
  startInterviewSession,
  endInterviewSession,
  getInterviewHistory,
  
  // Resume functions
  analyzeResume,
  
  // Dashboard functions
  getDashboardData,
  
  // Auth functions
  loginUser,
  registerUser,
  logoutUser,
};

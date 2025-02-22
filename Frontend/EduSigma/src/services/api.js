const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to check if the server is available
const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Helper function to handle API errors
const handleApiError = (error, defaultMessage) => {
  console.error('API Error:', error);
  if (!navigator.onLine) {
    throw new Error('No internet connection. Please check your network.');
  }
  if (error.message === 'Failed to fetch') {
    throw new Error('Cannot connect to the server. Please make sure the server is running.');
  }
  throw new Error(defaultMessage);
};

export const fetchComments = async (courseCode) => {
  try {
    // Check server health first
    const isServerHealthy = await checkServerHealth();
    if (!isServerHealthy) {
      throw new Error('Server is not responding. Please try again later.');
    }

    const response = await fetch(`${API_URL}/comments/${courseCode}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    handleApiError(error, 'Failed to load comments. Please try again.');
  }
};

export const createComment = async (courseCode, text) => {
  try {
    const response = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseCode, text }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create comment: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    handleApiError(error, 'Failed to add comment. Please try again.');
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete comment: ${response.statusText}`);
    }
  } catch (error) {
    handleApiError(error, 'Failed to delete comment. Please try again.');
  }
}; 
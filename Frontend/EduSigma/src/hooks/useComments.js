import { useState, useEffect } from 'react';
import * as api from '../services/api';

function useComments(courseCode) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comments when component mounts
  useEffect(() => {
    const fetchCourseComments = async () => {
      try {
        setIsLoading(true);
        const data = await api.fetchComments(courseCode);
        setComments(data);
        setError(null);
      } catch (err) {
        setError('Failed to load comments');
        console.error('Error fetching comments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseComments();
  }, [courseCode]);

  const addComment = async (text) => {
    try {
      const newComment = await api.createComment(courseCode, text);
      setComments(prevComments => [newComment, ...prevComments]);
      setError(null);
    } catch (err) {
      setError('Failed to add comment');
      console.error('Error adding comment:', err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await api.deleteComment(commentId);
      setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
      setError(null);
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  return {
    comments,
    addComment,
    deleteComment,
    isLoading,
    error,
  };
}

export default useComments; 
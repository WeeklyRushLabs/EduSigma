import React, { useState } from 'react';
import styles from './CourseModal.module.css';
import useComments from '../../hooks/useComments';

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}

function CourseModal({ course, onClose }) {
  const [newComment, setNewComment] = useState('');
  const { comments, addComment, deleteComment, isLoading, error } = useComments(course.code);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      await addComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{course.code}</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          <h4>{course.name}</h4>
          <p>{course.description}</p>
          <div className={styles.metadata}>
            <div className={styles.metadataItem}>
              <strong>Schedule:</strong> Mon, Wed, Fri
            </div>
            <div className={styles.metadataItem}>
              <strong>Professor:</strong> Dr. Smith
            </div>
            <div className={styles.metadataItem}>
              <strong>Credits:</strong> 3
            </div>
            <div className={styles.metadataItem}>
              <strong>Prerequisites:</strong> None
            </div>
          </div>

          <div className={styles.commentsSection}>
            <h5>Comments</h5>
            <form onSubmit={handleSubmitComment} className={styles.commentForm}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className={styles.commentInput}
                rows="3"
              />
              <button 
                type="submit" 
                className={styles.commentButton}
                disabled={!newComment.trim()}
              >
                Add Comment
              </button>
            </form>

            <div className={styles.commentsList}>
              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}
              
              {isLoading ? (
                <div className={styles.loading}>
                  Loading comments...
                </div>
              ) : (
                <>
                  {comments.map(comment => (
                    <div key={comment._id} className={styles.commentItem}>
                      <div className={styles.commentContent}>
                        <p>{comment.text}</p>
                        <span className={styles.commentDate}>
                          {formatDate(comment.timestamp)}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteComment(comment._id)}
                        className={styles.deleteComment}
                        aria-label="Delete comment"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {comments.length === 0 && !error && (
                    <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseModal; 
import React from 'react';
import styles from './SelectedCourses.module.css';

function SelectedCourses({ courses, onCourseClick, onRemoveCourse }) {
  return (
    <div className={styles.list}>
      {courses.map(course => (
        <div key={course.code} className={styles.courseItem}>
          <div 
            className={styles.courseContent}
            onClick={() => onCourseClick(course)}
          >
            <div className={styles.courseHeader}>
              <span className={styles.courseCode}>{course.code}</span>
              <span className={styles.courseDate}>Next class: Tomorrow, 10:00 AM</span>
            </div>
            <p className={styles.courseDescription}>{course.description}</p>
          </div>
          <button 
            className={styles.removeButton}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveCourse(course);
            }}
          >
            −
          </button>
        </div>
      ))}
      {courses.length === 0 && (
        <div className={styles.emptyState}>
          No courses selected yet. Add courses from the list on the left.
        </div>
      )}
    </div>
  );
}

export default SelectedCourses; 
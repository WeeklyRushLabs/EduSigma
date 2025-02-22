import React, { useState } from 'react';
import styles from './CourseList.module.css';

const SAMPLE_COURSES = [
  { code: 'CS101', name: 'Introduction to Programming', description: 'Basic programming concepts' },
  { code: 'CS201', name: 'Data Structures', description: 'Fundamental data structures' },
  { code: 'CS301', name: 'Algorithms', description: 'Algorithm design and analysis' },
];

function SearchIcon() {
  return (
    <svg 
      className={styles.searchIcon} 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CourseList({ onCourseClick, onAddCourse, selectedCourses }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = SAMPLE_COURSES.filter(course => {
    const query = searchQuery.toLowerCase();
    return (
      course.code.toLowerCase().includes(query) ||
      course.name.toLowerCase().includes(query)
    );
  });

  const isSelected = (courseCode) => {
    return selectedCourses.some(course => course.code === courseCode);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search by course code or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        {searchQuery && (
          <button
            className={styles.clearButton}
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <div className={styles.list}>
        {filteredCourses.map(course => {
          const selected = isSelected(course.code);
          return (
            <div 
              key={course.code} 
              className={`${styles.courseItem} ${selected ? styles.selected : ''}`}
            >
              <div 
                className={styles.courseContent}
                onClick={() => onCourseClick(course)}
              >
                <span className={styles.courseCode}>{course.code}</span>
                <span className={styles.courseName}>{course.name}</span>
              </div>
              <button 
                className={`${styles.addButton} ${selected ? styles.selected : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddCourse(course);
                }}
                disabled={selected}
              >
                {selected ? '✓' : '+'}
              </button>
            </div>
          );
        })}
        {filteredCourses.length === 0 && (
          <div className={styles.emptyState}>
            No courses found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseList; 
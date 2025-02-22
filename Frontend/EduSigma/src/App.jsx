import React, { useState } from 'react';
import styles from './App.module.css';
import CourseList from './components/CourseList';
import SelectedCourses from './components/SelectedCourses';
// import ChatButton from './components/ChatButton';
// import ChatWindow from './components/ChatWindow';
import CourseModal from './components/CourseModal';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleAddCourse = (course) => {
    if (!selectedCourses.find(c => c.code === course.code)) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const handleRemoveCourse = (courseToRemove) => {
    setSelectedCourses(selectedCourses.filter(course => course.code !== courseToRemove.code));
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <h2>Available Courses</h2>
          <CourseList 
            onCourseClick={(course) => setSelectedCourse(course)}
            onAddCourse={handleAddCourse}
            selectedCourses={selectedCourses}
          />
        </div>
        <div className={styles.rightPanel}>
          <h2>My Selected Courses</h2>
          <SelectedCourses 
            courses={selectedCourses} 
            onCourseClick={(course) => setSelectedCourse(course)}
            onRemoveCourse={handleRemoveCourse}
          />
        </div>
      </div>
      
      {/* <ChatButton onClick={() => setIsChatOpen(true)} />
      
      {isChatOpen && (
        <ChatWindow onClose={() => setIsChatOpen(false)} />
      )} */}
      
      {selectedCourse && (
        <CourseModal 
          course={selectedCourse} 
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}

export default App; 
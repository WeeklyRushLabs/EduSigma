import React from 'react';
import styles from './ChatButton.module.css';

function ChatButton({ onClick }) {
  return (
    <button className={styles.chatButton} onClick={onClick}>
      <span className={styles.icon}>💬</span>
      Chat with AI
    </button>
  );
}

export default ChatButton; 
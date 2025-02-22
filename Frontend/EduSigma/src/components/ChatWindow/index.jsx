import React from 'react';
import styles from './ChatWindow.module.css';

function ChatWindow({ onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.window}>
        <div className={styles.header}>
          <h3>Chat with AI Assistant</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.chatArea}>
          {/* Chat messages would go here */}
        </div>
        <div className={styles.inputArea}>
          <input 
            type="text" 
            placeholder="Type your message..."
            className={styles.input}
          />
          <button className={styles.sendButton}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow; 
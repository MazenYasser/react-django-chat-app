// MessageBox.js
import React from 'react';
import './MessageBox.css';

interface MessageBoxProps {
    message: string;
    sender: string;
    timestamp: string;
    isCurrentUser: boolean;
}


const MessageBox : React.FC<MessageBoxProps> = ({ message, sender, timestamp, isCurrentUser }) => {
    return (
        <div className={`message-box ${isCurrentUser ? 'current-user' : 'other-user'}`}>
            <div className="message-content">
            <span className="message-sender">{sender}</span>
                <p className="message-text">{message}</p>
                <span className="message-timestamp">{timestamp}</span>
            </div>
        </div>
    );
};

export default MessageBox;

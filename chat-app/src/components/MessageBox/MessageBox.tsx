// MessageBox.js
import React from 'react';
import './MessageBox.css';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import VisibilityIcon from '@mui/icons-material/Visibility';



interface MessageBoxProps {
    message: string;
    sender: string;
    timestamp: string;
    isCurrentUser: boolean;
    isRead: boolean;
}


const MessageBox : React.FC<MessageBoxProps> = ({ message, sender, timestamp, isCurrentUser, isRead }) => {
    return (
        <div className={`message-box ${isCurrentUser ? 'current-user' : 'other-user'}`}>
            <div className="message-content">
            <span className="message-sender">{sender}</span>
                <p className="message-text">{message}</p>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="message-icon" style={!isCurrentUser ? { opacity: "0" }:{ opacity: "1" }}>{isRead ?
                    <VisibilityIcon style={{ width: "10px", height: "10px", marginTop: "8px", 
                    }} /> : <CloudDoneIcon style={{ width: "10px", height: "10px", marginTop: "8px" }} />}</span>
                    <span className="message-timestamp">{timestamp}</span>
                </div>
            </div>
        </div>
    );
};

export default MessageBox;

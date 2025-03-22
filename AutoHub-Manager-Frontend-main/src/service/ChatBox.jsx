import React, { useState } from 'react';
import axios from 'axios';

const ChatBox = ({ receiverId }) => {
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/messages/send',
        { receiverId, message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessage('');
      console.log('Message sent:', response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-box">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;

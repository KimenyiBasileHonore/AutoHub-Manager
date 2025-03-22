import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Debug the token to verify its structure
  useEffect(() => {
    if (token) {
      try {
        // Simple parsing to check payload without verification
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log("Token payload:", payload);
        }
      } catch (e) {
        console.error("Error parsing token:", e);
      }
    }
  }, [token]);

  // Fetch the first available vendor
  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    axios.get('http://localhost:4000/api/user/vendors', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log("Vendors response data:", response.data);
      const vendors = response.data.vendors;
      if (Array.isArray(vendors) && vendors.length > 0) {
        const vendor = vendors.find(user => user.role === "VENDOR");
        if (vendor) {
          setReceiverId(vendor._id);
          console.log("Selected vendor ID:", vendor._id);
        } else {
          setError("No vendor found.");
          setLoading(false);
        }
      } else {
        setError("No vendors available.");
        setLoading(false);
      }
    })
    .catch((error) => {
      console.error("Error fetching vendors:", error);
      setError("Failed to fetch vendors. " + (error.response?.data?.error || error.message));
      setLoading(false);
    });
  }, [token]);

  // Fetch all messages related to the current user
  useEffect(() => {
    if (!token || !receiverId) {
      console.log('Missing required data:', { token, receiverId, userId });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    console.log('Fetching messages with userId:', userId, 'receiverId:', receiverId);
    
    axios.get(`http://localhost:4000/api/messages/chat`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
      console.log('Received messages:', response.data);
      if (Array.isArray(response.data)) {
        const sortedMessages = response.data.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Received invalid message data from server");
      }
      setLoading(false);
    })
    .catch(error => {
      console.error("Error fetching chat:", error);
      setError("Failed to fetch messages. " + (error.response?.data?.error || error.message));
      setLoading(false);
    });
  }, [token, receiverId]);

  const sendMessage = () => {
    if (!receiverId || !newMessage.trim()) {
      setError("Receiver ID is missing or message is empty.");
      return;
    }

    setLoading(true);
    axios.post(
      'http://localhost:4000/api/messages/send',
      { 
        receiverId, 
        message: newMessage
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then(response => {
      console.log("Message sent successfully:", response.data);
      
      // Add the new message to the local state first for immediate feedback
      if (response.data.newMessage) {
        setMessages(prevMessages => [
          ...prevMessages, 
          response.data.newMessage
        ]);
      }
      
      // Clear the input field
      setNewMessage('');
      setLoading(false);
      
      // Optionally refresh all messages to ensure sync with server
      refreshMessages();
    })
    .catch(error => {
      console.error('Error sending message:', error.response?.data || error.message);
      setError("Failed to send message. " + (error.response?.data?.error || error.message));
      setLoading(false);
    });
  };

  const refreshMessages = () => {
    if (!token || !receiverId) return;
    
    axios.get(`http://localhost:4000/api/messages/chat`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
      if (Array.isArray(response.data)) {
        const sortedMessages = response.data.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);
      }
    })
    .catch(error => {
      console.error("Error refreshing messages:", error);
    });
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messageContainer = document.querySelector('.message-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-3">My Chat</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-3">
          <p>{error}</p>
        </div>
      )}
      
      <div className="border p-3 h-64 overflow-y-auto bg-gray-100 rounded-md message-container">
        {loading && messages.length === 0 ? (
          <p className="text-center py-2">Loading messages...</p>
        ) : messages.length > 0 ? (
          messages.map(msg => (
            <div key={msg._id} className={`p-2 my-2 rounded-lg ${msg.senderId === userId ? 'bg-blue-200 ml-12 text-right' : 'bg-gray-300 mr-12'}`}>
              <p className="text-sm">{msg.message}</p>
              <small className="text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </small>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-2">No messages yet. Start a conversation!</p>
        )}
      </div>
      
      <div className="mt-3 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-2 border rounded-l-md"
          placeholder="Type your message..."
          disabled={loading || !receiverId}
        />
        <button 
          onClick={sendMessage} 
          className={`${loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-r-md transition-colors`}
          disabled={loading || !receiverId || !newMessage.trim()}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      
      <div className="mt-3">
        <button 
          onClick={refreshMessages}
          className="text-blue-500 hover:text-blue-700 text-sm"
          disabled={loading || !receiverId}
        >
          Refresh Messages
        </button>
      </div>
    </div>
  );
};

export default ClientChat;
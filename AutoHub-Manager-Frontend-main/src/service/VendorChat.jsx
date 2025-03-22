import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaCommentSlash, FaReply, FaPaperPlane } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VendorChat = () => {
  const [messages, setMessages] = useState([]);
  const [groupedMessages, setGroupedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  // Group messages with their replies
  useEffect(() => {
    const groupMessages = () => {
      // Create a map of message IDs to their indices in the result array
      const messageMap = new Map();
      const result = [];

      // First pass: add all messages without replies to the result array
      messages.forEach(message => {
        if (!message.replyTo) {
          messageMap.set(message._id, result.length);
          result.push({
            original: message,
            replies: []
          });
        }
      });

      // Second pass: add replies to their parent messages
      messages.forEach(message => {
        if (message.replyTo) {
          const replyToId = typeof message.replyTo === 'object' ? message.replyTo._id : message.replyTo;
          const parentIndex = messageMap.get(replyToId);
          
          if (parentIndex !== undefined) {
            result[parentIndex].replies.push(message);
          } else {
            // If parent message not found, treat as a standalone message
            messageMap.set(message._id, result.length);
            result.push({
              original: message,
              replies: []
            });
          }
        }
      });

      setGroupedMessages(result);
    };

    if (messages.length > 0) {
      groupMessages();
    } else {
      setGroupedMessages([]);
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        "http://localhost:4000/api/messages/vendor/messages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setMessages(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError(error.response?.data?.message || error.message);
      toast.error("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (messageText, replyToMessageId) => {
    if (!messageText.trim()) {
      toast.warning("Reply cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      // Show pending toast
      toast.info("Sending reply...");
      
      console.log("Sending reply:", {
        message: messageText,
        replyTo: replyToMessageId
      });
      
      const response = await axios.post(
        "http://localhost:4000/api/messages/reply",
        { 
          message: messageText, 
          replyTo: replyToMessageId 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log("Reply response:", response.data);
      
      // Success handling
      toast.success("Reply sent successfully");
      setReplyingTo(null);
      setReplyText("");
      
      // Refetch messages
      setTimeout(fetchMessages, 500);
      
    } catch (error) {
      console.error("Error sending reply:", error);
      
      // Detailed error information
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      
      toast.error(`Reply failed (${statusCode}): ${errorMessage}`);
      
      // Token issue detection
      if (statusCode === 401) {
        toast.error("Your session may have expired. Please log out and log in again.");
      }
    }
  };

  const renderMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
      <FaCommentSlash className="text-6xl text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold text-gray-600 mb-2">
        No Messages Yet
      </h2>
      <p className="text-gray-500 text-center">
        When you receive messages, they will appear here.
      </p>
    </div>
  );

  const MessageThread = ({ thread }) => {
    const { original, replies } = thread;
    const senderName = original.senderName || "Client";
    
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4 transition-all hover:shadow-lg">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <FaUser className="text-blue-500 text-2xl" />
            <div>
              <h3 className="font-semibold text-gray-800">{senderName}</h3>
              <span className="text-xs text-gray-500">
                {renderMessageTime(original.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-3">{original.message}</p>

        {/* Replies section */}
        {replies.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <h4 className="font-medium text-gray-700 mb-2">Replies</h4>
            {replies.map(reply => (
              <div key={reply._id} className="bg-gray-50 rounded-md p-3 mb-2">
                <div className="flex items-center mb-2">
                  <FaUser className="text-green-500 text-lg mr-2" />
                  <div>
                    <span className="font-medium text-gray-800">{reply.senderName || "You"}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {renderMessageTime(reply.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700">{reply.message}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-3">
          <button
            onClick={() => setReplyingTo(original._id)}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-2 text-sm"
          >
            <FaReply /> <span>Reply</span>
          </button>
        </div>

        {replyingTo === original._id && (
          <div className="mt-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleReply(replyText, original._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center space-x-2"
              >
                <FaPaperPlane /> <span>Send</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p className="font-bold">Error loading messages:</p>
        <p>{error}</p>
        <button 
          onClick={fetchMessages}
          className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <ToastContainer position="top-right" />
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Vendor Messages</h1>
      
      {groupedMessages.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          {groupedMessages.map((thread) => (
            <MessageThread key={thread.original._id} thread={thread} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorChat;
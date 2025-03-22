import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa"; // Importing user icon from react-icons

const ChatList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyTo, setReplyTo] = useState(""); // Holds the reply message text

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/messages/vendor/messages",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Fetched messages:", response.data);
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleReply = async (messageText, replyToMessageId) => {
    console.log("Sending Reply:", { messageText, replyToMessageId });

    try {
      const response = await axios.post(
        "http://localhost:4000/api/messages/reply",
        { message: messageText, replyTo: replyToMessageId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Reply Sent:", response.data);
      setReplyingTo(null); // Reset replyingTo state after sending the reply
      setReplyTo(""); // Clear the reply text input field
    } catch (error) {
      console.error("Error sending reply:", error.response?.data || error.message);
    }
  };

  return (
    <div className="chat-list p-4 space-y-4">
      {loading ? (
        <p className="text-center text-gray-500">Loading messages...</p>
      ) : (
        messages.map((message) => (
          <div key={message._id} className="message p-4 bg-white rounded-lg shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-400 text-xl" /> {/* User icon */}
               
              </div>
              <span className="text-sm text-gray-500">
                {new Date(message.createdAt).toLocaleString()} {/* CreatedAt timestamp */}
              </span>
            </div>
            <p className="text-gray-700">{message.message}</p>

            {/* Group replies to the same message */}
            {message.replyTo && (
              <div className="reply bg-gray-100 p-3 rounded-lg mt-3">
                <p className="text-sm text-gray-600">
                  <strong>Replying to:</strong> {message.replyTo.message}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(message.updatedAt).toLocaleString()} {/* UpdatedAt timestamp */}
                </span>
              </div>
            )}

            {/* Button to trigger reply input */}
            <button
              className="text-blue-500 text-sm mt-2"
              onClick={() => setReplyingTo(message._id)} // Set this message as the one to reply to
            >
              Reply
            </button>

            {/* Show reply input if replying to this message */}
            {replyingTo === message._id && (
              <div className="reply-input mt-4">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your reply..."
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)} // Update reply message
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                  onClick={() => handleReply(replyTo, message._id)} // Send reply when clicked
                >
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;

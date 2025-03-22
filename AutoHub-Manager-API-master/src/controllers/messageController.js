import mongoose from 'mongoose';
import Message from '../models/Message.js';
import { parseJwt } from '../utils/jwtHelper.js';  // Assuming you have a JWT utility to decode token
import User from '../models/client.js';  // Assuming 'client.js' is for User model (Client)
import Vendor from '../models/vendor.js';  // Assuming 'vendor.js' is for Vendor model

// Send a message (including replies)
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ message: 'Receiver ID and message content are required' });
    }

    // Ensure the sender exists (the sender is always a User, i.e., Client)
    const sender = await User.findById(req.user._id); // Assuming req.user._id refers to a User (Client)
    if (!sender) {
      return res.status(404).json({ message: 'Sender (Client) not found' });
    }

    // Ensure the receiver exists (the receiver is always a Vendor)
    const receiver = await Vendor.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver (Vendor) not found' });
    }

    // Create the new message
    const newMessage = new Message({
      senderId: sender._id,   // Sender is always a User (Client)
      receiverId: receiver._id, // Receiver is always a Vendor
      message
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
};
// Get chat history (either client -> vendor or vendor -> client)
export const getChatHistory = async (req, res) => {
  try {
    // Extract token from the authorization header
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }
    
    const token = req.headers.authorization.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Invalid authorization format' });
    }
    
    // Decode the JWT token to get the authenticated user ID
    const decodedToken = parseJwt(token);  
    const senderId = decodedToken.userId; // Use userId instead of id

    console.log(`Authenticated senderId: ${senderId}`);

    // Fetch only messages where the senderId matches the authenticated user
    const messages = await Message.find({ senderId })
      .sort({ createdAt: 1 })
      .populate('replyTo');

    console.log(`Found ${messages.length} messages sent by ${senderId}`);
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages: ' + error.message });
  }
};




// Get all messages for a specific vendor (including replies)
export const getMessagesForVendor = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: 1 }) // Sort by timestamp to ensure the order is correct
      .populate({
        path: 'replyTo',        // Populate the 'replyTo' field to show the original message
        select: 'message',      // Only select the message content for the replyTo field
      });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching all messages:', error);
    res.status(500).json({ error: 'Error fetching all messages' });
  }
};



// Get all messages for a client (including replies)
export const getMessagesForClient = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = parseJwt(token);
    const clientId = decodedToken.id;  // Client's ID from decoded JWT token

    // Fetch all messages where the current client is the receiver
    const messages = await Message.find({
      receiverId: clientId,
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages for client:', error);
    res.status(500).json({ error: 'Error fetching messages for client' });
  }
};


export const replyToMessage = async (req, res) => {
  try {
    const { message, replyTo } = req.body;

    if (!message || !replyTo) {
      return res.status(400).json({ error: "Message and replyTo are required" });
    }

    // Fetch the original message
    const originalMessage = await Message.findById(replyTo);
    if (!originalMessage) {
      return res.status(404).json({ error: "Original message not found" });
    }

    // Create the reply
    const reply = new Message({
      message,
      replyTo,
      receiverId: originalMessage.senderId, // Keep receiver ID logic
    });

    const savedReply = await reply.save();
    res.status(200).json({ message: "Reply sent successfully", reply: savedReply });

  } catch (error) {
    console.error("Error replying to message:", error);
    res.status(500).json({ error: "Error replying to message: " + error.message });
  }
};
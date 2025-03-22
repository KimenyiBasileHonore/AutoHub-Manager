import express from 'express';
import checkAuth from '../middleware/checkAuthentication.js';  // Middleware for authenticating users
import {
  sendMessage,
  getChatHistory,
  getMessagesForVendor,
  getMessagesForClient,
  replyToMessage,
} from '../controllers/messageController.js';  // Import the message controller functions

const router = express.Router();

// Route for sending a message
router.post('/send', checkAuth, sendMessage);  // Send a message (Client to Vendor, Vendor to Client)

// Route for getting chat history (Client - Vendor)
router.get('/chat', checkAuth, getChatHistory);  // Get chat history between Client and Vendor

// Route for getting all messages for a specific vendor
router.get('/vendor/messages',  getMessagesForVendor);  // Get all messages for the vendor (by Vendor ID)

// Route for getting all messages for a specific client
router.get('/client/messages', checkAuth, getMessagesForClient);  // Get all messages for the client (by Client ID)

// Route for replying to a message (Client or Vendor replying to a message)
router.post('/reply',  replyToMessage);  // Reply to a specific message

export default router;

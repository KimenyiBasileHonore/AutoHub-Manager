import Feedback from '../models/feedback.js';

export const  createFeedback = async (req, res) => {
  try {
    const feedbackData = req.body;
    const feedback = new Feedback(feedbackData);
    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'An error occurred while submitting feedback' });
  }
};

export const  getFeedbackCount = async (req, res) => {
  try {
    const feedbackCount = await Feedback.countDocuments(); // Count the documents in the Feedback collection
    res.status(200).json({ count: feedbackCount });
  } catch (error) {
    console.error('Error getting feedback count:', error);
    res.status(500).json({ error: 'An error occurred while getting feedback count' });
  }
};

export const  getFeedbackList = async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ submissionDate: -1 });
    res.status(200).json(feedbackList);
  } catch (error) {
    console.error('Error getting feedback list:', error);
    res.status(500).json({ error: 'An error occurred while getting feedback list' });
  }
};

export const  markFeedbackAsSeen = async (req, res) => {
  const feedbackId = req.params.id;

  try {
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    feedback.isSeen = true;
    await feedback.save();

    res.status(200).json({ message: 'Feedback marked as seen' });
  } catch (error) {
    console.error('Error marking feedback as seen:', error);
    res.status(500).json({ error: 'An error occurred while marking feedback as seen' });
  }
};

export const  markFeedbackAsUnseen = async (req, res) => {
  const feedbackId = req.params.id;

  try {
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    feedback.isSeen = false;
    await feedback.save();

    res.status(200).json({ message: 'Feedback marked as unseen' });
  } catch (error) {
    console.error('Error marking feedback as unseen:', error);
    res.status(500).json({ error: 'An error occurred while marking feedback as unseen' });
  }
};





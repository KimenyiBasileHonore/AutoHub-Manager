import express from 'express';
const router = express.Router();
import { createFeedback, getFeedbackList,  getFeedbackCount, markFeedbackAsSeen,  markFeedbackAsUnseen} from '../controllers/feedbackController.js';


router.post('/feedback', createFeedback);
router.get('/feedback', getFeedbackList);
router.get('/feedback/count', getFeedbackCount);
router.put('/feedback/:id/mark-seen', markFeedbackAsSeen);
router.put('/feedback/:id/mark-unseen', markFeedbackAsUnseen);


export default router;




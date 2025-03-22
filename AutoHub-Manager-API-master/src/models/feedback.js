import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({

Name: String,
email: {
    type: String,
    required:true,
    unique: true
   
},
  message: String,
  submissionDate: { type: Date, default: Date.now },
  isSeen: { type: Boolean, default: false },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback
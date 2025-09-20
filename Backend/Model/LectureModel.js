import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  videoUrl: {
    type: String,
    default: ""
  },
  duration: {
    type: Number,
    default: 0
  },
  isPreviewFree: {
    type: Boolean,
    default: false
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
}, {
  timestamps: true
});

const Lecture = mongoose.model('Lecture', lectureSchema);
export default Lecture;
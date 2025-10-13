
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() {
      return this.authProvider === 'local' || !this.authProvider;
    },
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["student", "educator", "admin"],
    default: "student",
  },
  photoUrl: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  }],
}, {
  timestamps: true,
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.authProvider === 'google') {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.authProvider === 'google') {
    throw new Error('Google users do not have passwords');
  }
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.addEnrolledCourse = async function(courseId) {
  if (!this.enrolledCourses.includes(courseId)) {
    this.enrolledCourses.push(courseId);
    await this.save();
  }
  return this;
};

userSchema.methods.isEnrolledIn = function(courseId) {
  return this.enrolledCourses.some(id => id.toString() === courseId.toString());
};

export default mongoose.model('User', userSchema);
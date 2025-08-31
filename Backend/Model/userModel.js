// Backend - Updated User Schema (models/User.js)
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
      // Only require password for local auth users
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
}, {
  timestamps: true,
});

// Hash password before saving (only for local auth users)
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and user is local auth
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

// Compare password method (only for local auth users)
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.authProvider === 'google') {
    throw new Error('Google users do not have passwords');
  }
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
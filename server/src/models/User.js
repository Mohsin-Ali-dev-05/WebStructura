import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name must be at most 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, 'Email must be at most 254 characters'],
      match: [EMAIL_REGEX, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [
        function passwordRequired() {
          return !this.googleId;
        },
        'Password is required',
      ],
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: undefined,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: null,
      maxlength: [2048, 'Avatar URL is too long'],
    },
    avatarPublicId: {
      type: String,
      default: null,
      select: false,
      maxlength: [512, 'Avatar public id is too long'],
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    strict: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.avatarPublicId;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.methods.comparePassword = async function comparePassword(
  plainPassword,
) {
  if (!this.passwordHash) {
    return false;
  }
  return bcrypt.compare(plainPassword, this.passwordHash);
};

/**
 * Creates a one-time reset token (20-char hex). Returns the plain token for
 * emailing; only the SHA-256 hash is persisted on the user document.
 */
userSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const resetToken = crypto.randomBytes(10).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

  return resetToken;
};

userSchema.statics.hashPassword = async function hashPassword(plainPassword) {
  const saltRounds = 10;
  return bcrypt.hash(plainPassword, saltRounds);
};

userSchema.statics.hashResetToken = function hashResetToken(plainToken) {
  return crypto.createHash('sha256').update(plainToken).digest('hex');
};

const User = mongoose.model('User', userSchema);

export { EMAIL_REGEX };
export default User;

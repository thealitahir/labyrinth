import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

/**
   * @remarks
     User Model Schema
   *
*/
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [30, "name must be less than 30 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true, // Ensures email is unique
    validate: {
      validator: (value) => {
        // Use a regular expression to validate email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(value);
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "password must be atleast of 8 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


userSchema.pre('save', async function (next) {  
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10); // Hash the password
      this.password = hashedPassword; // Update the password with the hashed version
      next();
    } catch (error) {
      return next(error);
    }
  });

export default mongoose.model("Users", userSchema);

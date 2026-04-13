import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, default: "" },
  about: { type: String, default: "" },
  role: { type: String, default: "developer" },
  resetPasswordTokenHash: { type: String },
  resetPasswordExpiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);

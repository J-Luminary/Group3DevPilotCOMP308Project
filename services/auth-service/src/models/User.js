import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, default: "" },
  about: { type: String, default: "" },
  title: { type: String, default: "" },
  company: { type: String, default: "" },
  location: { type: String, default: "" },
  website: { type: String, default: "" },
  github: { type: String, default: "" },
  phone: { type: String, default: "" },
  role: { type: String, default: "developer" },
  resetPasswordTokenHash: { type: String },
  resetPasswordExpiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);

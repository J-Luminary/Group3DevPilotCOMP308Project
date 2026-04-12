import mongoose from "mongoose";

const draftSchema = new mongoose.Schema({
  content: { type: String, required: true },
  version: { type: Number, default: 1 },
  authorId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  drafts: [draftSchema],
  createdAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  ownerId: { type: String, required: true },
  features: [featureSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Project", projectSchema);

import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  type: String,
  severity: String,
  description: String
}, { _id: false });

const citationSchema = new mongoose.Schema({
  source: String,
  snippet: String
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  draftId: { type: String, required: true, index: true },
  projectId: String,
  featureId: String,
  summary: String,
  issues: [issueSchema],
  suggestions: [String],
  confidence: Number,
  citations: [citationSchema],
  reflectionNotes: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Review", reviewSchema);

import Review from "./models/Review.js";
import { runReview } from "./rag/reviewGraph.js";

function requireAuth(req) {
  if (!req.session?.userId) throw new Error("not authenticated");
}

export const resolvers = {
  Query: {
    async reviewsForDraft(_, { draftId }, { req }) {
      requireAuth(req);
      return Review.find({ draftId }).sort({ createdAt: -1 });
    }
  },
  Mutation: {
    async generateReview(_, { draftId, draftContent }, { req }) {
      requireAuth(req);
      if (!draftContent || draftContent.trim().length < 10) {
        throw new Error("draft too short to review");
      }
      const { review, reflection } = await runReview(draftContent);
      const saved = await Review.create({
        draftId,
        summary: review.summary,
        issues: review.issues,
        suggestions: review.suggestions,
        confidence: review.confidence,
        citations: review.citations,
        reflectionNotes: reflection.notes
      });
      return saved;
    }
  }
};

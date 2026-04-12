import Project from "./models/Project.js";

function requireAuth(req) {
  if (!req.session?.userId) throw new Error("not authenticated");
  return req.session.userId;
}

export const resolvers = {
  Query: {
    async myProjects(_, __, { req }) {
      const userId = requireAuth(req);
      return Project.find({ ownerId: userId }).sort({ createdAt: -1 });
    },
    async project(_, { id }, { req }) {
      const userId = requireAuth(req);
      const p = await Project.findById(id);
      if (!p || p.ownerId !== userId) return null;
      return p;
    },
    async feature(_, { projectId, featureId }, { req }) {
      const userId = requireAuth(req);
      const p = await Project.findById(projectId);
      if (!p || p.ownerId !== userId) return null;
      return p.features.id(featureId);
    },
    async draft(_, { projectId, featureId, draftId }, { req }) {
      const userId = requireAuth(req);
      const p = await Project.findById(projectId);
      if (!p || p.ownerId !== userId) return null;
      const f = p.features.id(featureId);
      return f ? f.drafts.id(draftId) : null;
    }
  },
  Mutation: {
    async createProject(_, { name, description }, { req }) {
      const userId = requireAuth(req);
      return Project.create({ name, description, ownerId: userId, features: [] });
    },
    async addFeature(_, { projectId, title, description }, { req }) {
      const userId = requireAuth(req);
      const p = await Project.findById(projectId);
      if (!p || p.ownerId !== userId) throw new Error("project not found");
      p.features.push({ title, description, drafts: [] });
      await p.save();
      return p.features[p.features.length - 1];
    },
    async submitDraft(_, { projectId, featureId, content }, { req }) {
      const userId = requireAuth(req);
      const p = await Project.findById(projectId);
      if (!p || p.ownerId !== userId) throw new Error("project not found");
      const feat = p.features.id(featureId);
      if (!feat) throw new Error("feature not found");
      const next = feat.drafts.length + 1;
      feat.drafts.push({ content, version: next, authorId: userId });
      await p.save();
      return feat.drafts[feat.drafts.length - 1];
    }
  },
  Project: {
    __resolveReference: (ref) => Project.findById(ref.id)
  }
};

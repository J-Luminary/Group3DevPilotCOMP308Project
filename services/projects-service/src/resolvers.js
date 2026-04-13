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
    },
    async draftsByFeature(_, { projectId, featureId }, { req }) {
      const userId = requireAuth(req);
      const p = await Project.findById(projectId);
      if (!p || p.ownerId !== userId) return [];
      const f = p.features.id(featureId);
      if (!f) return [];
      return [...f.drafts].sort((a, b) => b.version - a.version);
    }
  },
  Mutation: {
    async createProject(_, { name, description }, { req }) {
      const userId = requireAuth(req);
      return Project.create({ name, description, ownerId: userId, features: [] });
    },
    async updateProject(_, { projectId, name, description }, { req }) {
      const userId = requireAuth(req);
      const p = await Project.findById(projectId);
      if (!p || p.ownerId !== userId) throw new Error("project not found");
      p.name = name;
      p.description = description;
      await p.save();
      return p;
    },
    async deleteProject(_, { projectId }, { req }) {
      const userId = requireAuth(req);
      const p = await Project.findById(projectId);
      if (!p || p.ownerId !== userId) throw new Error("project not found");
      await Project.deleteOne({ _id: projectId, ownerId: userId });
      return true;
    },
    async addFeature(_, { projectId, title, description }, { req }) {
      const userId = requireAuth(req);
      const p = await Project.findById(projectId);
      if (!p || p.ownerId !== userId) throw new Error("project not found");
      p.features.push({ title, description, drafts: [] });
      await p.save();
      return p.features[p.features.length - 1];
    },
    async updateFeature(_, { projectId, featureId, title, description }, { req }) {
      const userId = requireAuth(req);
      const p = await Project.findById(projectId);
      if (!p || p.ownerId !== userId) throw new Error("project not found");
      const feat = p.features.id(featureId);
      if (!feat) throw new Error("feature not found");
      feat.title = title;
      feat.description = description;
      await p.save();
      return feat;
    },
    async deleteFeature(_, { projectId, featureId }, { req }) {
      const userId = requireAuth(req);
      const p = await Project.findById(projectId);
      if (!p || p.ownerId !== userId) throw new Error("project not found");
      const feat = p.features.id(featureId);
      if (!feat) throw new Error("feature not found");
      feat.deleteOne();
      await p.save();
      return true;
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
    },
    async updateDraft(_, { projectId, featureId, draftId, content }, { req }) {
      const userId = requireAuth(req);
      const p = await Project.findById(projectId);
      if (!p || p.ownerId !== userId) throw new Error("project not found");
      const feat = p.features.id(featureId);
      if (!feat) throw new Error("feature not found");
      const draft = feat.drafts.id(draftId);
      if (!draft) throw new Error("draft not found");
      draft.content = content;
      await p.save();
      return draft;
    },
    async deleteDraft(_, { projectId, featureId, draftId }, { req }) {
      const userId = requireAuth(req);
      const p = await Project.findById(projectId);
      if (!p || p.ownerId !== userId) throw new Error("project not found");
      const feat = p.features.id(featureId);
      if (!feat) throw new Error("feature not found");
      const draft = feat.drafts.id(draftId);
      if (!draft) throw new Error("draft not found");
      draft.deleteOne();
      await p.save();
      return true;
    }
  },
  Project: {
    async __resolveReference(ref, { req }) {
      const userId = requireAuth(req);
      return Project.findOne({ _id: ref.id, ownerId: userId });
    }
  }
};

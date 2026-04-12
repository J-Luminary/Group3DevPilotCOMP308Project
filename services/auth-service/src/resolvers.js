import bcrypt from "bcryptjs";
import User from "./models/User.js";

export const resolvers = {
  Query: {
    async currentUser(_, __, { req }) {
      if (!req.session?.userId) return null;
      return User.findById(req.session.userId);
    }
  },
  Mutation: {
    async register(_, { username, email, password }, { req }) {
      if (!username || !email || !password) {
        throw new Error("missing fields");
      }
      const exists = await User.findOne({ $or: [{ email }, { username }] });
      if (exists) throw new Error("user already exists");
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, passwordHash });
      req.session.userId = user.id;
      return { user, message: "registered" };
    },
    async login(_, { email, password }, { req }) {
      const user = await User.findOne({ email });
      if (!user) throw new Error("invalid credentials");
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) throw new Error("invalid credentials");
      req.session.userId = user.id;
      return { user, message: "logged in" };
    },
    async logout(_, __, { req }) {
      return new Promise((resolve) => {
        req.session.destroy(() => resolve(true));
      });
    }
  },
  User: {
    __resolveReference: (ref) => User.findById(ref.id)
  }
};

import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "./models/User.js";

export const resolvers = {
  Query: {
    async currentUser(_, __, { req }) {
      if (!req.session?.userId) return null;
      return User.findById(req.session.userId);
    },
    async recoverEmail(_, { username }) {
      const user = await User.findOne({ username });
      return user?.email || null;
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
      const user = await User.create({ username, email, passwordHash, fullName: username });
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
    },
    async requestPasswordReset(_, { email }) {
      const user = await User.findOne({ email });
      if (!user) {
        return {
          message: "If that email exists, a reset link has been issued.",
          resetToken: null
        };
      }

      const token = crypto.randomBytes(24).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      user.resetPasswordTokenHash = tokenHash;
      user.resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 15);
      await user.save();

      // Dev-only helper: this project does not send real emails yet.
      console.log(`[auth] password reset token for ${email}: ${token}`);

      return {
        message: "Password reset token generated. Use it to set a new password.",
        resetToken: token
      };
    },
    async resetPassword(_, { token, newPassword }, { req }) {
      if (!token || !newPassword) throw new Error("missing fields");
      if (newPassword.length < 6) throw new Error("password must be at least 6 characters");

      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const user = await User.findOne({
        resetPasswordTokenHash: tokenHash,
        resetPasswordExpiresAt: { $gt: new Date() }
      });
      if (!user) throw new Error("invalid or expired reset token");

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      user.resetPasswordTokenHash = undefined;
      user.resetPasswordExpiresAt = undefined;
      await user.save();

      req.session.userId = user.id;
      return { user, message: "password reset successful" };
    },
    async updateProfile(_, { username, email, fullName, about, title, company, location, website, github, phone }, { req }) {
      if (!req.session?.userId) throw new Error("not authenticated");
      if (!username?.trim() || !email?.trim()) throw new Error("username and email are required");

      const user = await User.findById(req.session.userId);
      if (!user) throw new Error("user not found");

      const duplicate = await User.findOne({
        _id: { $ne: user._id },
        $or: [{ username }, { email }]
      });
      if (duplicate) throw new Error("username or email already in use");

      user.username = username.trim();
      user.email = email.trim();
      user.fullName = (fullName || "").trim();
      user.about = (about || "").trim();
      user.title = (title || "").trim();
      user.company = (company || "").trim();
      user.location = (location || "").trim();
      user.website = (website || "").trim();
      user.github = (github || "").trim();
      user.phone = (phone || "").trim();
      await user.save();

      return { user, message: "profile updated" };
    },
    async changePassword(_, { currentPassword, newPassword }, { req }) {
      if (!req.session?.userId) throw new Error("not authenticated");
      if (!currentPassword || !newPassword) throw new Error("missing fields");
      if (newPassword.length < 6) throw new Error("password must be at least 6 characters");

      const user = await User.findById(req.session.userId);
      if (!user) throw new Error("user not found");

      const ok = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!ok) throw new Error("current password is incorrect");

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await user.save();

      return { user, message: "password updated" };
    },
    async deleteAccount(_, { currentPassword }, { req }) {
      if (!req.session?.userId) throw new Error("not authenticated");
      if (!currentPassword) throw new Error("password is required");

      const user = await User.findById(req.session.userId);
      if (!user) return true;

      const ok = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!ok) throw new Error("current password is incorrect");

      await User.deleteOne({ _id: user._id });
      return new Promise((resolve) => {
        req.session.destroy(() => resolve(true));
      });
    }
  },
  User: {
    __resolveReference: (ref) => User.findById(ref.id)
  }
};

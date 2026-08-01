import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: "Missing token" });
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    const user = await User.findById(payload.uid);
    if (!user) return res.status(401).json({ success: false, message: "Invalid token" });
    req.user = { id: user._id.toString(), email: user.email };
    next();
  } catch (_e) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const requireAdminEmail = (req, res, next) => {
  if (
    process.env.ADMIN_EMAIL &&
    req.user?.email?.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
  ) {
    return next();
  }
  return res.status(403).json({ success: false, message: "Not authorized" });
};



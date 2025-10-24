import admin from "../firebase/firebaseAdmin.js";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodeToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ uid: decodeToken.uid });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

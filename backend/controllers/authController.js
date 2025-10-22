import User from "../models/User.js";
import admin from "../firebase/firebaseAdmin.js";

export const signup = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded.email_verified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error : ", err);
    res.status(500).json({ message: "Invalid token" });
  }
};

export const login = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decodeToken = await admin.auth().verifyIdToken(token);

    if (!decodeToken.email_verified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging..." });
    }

    const uid = decodeToken.uid;
    const firebaseUser = await admin.auth().getUser(uid);
    const email = firebaseUser.email;

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        email,
        username: email.split("@")[0],
      });
      await user.save();
    }
    res.status(200).json({ message: "Login Successful", user });
  } catch (err) {
    console.error("Error : ", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const checkUser = async (req, res) => {
  try {
    if (req.user.isNewUser) {
      return res.status(200).json({
        message: "New user detected",
        isNewUser: true,
        uid: req.user.uid,
        email: req.user.email,
      });
    }

    const { id } = req.user;
    const user = await User.findById(id).select(
      "-password -createdAt -updatedAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in checkUser:", err);
    res.status(500).json({ message: "Something went wrong with server" });
  }
};

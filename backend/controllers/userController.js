import User from "../models/User.js";

export const updateUsername = async (req, res) => {
  const { username } = req.body;
  const user = req.user;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("already exist");
      return res.status(400).json({ message: "Username already taken" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { username },
      { new: true }
    );
    res.status(200).json({ message: "username updated." });
  } catch (err) {
    console.error("Error : ", err);
    res.status(500).json({ message: "Internal error" });
  }
};

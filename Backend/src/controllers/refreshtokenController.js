const { signAccess } = require("../helpers/tokenHelper");
const { User, RefreshToken } = require("../models");

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc || tokenDoc.expiresAt < new Date())
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });

    const user = await User.findById(tokenDoc.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const accessToken = signAccess(user);

    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};

module.exports = { refreshAccessToken };

const { createRefresh, signAccess } = require("../helpers/tokenHelper");
const { User } = require("../models");

const register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      role = "patient",
    } = req.body || {};

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      email,
      password: passwordHash,
      firstName,
      lastName,
      role,
    });

    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: "Registered successfully. Please log in.",
    });
  } catch (err) {
    console.error("REGISTER_ERROR", err);
    return res.status(500).json({ message: "Internal error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    console.log("user", user);
    if (!user)
      return res
        .status(401)
        .json({ message: `cannot find any email :${email}` });

    if (!user.isActive)
      return res.status(403).json({ message: "Account disabled" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "password is incorrect" });

    const accessToken = signAccess(user);
    const refreshToken = await createRefresh(user);

    return res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("LOGIN_ERROR", err);
    return res.status(500).json({ message: "Internal error" });
  }
};

module.exports = { register, login };

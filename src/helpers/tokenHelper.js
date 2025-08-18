const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { RefreshToken } = require("../models");

const ACCESS_TTL = process.env.ACCESS_TTL || "15m";
const REFRESH_TTL_DAYS = parseInt(process.env.REFRESH_TTL_DAYS || "30", 10);

const signAccess = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TTL }
  );
};

async function createRefresh(user) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(
    Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000
  );

  await RefreshToken    .create({
    user: user._id,
    token,
    expiresAt,
  });

  return token;
}

module.exports = { createRefresh, signAccess };

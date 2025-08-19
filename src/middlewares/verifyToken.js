const jwt = require("jsonwebtoken");

exports.authenticate = (roles = []) => {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header)
      return res.status(401).json({ message: "Authorization header missing" });

    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token || token.trim() === "")
      return res.status(401).json({ message: "Token missing or invalid" });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: payload.sub, role: payload.role };
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (e) {
      console.error("Authentication error:", e.message);
      if (e.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

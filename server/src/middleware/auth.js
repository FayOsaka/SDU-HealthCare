const jwt = require("jsonwebtoken");
const SECRET = "mysecretkey";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("Auth header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token:", token);

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verify error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

const db = require("../models/database");
const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey";

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const sql = `
      SELECT users_id, username, role, student_id, firstname, lastname
      FROM users
      WHERE username = ? AND password = ?
      LIMIT 1
    `;

    const [results] = await db.query(sql, [username, password]);

    if (!results || results.length === 0) {
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    const user = results[0];

    const token = jwt.sign(
      { users_id: user.users_id, username: user.username, role: user.role },
      SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token, user });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

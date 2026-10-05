import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";

async function loginRequest({ username, password }) {
  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  console.log("Login response:", data); // Debug

  if (!res.ok) {
    throw new Error(data.message || "เข้าสู่ระบบไม่สำเร็จ");
  }

  return data;
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginRequest({ username, password });

      console.log("Data received:", data); // Debug
      console.log("Data.token:", data.token); // Debug
      console.log("Data.user:", data.user); // Debug

      // ตรวจสอบว่า response มี token และ user
      if (!data || !data.token || !data.user) {
        throw new Error("ข้อมูลการเข้าสู่ระบบไม่สมบูรณ์");
      }

      // เก็บข้อมูลใน context
      login({
        token: data.token,
        user: data.user
      });

      // นำทางตามบทบาท
      if (data.user.role === "staff") {
        navigate("/staff-home");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT CONTENT */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
              <i className="fa fa-medkit text-4xl" aria-hidden="true"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              ระบบช่วยตรวจสอบอาการ
              <span className="block text-blue-500">และนัดหมายห้องพยาบาล</span>
            </h1>
          </div>

          <p className="text-gray-600 mb-8">
            ดูแลสุขภาพนักศึกษา ครบวงจร สะดวกรวดเร็ว ตั้งแต่ประเมินอาการเบื้องต้น
            จนถึงการจองคิวพบเจ้าหน้าที่
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: (
                  <i
                    className="fa fa-pencil-square-o text-blue-500"
                    aria-hidden="true"
                  ></i>
                ),
                title: "ประเมินอาการ",
                desc: "ทำแบบประเมินอาการเบื้องต้นได้ด้วยตนเอง",
              },
              {
                icon: (
                  <i
                    className="fa fa-calendar text-green-500"
                    aria-hidden="true"
                  ></i>
                ),
                title: "จองคิวนัดหมาย",
                desc: "เลือกเวลาพบเจ้าหน้าที่ห้องพยาบาลได้ทันที",
              },
              {
                icon: (
                  <i
                    className="fa fa-history text-purple-500"
                    aria-hidden="true"
                  ></i>
                ),
                title: "ดูประวัติการรักษา",
                desc: "ติดตามข้อมูลสุขภาพย้อนหลังได้ตลอดเวลา",
              },
              {
                icon: (
                  <i
                    className="fa fa-phone text-pink-500"
                    aria-hidden="true"
                  ></i>
                ),
                title: "ติดต่อเจ้าหน้าที่",
                desc: "ช่องทางสื่อสารโดยตรงกับพยาบาลวิชาชีพ",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="mb-1">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="font-semibold text-gray-800">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT LOGIN CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 pb-3 text-center font-medium ${
                tab === "login"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-400"
              }`}
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => setTab("register")}
              className={`flex-1 pb-3 text-center font-medium ${
                tab === "register"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-400"
              }`}
            >
              สมัครสมาชิก
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            ยินดีต้อนรับกลับมา
          </h2>
          <p className="text-gray-500 mb-6">กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="text-sm text-gray-600">
                รหัสนักศึกษา / อีเมล
              </label>
              <input
                type="text"
                placeholder="u6XXXXXXX"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded" />
                จดจำฉันไว้
              </label>
              <a href="#" className="text-blue-500 hover:underline">
                ลืมรหัสผ่าน?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 text-center text-gray-400 text-sm">
            หรือเข้าสู่ระบบด้วย
          </div>
        </div>
      </div>
    </div>
  );
}

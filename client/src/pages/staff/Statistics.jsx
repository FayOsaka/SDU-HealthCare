import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authcontext";

// components
import Aside from "../../components/staff/aside.jsx";
import Nav from "../../components/staff/nav.jsx";
import Footer from "../../components/staff/footer.jsx";

export default function AppointmentSchedule() {
  const { token } = useAuth();
  const [stats, setStats] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("กรุณาเข้าสู่ระบบ");
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/statistics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data.stats || []);
        setHistory(res.data.history || []);
      } catch (err) {
        console.error("Fetch statistics error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "ไม่สามารถดึงข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [token]);

  const statusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";
    const s = status.toLowerCase();
    if (s.includes("เสร็จ") || s.includes("completed")) return "bg-green-100 text-green-600";
    if (s.includes("กำลัง") || s.includes("treat")) return "bg-yellow-100 text-yellow-600";
    if (s.includes("ส่งต่อ") || s.includes("referred")) return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex">
      <Aside />
      <div className="flex-1 flex flex-col">
        <Nav />
        <div className="flex-1 p-6 flex items-center justify-center"><p>กำลังโหลด...</p></div>
        <Footer />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex">
      <Aside />
      <div className="flex-1 flex flex-col ">
        <Nav />
        <div className="p-6 flex-1">
          <div className="flex justify-between items-center">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">สถิตินักศึกษาที่มาใช้บริการ</h1>
              <p className="text-sm text-gray-500">ข้อมูลสรุปภาพรวมการเข้ารับบริการประจำเดือน</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color || "bg-gray-100 text-gray-600"}`}>
                  <i className="fa fa-bar-chart" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{s.title}</p>
                  <p className="text-xl font-bold text-gray-800">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-700">ประวัติการเข้ารับบริการล่าสุด</h2>
              <input type="text" placeholder="ค้นหารหัสนักศึกษา" className="border rounded-lg px-3 py-2 text-sm" />
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">วัน/เวลา</th>
                  <th>รหัสนักศึกษา</th>
                  <th>ชื่อ-สกุล</th>
                  <th>อาการเบื้องต้น</th>
                  <th>การรักษา</th>
                  <th>สถานะ</th>
                </tr>
              </thead>

              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3">{h.date ? new Date(h.date).toLocaleString("th-TH") : "-"}</td>
                    <td>{h.id || "-"}</td>
                    <td>{h.fullname || "-"}</td>
                    <td>{h.symptoms}</td>
                    <td>{h.treatment}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs ${statusColor(h.status)}`}>{h.status}</span>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-4 text-gray-500 text-center">ไม่มีประวัติ</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

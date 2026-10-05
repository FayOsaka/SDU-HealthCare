import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authcontext";

// components
import Aside from "../../components/user/aside.jsx";
import Footer from "../../components/user/footer.jsx";
import Nav from "../../components/user/nav.jsx";

export default function TreatmentHistory() {
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // คำนวณปีปัจจุบัน (ค.ศ. -> พ.ศ., บวก 543)
  const currentYear = new Date().getFullYear() + 543;
  const years = [currentYear, currentYear - 1, currentYear - 2];

  useEffect(() => {
    setSelectedYear(currentYear); // ตั้งค่าเริ่มต้นเป็นปีปัจจุบัน
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("กรุณาเข้าสู่ระบบเพื่อดูประวัติการรักษา");
      return;
    }

    const fetchRecords = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/records", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(res.data.records || []);
      } catch (err) {
        console.error(
          "Fetch records error:",
          err.response?.data || err.message,
        );
        setError(err.response?.data?.message || "ไม่สามารถดึงข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [token]);

  // กรองข้อมูลตามปีที่เลือก
  const filteredRecords = records.filter((r) => {
    if (!selectedYear || !r.visit_date) return true;
    const recordYear = new Date(r.visit_date).getFullYear() + 543;
    return recordYear === selectedYear;
  });

  const latest = filteredRecords[0] || null;
  const summaryCount = filteredRecords.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex">
      <Aside />

      <div className="flex-1 flex flex-col">
        <Nav />

        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              ประวัติการรักษา{" "}
              <span className="text-gray-400">(Treatment History)</span>
            </h2>
          </div>

          <div className="flex gap-3 mb-6">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">ปีการศึกษาทั้งหมด</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  ปีการศึกษา {year}
                </option>
              ))}
            </select>
            <select className="border rounded-lg px-3 py-2 text-sm">
              <option>ประเภททั้งหมด</option>
            </select>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* จำนวนครั้งที่รับบริการ */}
            <div className="bg-white border rounded-xl shadow-sm p-5 flex items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                <i className="fa fa-clipboard"></i>
              </div>

              {/* Content */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  จำนวนครั้งที่รับบริการ
                </p>
                <h3 className="text-2xl font-semibold text-blue-600">
                  {summaryCount} ครั้ง
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  ข้อมูลการเข้ารับบริการทั้งหมด
                </p>
              </div>
            </div>

            {/* การรักษาล่าสุด */}
            <div className="bg-white border rounded-xl shadow-sm p-5 flex items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-xl">
                <i className="fa fa-stethoscope"></i>
              </div>

              {/* Content */}
              <div>
                <p className="text-sm text-gray-500 mb-1">การรักษาล่าสุด</p>
                <h3 className="text-lg font-semibold text-gray-800">
                  {latest ? latest.diagnosis || latest.treatment || "-" : "-"}
                </h3>
                {latest && latest.visit_date && (
                  <p className="text-xs text-gray-400 mt-1">
                    วันที่เข้ารับบริการ{" "}
                    {new Date(latest.visit_date).toLocaleDateString("th-TH")}
                  </p>
                )}
              </div>
            </div>

            {/* นัดหมายครั้งถัดไป */}
            <div className="bg-white border rounded-xl shadow-sm p-5 flex items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                <i className="fa fa-calendar"></i>
              </div>

              {/* Content */}
              <div>
                <p className="text-sm text-gray-500 mb-1">นัดหมายครั้งถัดไป</p>
                <h3 className="text-lg font-semibold text-gray-800">-</h3>
                <p className="text-xs text-gray-400 mt-1">
                  ยังไม่มีนัดหมายที่กำลังจะมาถึง
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-6 bg-white rounded-xl shadow">กำลังโหลด...</div>
          ) : error ? (
            <div className="p-6 bg-red-50 rounded-xl shadow text-red-600">
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow">
              <div className="px-6 py-4 border-b font-medium">
                รายการประวัติการรักษา
              </div>

              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left">วันที่ / เวลา</th>
                    <th className="px-6 py-3 text-left">อาการเบื้องต้น</th>
                    <th className="px-6 py-3 text-left">
                      การวินิจฉัย / การรักษา
                    </th>
                    <th className="px-6 py-3 text-left">ผู้ตรวจ</th>
                    <th className="px-6 py-3 text-left">สถานะ</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-gray-500">
                        ไม่มีประวัติการรักษา
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => (
                      <tr key={r.medical_id} className="border-t">
                        <td className="px-6 py-4">
                          <div>
                            {r.visit_date
                              ? new Date(r.visit_date).toLocaleDateString(
                                  "th-TH",
                                )
                              : "-"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {r.visit_date
                              ? new Date(r.visit_date).toLocaleTimeString(
                                  "th-TH",
                                  { hour: "2-digit", minute: "2-digit" },
                                )
                              : ""}
                          </div>
                        </td>
                        <td className="px-6 py-4">{r.symptoms || "-"}</td>
                        <td className="px-6 py-4">
                          {r.diagnosis || r.treatment || "-"}
                        </td>
                        <td className="px-6 py-4">{r.doctor || "-"}</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                            {r.status || "เสร็จสิ้น"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-green-600 text-sm hover:underline cursor-pointer">
                          รายละเอียด
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-500">
                <span>แสดง {filteredRecords.length} รายการ</span>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function SummaryCard({ title, value, sub }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

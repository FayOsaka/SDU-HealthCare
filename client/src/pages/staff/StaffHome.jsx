import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";

// components
import Aside from "../../components/staff/aside.jsx";
import Nav from "../../components/staff/nav.jsx";
import Footer from "../../components/staff/footer.jsx";

export default function StaffHome() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [todayStats, setTodayStats] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("กรุณาเข้าสู่ระบบ");
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/staff/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setTodayStats(res.data.todayStats || []);
        setAppointments(res.data.appointments || []);
        setRecentCases(res.data.recentCases || []);
      } catch (err) {
        console.error(
          "Fetch dashboard error:",
          err.response?.data || err.message,
        );
        setError(err.response?.data?.message || "ไม่สามารถดึงข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex">
        <Aside />
        <div className="flex-1 flex flex-col">
          <Nav />
          <div className="flex-1 p-6 flex items-center justify-center">
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex">
        <Aside />
        <div className="flex-1 flex flex-col">
          <Nav />
          <div className="flex-1 p-6 flex items-center justify-center">
            <p className="text-red-600">{error}</p>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex">
      {/* Sidebar */}
      <Aside />

      {/* Right Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <Nav />

        {/* Main Content */}
        <div className="p-6 flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              แดชบอร์ดเจ้าหน้าที่ห้องพยาบาล
            </h1>
            <p className="text-sm text-gray-500">
              ภาพรวมการให้บริการและสถานะผู้ป่วยวันนี้
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {todayStats.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow p-5 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg
                    ${i === 0 ? "bg-blue-100 text-blue-600" : ""}
                    ${i === 1 ? "bg-yellow-100 text-yellow-600" : ""}
                    ${i === 2 ? "bg-green-100 text-green-600" : ""}
                    ${i === 3 ? "bg-red-100 text-red-600" : ""}
                  `}
                >
                  <i className={`fa ${s.icon}`} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">{s.title}</p>
                  <p className="text-xl font-bold text-gray-800">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Today Appointments */}
            <div className="col-span-2 bg-white rounded-xl shadow p-6">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-gray-700">นัดหมายวันนี้</h2>
                <button
                  onClick={() => navigate("/appointment-schedule")}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  ดูทั้งหมด
                </button>
              </div>

              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <p className="text-gray-500 text-sm">ไม่มีนัดหมายวันนี้</p>
                ) : (
                  appointments.map((a, i) => {
                    const typeColor =
                      a.reason?.includes("เร่งด่วน") ||
                      a.reason?.includes("ฉุกเฉิน")
                        ? "text-red-500"
                        : a.reason?.includes("ติดตาม")
                          ? "text-blue-500"
                          : "text-yellow-500";

                    return (
                      <div
                        key={i}
                        className="flex justify-between items-center border rounded-lg p-4"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {a.fullname}
                          </p>
                          <p className={`text-sm ${typeColor}`}>
                            {a.reason || "ไม่ระบุ"}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-700">{a.time}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent Cases - Completed Only */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  เคสที่เสร็จสิ้นวันนี้
                </h2>
                <span className="text-sm text-gray-500">
                  ทั้งหมด {recentCases.length} รายการ
                </span>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {recentCases.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">
                      ไม่มีเคสที่เสร็จสิ้นในวันนี้
                    </p>
                  </div>
                ) : (
                  recentCases.map((c, i) => (
                    <div
                      key={i}
                      className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition bg-gray-50"
                    >
                      {/* Top section */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900 text-base">
                            {c.fullname}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            วันที่เข้ารับบริการ:{" "}
                            {c.visit_date
                              ? new Date(c.visit_date).toLocaleString("th-TH")
                              : "-"}
                          </p>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          เสร็จสิ้น
                        </span>
                      </div>

                      {/* Detail section */}
                      <div className="grid grid-cols-2 gap-4 text-sm border-t pt-3">
                        <div>
                          <p className="text-gray-500 mb-1">อาการ</p>
                          <p className="text-gray-800 font-medium">
                            {c.symptoms || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">
                            การวินิจฉัย / การรักษา
                          </p>
                          <p className="text-gray-800 font-medium">
                            {c.diagnosis || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

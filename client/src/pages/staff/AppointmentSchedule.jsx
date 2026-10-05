import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authcontext";

// components
import Aside from "../../components/staff/aside.jsx";
import Nav from "../../components/staff/nav.jsx";
import Footer from "../../components/staff/footer.jsx";

export default function AppointmentSchedule() {
  const { token, authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("Pending");
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, Pending: 0, Completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (!token || authLoading) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);

        const config = {
          headers: { Authorization: `Bearer ${token}` },
          params: activeTab !== "all" ? { status: activeTab } : {},
        };

        const [appRes, statsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/appointment-schedule", config),
          axios.get("http://localhost:5000/api/appointment-schedule/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAppointments(appRes.data || []);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, activeTab, authLoading]);

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointment-schedule/${appointmentId}/status`,
        { status: "completed" },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // อัปเดตสถานะในรายการทันที (ไม่ต้องรีโหลดหน้า)
      setAppointments((prev) =>
        prev.map((a) =>
          a.appointment_id === appointmentId
            ? { ...a, status: "Completed" }
            : a,
        ),
      );

      // อัปเดตสถิติใน state เลย
      setStats((prev) => ({
        total: prev.total,
        pending: Math.max(prev.pending - 1, 0),
        confirmed: prev.confirmed + 1,
      }));
    } catch (err) {
      console.error("Update error:", err);
      alert("ล้มเหลว: " + (err.response?.data?.message || "เกิดข้อผิดพลาด"));
    }
  };

  const getAppointmentType = (reason) => {
    if (!reason) return "ทั่วไป";
    if (reason.includes("เร่ง") || reason.includes("ฉุก")) return "เร่งด่วน";
    if (reason.includes("ติดตาม")) return "ติดตามผล";
    return "ทั่วไป";
  };

  const getAppointmentColor = (reason) => {
    if (!reason) return "border-yellow-400";
    if (reason.includes("เร่ง") || reason.includes("ฉุก"))
      return "border-red-400";
    if (reason.includes("ติดตาม")) return "border-blue-400";
    return "border-yellow-400";
  };

  // normalize filtering
  const filtered =
    activeTab === "all"
      ? appointments
      : appointments.filter(
          (a) =>
            (a.status || "").toString().toLowerCase().trim() ===
            String(activeTab).toLowerCase().trim(),
        );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filtered.slice(
    startIdx,
    startIdx + itemsPerPage,
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex">
      {/* Sidebar */}
      <Aside />

      {/* Right Content */}
      <div className="flex-1 flex flex-col ">
        {/* Top Nav */}
        <Nav />

        {/* Main Content */}
        <div className="p-6 flex-1">
          <div className="flex justify-between items-center mb-6 ">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                จัดการตารางนัดหมาย (Appointments)
              </h1>
              <p className="text-sm text-gray-500">
                จัดการคิว ตรวจสอบอาการ และอนุมัตินัดหมาย
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-4 gap-6">
            {/* Left Panel */}
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">นัดหมายวันนี้</p>
                <p className="text-xl font-bold text-blue-600">
                  {stats.total} รายการ
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">รอการอนุมัติ</p>
                <p className="text-xl font-bold text-orange-600">
                  {stats.pending} รายการ
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">ยืนยันแล้ว</p>
                <p className="text-xl font-bold text-green-600">
                  {stats.confirmed} รายการ
                </p>
              </div>

              {/* Mini Calendar */}
              {(() => {
                const today = new Date();

                // แสดงเดือนแบบไทย (เช่น ตุลาคม 2567)
                const thaiMonth = new Intl.DateTimeFormat("th-TH", {
                  month: "long",
                  year: "numeric",
                }).format(today);

                const currentDay = today.getDate();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();

                // จำนวนวันในเดือนปัจจุบัน
                const daysInMonth = new Date(
                  currentYear,
                  currentMonth + 1,
                  0,
                ).getDate();

                // วันแรกของเดือน (0=อาทิตย์)
                const firstDayOfMonth = new Date(
                  currentYear,
                  currentMonth,
                  1,
                ).getDay();

                return (
                  <div className="bg-white rounded-xl shadow p-4">
                    <p className="font-medium mb-3">{thaiMonth}</p>

                    {/* Day names */}
                    <div className="grid grid-cols-7 text-xs text-gray-400 text-center">
                      {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
                        <div key={d}>{d}</div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-2 mt-2 text-center text-sm">
                      {/* ช่องว่างก่อนวันแรกของเดือน */}
                      {[...Array(firstDayOfMonth)].map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}

                      {/* วันในเดือน */}
                      {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1;
                        return (
                          <div
                            key={day}
                            className={`p-1 rounded-full ${
                              day === currentDay
                                ? "bg-emerald-500 text-white"
                                : "text-gray-600"
                            }`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right Panel */}
            <div className="col-span-3">
              {/* Tabs */}
              <div className="flex gap-4 mb-4">
                {[
                  { key: "Pending", label: `รอดำเนินการ (${stats.pending})` },
                  {
                    key: "Completed",
                    label: `ยืนยันแล้ว (${stats.confirmed})`,
                  },
                  { key: "all", label: `ทั้งหมด (${stats.total})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      activeTab === tab.key
                        ? "bg-emerald-100 text-emerald-600"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Appointment List */}
              <div className="space-y-4">
                {paginatedAppointments.length === 0 ? (
                  <div className="p-6 bg-white rounded-xl shadow text-center text-gray-500">
                    ไม่มีนัดหมาย
                  </div>
                ) : (
                  paginatedAppointments.map((a) => (
                    <div
                      key={a.appointment_id}
                      className={`bg-white rounded-xl shadow p-5 border-l-4 ${getAppointmentColor(
                        a.reason,
                      )}`}
                    >
                      <div className="flex justify-between items-center">
                        {/* Left Info */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <i className="fa fa-user text-gray-500"></i>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {a.username}
                            </p>
                            <p className="text-sm text-gray-500">
                              รหัสนักศึกษา: {a.student_id || "-"}
                            </p>
                            <p className="text-sm mt-1">
                              <span className="px-2 py-1 rounded text-xs bg-gray-100 mr-2">
                                {getAppointmentType(a.reason)}
                              </span>
                              อาการ : {a.reason || "-"}
                            </p>
                          </div>
                        </div>

                        {/* Right Actions */}
                        <div className="text-right space-y-2">
                          <p className="font-semibold text-gray-800">
                            {a.appointment_time}
                          </p>
                          <p className="text-xs text-gray-500">วันนี้</p>
                          <p
                            className={`text-xs px-2 py-1 rounded inline-block ${
                              (a.status || "").toString().toLowerCase() ===
                              "pending"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {(a.status || "").toString().toLowerCase() ===
                            "pending"
                              ? "รอการอนุมัติ"
                              : "ยืนยันแล้ว"}
                          </p>

                          <div className="flex gap-2 justify-end">
                            <button className="border px-3 py-1 text-xs rounded-lg hover:bg-gray-50">
                              ดูประวัติ
                            </button>
                            {(a.status || "").toString().toLowerCase() ===
                              "pending" && (
                              <button
                                onClick={() =>
                                  handleConfirmAppointment(a.appointment_id)
                                }
                                className="bg-emerald-500 text-white px-3 py-1 text-xs rounded-lg hover:bg-emerald-600"
                              >
                                ยืนยันนัดหมาย
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
                <p>
                  แสดง {startIdx + 1} ถึง{" "}
                  {Math.min(startIdx + itemsPerPage, filtered.length)} จาก{" "}
                  {filtered.length} รายการ
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    ‹
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (totalPages <= 5 || Math.abs(page - currentPage) <= 1) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 border rounded ${
                            currentPage === page
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    ›
                  </button>
                </div>
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

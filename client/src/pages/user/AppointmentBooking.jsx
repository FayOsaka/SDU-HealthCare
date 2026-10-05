import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/authcontext";

// components
import Aside from "../../components/user/aside.jsx";
import Footer from "../../components/user/footer.jsx";
import Nav from "../../components/user/nav.jsx";

export default function AppointmentBooking() {
  const { token } = useAuth();
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);

  // keep a constant master list of all slots so they always render
  const ALL_SLOTS = [
    "09:00 - 09:30",
    "09:30 - 10:00",
    "10:00 - 10:30",
    "10:30 - 11:00",
    "13:00 - 13:30",
    "13:30 - 14:00",
    "14:00 - 14:30",
    "14:30 - 15:00",
  ];

  // remove availableSlots state; derive view from ALL_SLOTS + bookedTimes
  const timesMorning = ALL_SLOTS.filter((t) => t.startsWith("09") || t.startsWith("10"));
  const timesAfternoon = ALL_SLOTS.filter((t) => t.startsWith("13") || t.startsWith("14"));

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  // โหลดเวลาว่างเมื่อเลือกวัน
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate, currentMonth, currentYear]);

  const fetchAvailableSlots = async () => {
    try {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
      const res = await axios.get("http://localhost:5000/api/appointments/available-slots", {
        params: { appointment_date: dateStr },
      });

      // keep all slots visible; server returns bookedTimes to disable
      setBookedTimes(res.data.bookedTimes || []);
      setSelectedTime(""); // reset selected time
    } catch (err) {
      console.error(err);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !reason.trim()) {
      setMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
      const res = await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          appointment_date: dateStr,
          appointment_time: selectedTime,
          reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✓ จองนัดหมายสำเร็จ");
      setSelectedDate(null);
      setSelectedTime("");
      setReason("");
      fetchAvailableSlots(); // refresh
    } catch (err) {
      setMessage(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex">
      {/* Sidebar */}
      <Aside />

      {/* Right Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <Nav />

        {/* Page Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">จองคิวนัดหมาย</h1>
            <p className="text-gray-600 text-sm">
              เลือกวันและเวลาที่คุณต้องการเข้าพบเจ้าหน้าที่ห้องพยาบาล
            </p>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                message.includes("✓")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <i className="fa fa-calendar" aria-hidden="true"></i>{" "}
                  {thaiMonths[currentMonth]} {currentYear + 543}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={prevMonth}
                    className="px-2 text-gray-500 hover:text-blue-500"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextMonth}
                    className="px-2 text-gray-500 hover:text-blue-500"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 text-sm text-gray-500 mb-2">
                {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
                  <div key={d} className="text-center font-medium">
                    {d}
                  </div>
                ))}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-7 gap-3">
                {/* ช่องว่างก่อนวันแรก */}
                {[...Array(firstDayOfMonth(currentMonth, currentYear))].map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* วันในเดือน */}
                {[...Array(daysInMonth(currentMonth, currentYear))].map((_, i) => {
                  const day = i + 1;
                  const dateObj = new Date(currentYear, currentMonth, day);
                  const dayOfWeek = dateObj.getDay(); // 0=อา, 6=ส

                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  const isSelected = day === selectedDate && !isWeekend;
                  const isPast = dateObj < new Date().setHours(0, 0, 0, 0);

                  return (
                    <button
                      key={day}
                      disabled={isWeekend || isPast}
                      onClick={() => !isWeekend && !isPast && setSelectedDate(day)}
                      className={`h-20 rounded-xl border flex flex-col items-center justify-center text-sm
                      ${
                        isWeekend || isPast
                          ? "bg-red-100 text-red-400 cursor-not-allowed"
                          : isSelected
                            ? "bg-blue-500 text-white border-blue-500"
                            : "hover:border-blue-400"
                      }`}
                    >
                      <span className="font-medium">{day}</span>
                      {isWeekend && <span className="text-xs mt-1">ปิด</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold text-gray-800 mb-1">
                {selectedDate
                  ? `${selectedDate} ${thaiMonths[currentMonth]} ${currentYear + 543}`
                  : "กรุณาเลือกวัน"}
              </h3>
              <p className="text-sm text-blue-600 mb-4">
                {timesMorning.length > 0 ? `${timesMorning.length} ช่วง` : "ไม่มีช่วงว่าง"}
              </p>

              {selectedDate && (
                <>
                  <p className="text-sm font-medium mb-2">ช่วงเช้า</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {timesMorning.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        disabled={bookedTimes.includes(time)}
                        className={`border rounded-lg py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                          selectedTime === time
                            ? "bg-blue-500 text-white border-blue-500"
                            : "hover:border-blue-400"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <p className="text-sm font-medium mb-2">ช่วงบ่าย</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {timesAfternoon.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        disabled={bookedTimes.includes(time)}
                        className={`border rounded-lg py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                          selectedTime === time
                            ? "bg-blue-500 text-white border-blue-500"
                            : "hover:border-blue-400"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <p className="text-sm font-medium mb-2">อาการเบื้องต้น</p>
              <textarea
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="ระบุอาการ เช่น ปวดหัว ตัวร้อน..."
                className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <button
                onClick={handleBookAppointment}
                disabled={loading || !selectedDate || !selectedTime}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 transition"
              >
                {loading ? "กำลังจอง..." : "ยืนยันการนัดหมาย"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import axios from "axios";

// components
import Aside from "../../components/user/aside.jsx";
import Footer from "../../components/user/footer.jsx";
import Nav from "../../components/user/nav.jsx";

export default function SymptomAssessment({ student }) {
  const [user, setUser] = useState(null);
  const [severity, setSeverity] = useState(1);
  const [temperature, setTemperature] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const symptomsList = [
    "ไอ / เจ็บคอ",
    "มีน้ำมูก / คัดจมูก",
    "ปวดศีรษะ / เวียนหัว",
    "ปวดเมื่อยตามร่างกาย",
    "ถ่ายเหลว / ท้องเสีย",
    "ผื่นคัน / ลมพิษ",
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom],
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));

      await axios.post(
        "http://localhost:5000/api/form/",
        {
          users_id: payload.users_id,
          temperature,
          symptoms: selectedSymptoms.join(", "),
          severity,
          note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("บันทึกข้อมูลเรียบร้อยแล้ว");

      setTemperature("");
      setSelectedSymptoms([]);
      setSeverity(1);
      setNote("");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
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
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mt-2">
              ประเมินอาการเบื้องต้น
            </h1>
            <p className="text-gray-600 mt-1">
              กรุณาระบุอาการที่คุณกำลังประสบอยู่ เพื่อให้ระบบช่วยวิเคราะห์
            </p>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>ความคืบหน้า</span>
              <span>ส่วนที่ 1 จาก 3</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full w-1/3"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT FORM */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-2xl mb-4">อาการทั่วไป</h2>

              <p className="text-sm text-gray-600 mb-2">รหัสผู้ใช้</p>
              <input
                type="text"
                value={user?.student_id || ""}
                readOnly
                className="w-full border rounded-lg p-3 mb-6 bg-gray-100"
              />

              {/* Temperature */}
              <p className="text-sm text-gray-600 mb-2">
                อุณหภูมิร่างกาย (ไข้)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "ปกติ", value: "<37.5" },
                  { label: "มีไข้ต่ำ", value: "37.5-38.0" },
                  { label: "มีไข้สูง", value: "38.1-39.0" },
                  { label: "ไข้สูงมาก", value: ">39.0" },
                ].map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTemperature(item.value)}
                    className={`border rounded-xl p-4 text-center transition
              ${
                temperature === item.value
                  ? "border-blue-500 bg-blue-50"
                  : "hover:border-blue-500"
              }`}
                  >
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.value}°C</p>
                  </button>
                ))}
              </div>

              {/* Symptoms */}
              <p className="text-sm text-gray-600 mb-2">
                อาการอื่น ๆ (เลือกได้หลายข้อ)
              </p>
              <div className="grid md:grid-cols-2 gap-3 mb-6">
                {symptomsList.map((symptom, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer
              ${
                selectedSymptoms.includes(symptom)
                  ? "border-blue-500 bg-blue-50"
                  : "hover:border-blue-400"
              }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                      className="accent-blue-500"
                    />
                    <span>{symptom}</span>
                  </label>
                ))}
              </div>

              {/* Severity */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium">ระดับความรุนแรง</p>
                  <span className="text-sm font-semibold text-blue-600">
                    ระดับ {severity}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Note */}
              <p className="text-sm text-gray-600 mb-2">รายละเอียดเพิ่มเติม</p>
              <textarea
                rows="4"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="ระบุอาการเพิ่มเติม..."
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              />

              {/* Button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? "กำลังบันทึก..." : "ส่ง"}
                </button>
              </div>
            </div>

            {/* RIGHT SUMMARY */}
            <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
              <h3 className="font-semibold text-blue-600 flex items-center gap-2 mb-4 text-lg">
                <i className="fa fa-file-text-o" aria-hidden="true"></i>
                สรุปข้อมูลเบื้องต้น
              </h3>

              <div className="text-sm text-gray-600 space-y-2 mb-4">
                <p>
                  วันที่ประเมิน: <b>25 ต.ค. 2566</b>
                </p>
                <p>
                  เวลา: <b>14:30 น.</b>
                </p>
              </div>

              <div className="border-t pt-4 space-y-3">
                <p className="font-semibold text-gray-800 text-sm">
                  ประวัติการรับบริการล่าสุด
                </p>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 mt-2 rounded-full bg-green-500"></span>
                  <div>
                    <p className="font-medium text-gray-700">
                      การตรวจสุขภาพประจำปี
                    </p>
                    <p className="text-xs text-gray-500">
                      วันที่ 12 มีนาคม 2566
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 mt-2 rounded-full bg-yellow-500"></span>
                  <div>
                    <p className="font-medium text-gray-700">
                      การรับยาบรรเทาอาการปวดศีรษะ
                    </p>
                    <p className="text-xs text-gray-500">
                      วันที่ 05 พฤศจิกายน 2565
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
                หากมีอาการรุนแรง หรือฉุกเฉิน
                กรุณาติดต่อเจ้าหน้าที่ห้องพยาบาลทันที
                <br />
                โทร: 02-xxx-xxxx
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

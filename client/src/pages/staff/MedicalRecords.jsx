import React, { useState } from "react";
import axios from "axios";

import Aside from "../../components/staff/aside.jsx";
import Nav from "../../components/staff/nav.jsx";
import Footer from "../../components/staff/footer.jsx";

export default function MedicalRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    temp: "",
    pressure: "",
    pulse: "",
    symptoms: "",
    diagnosis: "",
    treatment: "",
    medicine: "",
    medicine_count: 1,
    doctor: "",
    status: "Completed",
  });

  // Search student
  const searchStudent = async () => {
    if (!searchQuery) {
      alert("กรุณากรอกคำค้นหา");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/medical/student", {
        params: { query: searchQuery },
      });

      console.log("API RESPONSE:", res.data); // 👈 เพิ่มบรรทัดนี้

      setStudent(res.data);
    } catch (err) {
      console.error(err);
      alert("ไม่พบข้อมูลนักศึกษา");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student) {
      alert("กรุณาค้นหาและเลือกนักศึกษาก่อน");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/medical", {
        users_id: student.users_id,
        
        ...formData,
      });

      if (res.status === 201) {
        alert("บันทึกการรักษาสำเร็จ");

        setFormData({
          temp: "",
          pressure: "",
          pulse: "",
          symptoms: "",
          diagnosis: "",
          treatment: "",
          medicine: "",
          medicine_count: 1,
          doctor: "",
          status: "Completed",
        });
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex">
      <Aside />

      <div className="flex-1 flex flex-col">
        <Nav />

        <div className="p-6 flex-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                บันทึกการรักษาเบื้องต้น
              </h1>
              <p className="text-sm text-gray-500">
                กรอกข้อมูลอาการและการปฐมพยาบาลเบื้องต้นสำหรับนักศึกษา
              </p>
            </div>
            <button className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
              ประวัติล่าสุด
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow p-5">
                <h2 className="font-semibold text-gray-700 mb-3">
                  <i className="fa fa-search mr-2"></i>
                  ค้นหานักศึกษา
                </h2>

                <input
                  type="text"
                  placeholder="รหัสนักศึกษา หรือ ชื่อ-นามสกุล"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mb-3 text-sm"
                />

                <button
                  onClick={searchStudent}
                  disabled={loading}
                  className="w-full bg-emerald-500 text-white py-2 rounded-lg text-sm hover:bg-emerald-600 disabled:opacity-50"
                >
                  {loading ? "กำลังค้นหา..." : "ค้นหาข้อมูล"}
                </button>
              </div>

              {/* Student Card */}
              {student && (
                <div className="bg-white rounded-xl shadow p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                      <i className="fa fa-user text-gray-500"></i>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        {student.firstname} {student.lastname}
                      </p>

                      <p className="text-sm text-gray-500">
                        รหัส: {student.student_id || student.users_id}
                      </p>

                      <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded">
                        {student.faculty}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      อายุ:
                      <span className="float-right">
                        {student.age || "-"} ปี
                      </span>
                    </p>

                    <p>
                      กรุ๊ปเลือด:
                      <span className="float-right">
                        {student.blood_type || "-"}
                      </span>
                    </p>

                    <p>
                      โรคประจำตัว:
                      <span className="float-right text-red-500">
                        {student.disease || "ไม่มี"}
                      </span>
                    </p>

                    <p>
                      แพ้ยา:
                      <span className="float-right text-red-500">
                        {student.allergy || "ไม่มี"}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow p-6 space-y-6"
              >
                {/* Vitals */}
                <div>
                  <h2 className="font-semibold text-gray-700 mb-4">
                    <i className="fa fa-stethoscope text-xl mr-2"></i>
                    ข้อมูลสัญญาณชีพ (Vitals)
                  </h2>

                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="temp"
                      placeholder="อุณหภูมิ °C"
                      value={formData.temp}
                      onChange={handleInputChange}
                      className="border rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      name="pressure"
                      placeholder="ความดัน mmHg"
                      value={formData.pressure}
                      onChange={handleInputChange}
                      className="border rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      name="pulse"
                      placeholder="ชีพจร BPM"
                      value={formData.pulse}
                      onChange={handleInputChange}
                      className="border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Symptoms & Diagnosis */}
                <div>
                  <h2 className="font-semibold text-gray-700 mb-4">
                    <i className="fa fa-file-text-o mr-2"></i>
                    อาการและการวินิจฉัย
                  </h2>

                  <textarea
                    name="symptoms"
                    placeholder="อาการเบื้องต้น..."
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
                    rows="3"
                  />

                  <textarea
                    name="diagnosis"
                    placeholder="การวินิจฉัย..."
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    rows="3"
                  />
                </div>

                {/* Treatment */}
                <div>
                  <h2 className="font-semibold text-gray-700 mb-4">
                    <i className="fa fa-medkit mr-2"></i>
                    การรักษาและจ่ายยา
                  </h2>

                  <textarea
                    name="treatment"
                    placeholder="รายละเอียดการรักษา..."
                    value={formData.treatment}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
                    rows="3"
                  />

                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="medicine"
                      placeholder="ชื่อยา"
                      value={formData.medicine}
                      onChange={handleInputChange}
                      className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    />

                    <input
                      type="number"
                      name="medicine_count"
                      placeholder="จำนวน"
                      value={formData.medicine_count}
                      onChange={handleInputChange}
                      className="w-24 border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Doctor */}
                <div>
                  <h2 className="font-semibold text-gray-700 mb-4">
                    <i className="fa fa-user-md mr-2"></i>
                    ผู้รักษา
                  </h2>

                  <input
                    type="text"
                    name="doctor"
                    placeholder="ชื่อแพทย์หรือเจ้าหน้าที่"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                {/* Status */}
                <div>
                  <h2 className="font-semibold text-gray-700 mb-4">สถานะเคส</h2>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="Completed">เสร็จสิ้น</option>
                    <option value="Rest">ให้นอนพัก</option>
                    <option value="Forward">ส่งต่อ</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  <button
                    type="reset"
                    className="text-gray-500 hover:underline"
                  >
                    ล้างข้อมูล
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !student}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {loading ? "กำลังบันทึก..." : "บันทึกและเสร็จสิ้น"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

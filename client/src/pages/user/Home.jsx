import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authcontext";
import Aside from "../../components/user/aside.jsx";
import Footer from "../../components/user/footer.jsx";
import Nav from "../../components/user/nav.jsx";

export default function Home() {
  const { user, token } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchHome = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Home data:", res.data); // Debug
        setActivities(res.data.activities || []);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, [token, navigate]);

  const announcements = [
    "ห้องพยาบาลเปิดให้บริการเวลา 08:00 - 17:00 น.",
    "กรุณาทำแบบประเมินก่อนเข้าพบเจ้าหน้าที่",
    "หากมีอาการฉุกเฉินให้ติดต่อเจ้าหน้าที่ทันที",
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">กำลังโหลด...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex">
      <Aside />
      <div className="flex-1 flex flex-col">
        <Nav />
        <div className="p-6 flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">หน้าหลัก</h1>
            <p className="text-gray-600 text-sm">
              ยินดีต้อนรับเข้าสู่ระบบช่วยตรวจสอบอาการและนัดหมายห้องพยาบาล
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div
              onClick={() => navigate("/form")}
              className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md hover:border-blue-400 border transition"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <i className="fa fa-stethoscope text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                ทำแบบประเมินอาการ
              </h3>
              <p className="text-sm text-gray-600">
                ประเมินอาการเบื้องต้นเพื่อรับคำแนะนำจากระบบ
              </p>
            </div>

            <div
              onClick={() => navigate("/appointment")}
              className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md hover:border-blue-400 border transition"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                <i className="fa fa-calendar text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                จองวันนัดหมาย
              </h3>
              <p className="text-sm text-gray-600">
                เลือกวันและเวลาที่สะดวกเพื่อเข้าพบเจ้าหน้าที่
              </p>
            </div>

            <div
              onClick={() => navigate("/record")}
              className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md hover:border-blue-400 border transition"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                <i className="fa fa-history text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                ประวัติการรักษา
              </h3>
              <p className="text-sm text-gray-600">
                ตรวจสอบประวัติการเข้ารับบริการย้อนหลัง
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-blue-600 mb-4 flex items-center gap-2">
                <i className="fa fa-clock-o"></i>
                กิจกรรมล่าสุด
              </h3>
              <div className="space-y-4 text-sm">
                {activities.length > 0 ? (
                  activities.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 mt-2 rounded-full bg-green-500"></span>
                      <div>
                        <p className="font-medium text-gray-700">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">ไม่มีกิจกรรม</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-blue-600 mb-4 flex items-center gap-2">
                <i className="fa fa-bullhorn"></i>
                ประกาศจากห้องพยาบาล
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                {announcements.map((text, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

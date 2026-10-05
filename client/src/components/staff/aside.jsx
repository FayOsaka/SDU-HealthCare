import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function aside() {
  const navigate = useNavigate();

  const menu = [
    { name: "หน้าหลัก", path: "/staff-home" },
    { name: "ตารางนัดหมาย", path: "/appointment-schedule" },
    { name: "บันทึกการรักษาเบื้องต้น", path: "/medical-records" },
    { name: "สถิติการเข้าให้บริการ", path: "/statistics" },
  ];

  const handleLogout = () => {
    // ลบ token / session
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex">
      <aside className="w-64 bg-white border-r flex flex-col px-4 py-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <i className="fa fa-medkit text-emerald-600 text-4xl mb-2" />
          <h1 className="text-lg font-semibold text-emerald-600">ห้องพยาบาล</h1>
          <hr className="mt-4" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 text-sm">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition
                  ${
                    isActive
                      ? "bg-emerald-50 text-emerald-600 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg
                       text-red-600 border border-red-200
                       hover:bg-red-50 transition text-sm"
        >
          <i className="fa fa-sign-out" />
          ออกจากระบบ
        </button>
      </aside>
    </div>
  );
}

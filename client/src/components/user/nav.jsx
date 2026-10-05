import React from "react";
import { useAuth } from "../../context/authcontext";

export default function Nav() {
  const { user } = useAuth();

  const displayName =
    (user?.firstname || user?.lastname)
      ? `${user?.firstname || ""} ${user?.lastname || ""}`.trim()
      : user?.username || "-";

  return (
    <nav className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
            <i className="fa fa-medkit" />
          </div>
          <h2 className="font-bold text-gray-800">ระบบช่วยตรวจสอบอาการ</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium text-gray-800">
              {displayName}
            </p>
            <p className="text-xs text-gray-500">
              รหัสผู้ใช้ {user?.student_id || user?.users_id || "-"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center">
            <i className="fa fa-user text-blue-500" />
          </div>
        </div>
      </div>
    </nav>
  );
}

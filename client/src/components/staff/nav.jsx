import React from "react";
import { useAuth } from "../../context/authcontext";

export default function Nav() {
  const { user } = useAuth();

  const displayName =
    user?.firstname || user?.lastname
      ? `${user?.firstname || ""} ${user?.lastname || ""}`.trim()
      : user?.username || "-";

  return (
    <nav className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
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
              เจ้าหน้าที่ห้องพยาบาล
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
            <i className="fa fa-user text-emerald-500" />
          </div>
        </div>
      </div>
    </nav>
  );
}

import React from "react";

export default function footer() {
  return (
    <footer className="bg-white border-t">
      <div className="text-center text-xs text-gray-400 py-6">
        © {new Date().getFullYear()} ระบบช่วยตรวจสอบอาการและนัดหมายห้องพยาบาล
      </div>
    </footer>
  );
}

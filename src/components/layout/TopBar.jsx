import React from "react";
import { User } from "lucide-react";

const TopBar = ({ title, subtitle }) => {
  return (
    <div className="mb-8 flex justify-between items-start">
      {/* Left side - Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-blue-300">{subtitle}</p>
      </div>
      
      {/* Right side - Admin User Info */}
      <div className="flex items-center gap-4 bg-slate-800/60 rounded-xl px-5 py-3 border border-blue-800/40 shadow-md">
        <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-slate-700 flex items-center justify-center">
          <User className="w-5 h-5 text-blue-300" />
        </div>
        <div>
          <p className="font-semibold text-white text-base">Admin User</p>
          <p className="text-sm text-blue-300">System Administrator</p>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
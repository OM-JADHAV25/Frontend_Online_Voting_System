import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-blue-900 border-b border-blue-700 py-3 shrink-0">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ShieldCheck className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight">SECUREVOTE NATIONAL</h1>
            <p className="text-blue-300 text-sm">Official Government Voting Portal</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-blue-300">Secure Session Active</div>
          <div className="flex items-center justify-end space-x-2 text-green-400">
            <Lock className="w-4 h-4" />
            <span className="font-semibold">ENCRYPTED</span>
          </div>
        </div>
      </div>
    </header>
  );
}
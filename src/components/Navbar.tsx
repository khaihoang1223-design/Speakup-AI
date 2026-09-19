import React from 'react';
import { MessageSquareQuote, Sparkles, Star } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-[#0a1128]/80 backdrop-blur-md border-b border-sky-500/20 sticky top-0 z-30 shadow-[0_4px_25px_rgba(2,6,23,0.5)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                SpeakUp AI
              </span>
              <span className="text-[11px] font-semibold bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-400/30">
                Galaxy THCS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">Trợ lý AI luyện kỹ năng giao tiếp tình huống</p>
          </div>
        </div>

        {/* 3 Criteria Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-sky-200 bg-[#121e42]/70 border border-sky-400/30 px-3.5 py-1.5 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.15)] backdrop-blur-xs">
          <Star className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/40" />
          <span>3 Tiêu chí: <strong className="text-white">Rõ ràng</strong> • <strong className="text-white">Lịch sự</strong> • <strong className="text-white">Phù hợp</strong></span>
        </div>
      </div>
    </header>
  );
};

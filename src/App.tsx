import React from 'react';
import { Navbar } from './components/Navbar';
import { PracticeArena } from './components/PracticeArena';
import { StarfieldBackground } from './components/StarfieldBackground';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden">
      {/* Dynamic Galaxy Starfield with Moving Twinkling Stars */}
      <StarfieldBackground />

      {/* Top Header */}
      <Navbar />

      {/* Main Practice Screen */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PracticeArena />
      </main>

      {/* Educational Pedagogy Footer */}
      <footer className="relative z-10 bg-[#060a1d]/85 backdrop-blur-md border-t border-sky-500/20 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong className="text-white">Nguyên tắc sư phạm:</strong> Đánh giá khách quan theo 3 tiêu chí: Rõ ràng – Lịch sự – Phù hợp. Không đánh giá tính cách học sinh.
            </span>
          </div>

          <div className="text-sky-300/70 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SpeakUp AI • Galaxy Edition THCS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

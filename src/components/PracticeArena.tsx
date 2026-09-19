import React, { useState, useRef } from 'react';
import { Scenario, AIFeedback } from '../types';
import { SCENARIOS } from '../data/scenarios';
import { ScenarioCard } from './ScenarioCard';
import { FeedbackCard } from './FeedbackCard';
import { Send, Sparkles, RefreshCw, Info, MessageSquare } from 'lucide-react';

export const PracticeArena: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [currentPrompt, setCurrentPrompt] = useState<string>(SCENARIOS[0].initialPrompt);
  const [studentResponse, setStudentResponse] = useState<string>('');
  const [submittedResponse, setSubmittedResponse] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentFeedback, setCurrentFeedback] = useState<AIFeedback | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCurrentPrompt(scenario.initialPrompt);
    setStudentResponse('');
    setSubmittedResponse('');
    setCurrentFeedback(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!studentResponse.trim()) {
      setErrorMsg('Em hãy nhập câu trả lời của mình trước khi gửi nhé!');
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);
    const responseToSend = studentResponse.trim();

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: selectedScenario.title,
          partnerName: selectedScenario.partnerName,
          partnerRole: selectedScenario.partnerRole,
          contextDescription: selectedScenario.contextDescription,
          contextPrompt: currentPrompt,
          studentResponse: responseToSend
        })
      });

      if (!res.ok) {
        throw new Error('Không thể kết nối đến máy chủ AI');
      }

      const feedbackData: AIFeedback = await res.json();
      setSubmittedResponse(responseToSend);
      setCurrentFeedback(feedbackData);
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMsg('Đã có lỗi khi kết nối AI, em hãy thử bấm gửi lại nhé.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinueChat = (nextPrompt: string) => {
    setCurrentPrompt(nextPrompt);
    setStudentResponse('');
    setSubmittedResponse('');
    setCurrentFeedback(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRetry = () => {
    setCurrentFeedback(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleResetScenario = () => {
    setCurrentPrompt(selectedScenario.initialPrompt);
    setStudentResponse('');
    setSubmittedResponse('');
    setCurrentFeedback(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-8">
      {/* 1. Cho học sinh chọn 1 trong 5 tình huống */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs flex items-center justify-center font-bold">
              1
            </span>
            <span>Chọn 1 trong 5 tình huống giao tiếp</span>
          </h2>
          <span className="text-xs font-semibold text-cyan-300 bg-sky-950/80 border border-sky-400/40 px-3 py-1 rounded-full self-start sm:self-auto shadow-[0_0_10px_rgba(56,189,248,0.2)]">
            Đang luyện tập: <strong className="text-white">{selectedScenario.title}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SCENARIOS.map(sc => (
            <ScenarioCard
              key={sc.id}
              scenario={sc}
              isSelected={selectedScenario.id === sc.id}
              onSelect={handleSelectScenario}
            />
          ))}
        </div>
      </section>

      {/* 2 & 3. AI đóng vai đối thoại & Học sinh nhập câu trả lời / AI phân tích */}
      <section className="bg-[#0b1330]/85 backdrop-blur-md rounded-2xl border border-sky-500/30 shadow-[0_8px_32px_rgba(2,6,23,0.7)] overflow-hidden">
        {/* Scenario Header Bar */}
        <div className="bg-gradient-to-r from-[#101c44] via-[#0c1535] to-[#070d22] text-white p-5 sm:p-6 border-b border-sky-500/25 relative overflow-hidden">
          {/* Subtle cosmic background glow in header */}
          <div className="absolute top-0 right-1/4 w-72 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-sky-400/30 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(56,189,248,0.25)]">
                {selectedScenario.partnerAvatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-white">
                    {selectedScenario.title}
                  </h3>
                  <span className="text-[11px] bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                    {selectedScenario.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Người đối thoại cùng em: <strong className="text-cyan-300">{selectedScenario.partnerName}</strong> ({selectedScenario.partnerRole})
                </p>
              </div>
            </div>

            <button
              onClick={handleResetScenario}
              className="px-3.5 py-1.5 text-xs font-medium text-sky-200 hover:text-white bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              title="Bắt đầu lại tình huống"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Bắt đầu lại</span>
            </button>
          </div>

          {/* Context box */}
          <div className="mt-4 bg-[#070d24]/90 rounded-xl p-3.5 text-xs text-slate-200 flex items-start gap-2.5 border border-sky-500/20 relative z-10">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-sky-100">
              <strong className="text-white">Bối cảnh giao tiếp:</strong> {selectedScenario.contextDescription}
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Dialogue area */}
          <div className="space-y-4">
            {/* AI Friend Prompt */}
            <div className="flex items-start gap-3 max-w-2xl">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-sky-400/30 text-white flex items-center justify-center text-xl shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
                {selectedScenario.partnerAvatar}
              </div>
              <div className="bg-[#0d1738] rounded-2xl rounded-tl-xs p-4 text-slate-100 shadow-[0_4px_20px_rgba(2,6,23,0.5)] space-y-1.5 border border-sky-500/25">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-cyan-400" />
                    {selectedScenario.partnerName}
                  </span>
                  <span className="text-[10px] text-slate-400">Người đối thoại</span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-200">
                  "{currentPrompt}"
                </p>
              </div>
            </div>

            {/* Student's Submitted Bubble */}
            {currentFeedback && (
              <div className="flex items-start gap-3 max-w-2xl ml-auto justify-end">
                <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-600 text-white rounded-2xl rounded-tr-xs p-4 shadow-[0_0_20px_rgba(56,189,248,0.3)] space-y-1.5 border border-cyan-400/30">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold text-sky-100">Câu trả lời của em</span>
                    <span className="text-[10px] text-sky-200">Học sinh</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white">
                    "{submittedResponse}"
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.4)]">
                  Em
                </div>
              </div>
            )}
          </div>

          {/* AI Feedback or Input Box */}
          {currentFeedback ? (
            <FeedbackCard
              feedback={currentFeedback}
              partnerName={selectedScenario.partnerName}
              onContinueChat={handleContinueChat}
              onRetry={handleRetry}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <label htmlFor="student-response-textarea" className="block text-xs font-semibold text-sky-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Em nhập câu trả lời cho bạn {selectedScenario.partnerName}:</span>
              </label>

              <div className="rounded-xl border border-sky-500/30 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/25 transition-all bg-[#070e28]/95 p-3 shadow-inner">
                <textarea
                  id="student-response-textarea"
                  ref={inputRef}
                  value={studentResponse}
                  onChange={e => setStudentResponse(e.target.value)}
                  placeholder={`Ví dụ: Chào ${selectedScenario.partnerName}, mình rất vui được chia sẻ cùng bạn...`}
                  rows={4}
                  className="w-full text-sm text-white placeholder:text-slate-400 focus:outline-hidden resize-y bg-transparent"
                  disabled={isAnalyzing}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-sky-500/20">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="text-cyan-400">★</span>
                    Gợi ý: Hãy trả lời thật rõ ràng, lịch sự và phù hợp với tình huống nhé!
                  </span>

                  <button
                    type="submit"
                    id="submit-ai-analyze-btn"
                    disabled={isAnalyzing || !studentResponse.trim()}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isAnalyzing || !studentResponse.trim()
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-sky-500 via-indigo-600 to-blue-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>SpeakUp AI đang phân tích...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                        <span>Gửi câu trả lời</span>
                        <Send className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-200 rounded-xl text-xs font-medium">
                  {errorMsg}
                </div>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

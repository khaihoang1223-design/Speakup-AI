import React, { useState, useRef } from 'react';
import { Scenario, AIFeedback, ChatMessage } from '../types';
import { SCENARIOS, SCENARIO_CATEGORIES } from '../data/scenarios';
import { evaluateResponse } from '../data/evaluator';
import { ScenarioCard } from './ScenarioCard';
import { FeedbackCard } from './FeedbackCard';
import { Send, Sparkles, RefreshCw, Info, MessageSquare, Compass, CheckCircle2 } from 'lucide-react';

export const PracticeArena: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentPrompt, setCurrentPrompt] = useState<string>(SCENARIOS[0].initialPrompt);
  const [studentResponse, setStudentResponse] = useState<string>('');
  const [submittedResponse, setSubmittedResponse] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentFeedback, setCurrentFeedback] = useState<AIFeedback | null>(null);
  const [dialogueHistory, setDialogueHistory] = useState<ChatMessage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const filteredScenarios = activeCategory === 'all'
    ? SCENARIOS
    : SCENARIOS.filter(s => s.categoryTag === activeCategory);

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCurrentPrompt(scenario.initialPrompt);
    setStudentResponse('');
    setSubmittedResponse('');
    setCurrentFeedback(null);
    setDialogueHistory([]);
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
          studentResponse: responseToSend,
          dialogueHistory: dialogueHistory.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!res.ok) {
        throw new Error('API server returned error status: ' + res.status);
      }

      const feedbackData: AIFeedback = await res.json();
      setSubmittedResponse(responseToSend);
      setCurrentFeedback(feedbackData);
    } catch (err) {
      console.warn('Analysis via server endpoint failed, activating fallback evaluator:', err);
      try {
        const fallbackData = evaluateResponse(
          selectedScenario.title,
          selectedScenario.partnerName,
          responseToSend,
          selectedScenario.id
        );
        setSubmittedResponse(responseToSend);
        setCurrentFeedback(fallbackData);
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
        setErrorMsg('Đã có lỗi xảy ra, em hãy thử bấm gửi lại nhé.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinueChat = (nextPrompt: string) => {
    // Append the exchange to dialogueHistory
    setDialogueHistory(prev => [
      ...prev,
      {
        sender: 'partner',
        text: currentPrompt
      },
      {
        sender: 'student',
        text: submittedResponse,
        feedback: currentFeedback || undefined
      }
    ]);

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
    setDialogueHistory([]);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-8">
      {/* 1. Kho tình huống phong phú & Bộ lọc */}
      <section className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Chọn tình huống giao tiếp học đường ({SCENARIOS.length} tình huống)</span>
            </h2>
            <p className="text-xs text-sky-300/80 mt-0.5">
              Khám phá các trường hợp thực tế: kết bạn, làm việc nhóm, tranh luận, hóa giải mâu thuẫn và trò chuyện cùng thầy cô.
            </p>
          </div>

          <span className="text-xs font-semibold text-cyan-300 bg-sky-950/80 border border-sky-400/40 px-3 py-1 rounded-full self-start sm:self-auto shadow-[0_0_10px_rgba(56,189,248,0.2)]">
            Đang luyện tập: <strong className="text-white">{selectedScenario.title}</strong>
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {SCENARIO_CATEGORIES.map(cat => {
            const count = cat.id === 'all'
              ? SCENARIOS.length
              : SCENARIOS.filter(s => s.categoryTag === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                    : 'bg-[#09112d]/80 text-sky-200/80 hover:text-white border-sky-500/20 hover:border-sky-400/40 hover:bg-[#0f1b44]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-sky-500/15 text-cyan-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scenario Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredScenarios.map(sc => (
            <ScenarioCard
              key={sc.id}
              scenario={sc}
              isSelected={selectedScenario.id === sc.id}
              onSelect={handleSelectScenario}
            />
          ))}
        </div>
      </section>

      {/* 2 & 3. AI đóng vai đối thoại & Phân tích chuyên sâu */}
      <section className="bg-[#0b1330]/85 backdrop-blur-md rounded-2xl border border-sky-500/30 shadow-[0_8px_32px_rgba(2,6,23,0.7)] overflow-hidden">
        {/* Scenario Header Bar */}
        <div className="bg-gradient-to-r from-[#101c44] via-[#0c1535] to-[#070d22] text-white p-5 sm:p-6 border-b border-sky-500/25 relative overflow-hidden">
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
                  Nhân vật đối thoại: <strong className="text-cyan-300">{selectedScenario.partnerName}</strong> ({selectedScenario.partnerRole})
                </p>
              </div>
            </div>

            <button
              onClick={handleResetScenario}
              className="px-3.5 py-1.5 text-xs font-medium text-sky-200 hover:text-white bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              title="Bắt đầu lại tình huống này"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Bắt đầu lại từ đầu</span>
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
          {/* Dialogue Conversation Stream */}
          <div className="space-y-4">
            {/* Previous Conversation History (if multi-turn) */}
            {dialogueHistory.map((item, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 max-w-2xl ${
                  item.sender === 'student' ? 'ml-auto justify-end' : ''
                }`}
              >
                {item.sender === 'partner' && (
                  <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-sky-400/30 text-white flex items-center justify-center text-lg shrink-0 opacity-80">
                    {selectedScenario.partnerAvatar}
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                    item.sender === 'student'
                      ? 'bg-[#182859] border-sky-400/30 text-sky-100 rounded-tr-xs'
                      : 'bg-[#09112a] border-sky-500/20 text-slate-300 rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-slate-400 font-semibold">
                    <span>{item.sender === 'student' ? 'Em' : selectedScenario.partnerName}</span>
                    <span className="text-[10px] text-cyan-400/70">Lượt trước</span>
                  </div>
                  <p>"{item.text}"</p>
                </div>

                {item.sender === 'student' && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center text-xs font-bold shrink-0 opacity-80">
                    Em
                  </div>
                )}
              </div>
            ))}

            {/* Current Active AI Partner Prompt */}
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
                  <span className="text-[10px] text-sky-400 font-medium bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-500/20">
                    Đang trò chuyện cùng em
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-200">
                  "{currentPrompt}"
                </p>
              </div>
            </div>

            {/* Student's Current Submitted Bubble */}
            {currentFeedback && (
              <div className="flex items-start gap-3 max-w-2xl ml-auto justify-end">
                <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-600 text-white rounded-2xl rounded-tr-xs p-4 shadow-[0_0_20px_rgba(56,189,248,0.3)] space-y-1.5 border border-cyan-400/30">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold text-sky-100">Câu trả lời vừa gửi của em</span>
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
                <span>Em nhập câu trả lời cho {selectedScenario.partnerName}:</span>
              </label>

              <div className="rounded-xl border border-sky-500/30 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/25 transition-all bg-[#070e28]/95 p-3.5 shadow-inner">
                <textarea
                  id="student-response-textarea"
                  ref={inputRef}
                  value={studentResponse}
                  onChange={e => setStudentResponse(e.target.value)}
                  placeholder={`Ví dụ: Em hãy trả lời tự nhiên, có xưng hô rõ ràng và thể hiện sự tôn trọng nhé...`}
                  rows={4}
                  className="w-full text-sm text-white placeholder:text-slate-400 focus:outline-hidden resize-y bg-transparent"
                  disabled={isAnalyzing}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-sky-500/20">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI sẽ phân tích câu chữ của em theo 3 tiêu chí: Rõ ràng, Lịch sự, Phù hợp.</span>
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
                        <span>SpeakUp AI đang phân tích kỹ lưỡng...</span>
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

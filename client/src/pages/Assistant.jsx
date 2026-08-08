import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, Send, User, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

export const Assistant = () => {
  const { overall, subjects, targetAttendance } = useAttendance();
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      content: `Hello! I am your **Attendance AI Assistant** for MITS. I have access to your live attendance dataset (${overall.attendancePercentage}% overall across 6 subjects).\n\nAsk me anything like *"Can I bunk DBMS tomorrow?"* or *"How many classes do I need to reach ${targetAttendance}%?"*`
    }
  ]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "Can I bunk tomorrow's class?",
    "How many ML classes do I need to attend?",
    "Which subject has the lowest attendance?",
    "Can I reach 75%?",
    "How many classes can I miss?",
    "Which subject should I focus on?",
    "Show me my attendance summary."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend || textToSend.trim() === '') return;

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setPrompt('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', { prompt: textToSend });
      if (res.data.success && res.data.assistantMessage) {
        setMessages(prev => [...prev, {
          id: res.data.assistantMessage.id || `a-${Date.now()}`,
          sender: 'assistant',
          content: res.data.assistantMessage.content
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: "Sorry, I ran into an error connecting to the backend intelligence engine. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/20">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white">Attendance AI Assistant</h1>
            <p className="text-[11px] text-slate-400">Context-Aware LLM Advisor • Real-time MITS Data Connected</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> AI Online
        </span>
      </div>

      {/* Message Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
              m.sender === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-800 text-brand-400 border border-slate-700'
            }`}>
              {m.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-lg'
                : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
            }`}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-3xl">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-brand-400 border border-slate-700 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles size={14} className="animate-spin text-brand-400" />
              <span>Analyzing attendance dataset & calculating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Quick Prompts:</span>
        {suggestedPrompts.map((sp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sp)}
            className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-brand-500/50 transition-all shrink-0"
          >
            {sp}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-slate-900/90 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Attendance AI... (e.g., Can I miss 2 DBMS classes?)"
          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center transition-all disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

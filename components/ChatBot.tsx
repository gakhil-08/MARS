
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useHospital } from '../context/HospitalContext';
import { ActionStatus } from '../types';

interface ChatBotProps {
  patientId: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ patientId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Hello! I am your clinical assistant. I can guide you through ward directions, vitals, test results, or current billing. How can I help?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { actions, patients } = useHospital();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Prepare context for Gemini
    const patientDetails = patients.find(p => p.id === patientId);
    const myActions = actions.filter(a => a.patientId === patientId);
    const bill = myActions.reduce((s, a) => s + (a.billAmount || 0), 0);
    
    const context = `
      User Context:
      - Name: ${patientDetails?.name}
      - Assigned Room/Ward: ${patientDetails?.roomNo}
      - Health Vitals: ${patientDetails?.height}cm height, ${patientDetails?.weight}kg weight
      - Financial Status: Total bill of $${bill.toFixed(2)}
      - Current Medical Orders: ${myActions.map(a => `${a.type}: ${a.description} assigned to ${a.location || 'Ward'} (Current Status: ${a.status})`).join(', ')}
      
      Instructions: Provide extremely clear, high-contrast textual responses. Use bullet points for lists. Be professional and authoritative.
    `;

    try {
      // Use process.env.API_KEY directly as required by guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Call generateContent with model and simplified prompt structure
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Context: ${context}\n\nUser Question: ${userMsg}`,
        config: {
          systemInstruction: "You are a professional hospital-grade AI assistant. Help with ward navigation, medical record interpretation, and billing queries. Be extremely clear and use high-contrast language."
        }
      });
      
      // response.text is a getter, not a method
      setMessages(prev => [...prev, { role: 'bot', text: response.text || 'Error processing request.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Clinical system connection error. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-slate-900 overflow-hidden flex flex-col animate-slide-up">
          <div className="bg-slate-950 p-6 text-white flex justify-between items-center border-b-4 border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
              <span className="font-black tracking-[0.1em] text-xs uppercase">AI Clinical Aide</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-slate-800 p-1.5 rounded-xl hover:bg-slate-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="h-96 overflow-y-auto p-6 space-y-6 bg-slate-100">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm font-bold shadow-md leading-relaxed ${m.role === 'user' ? 'bg-blue-800 text-white rounded-br-none' : 'bg-white text-slate-950 border-2 border-slate-200 rounded-bl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-5 py-4 rounded-2xl border-2 border-slate-200 flex gap-2 shadow-inner">
                  <div className="w-2 h-2 bg-slate-800 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-800 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-slate-800 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t-4 border-slate-100 flex gap-3">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about ward 102 directions..."
              className="flex-1 px-5 py-3.5 bg-slate-100 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-blue-800 transition-all text-slate-950 font-black placeholder:text-slate-500"
            />
            <button 
              onClick={handleSend}
              className="bg-blue-800 text-white p-3.5 rounded-2xl hover:bg-blue-900 shadow-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-slate-950 text-white rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center hover:scale-105 transition-all group active:scale-95 border-4 border-slate-800"
      >
        <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      </button>
    </div>
  );
};

export default ChatBot;

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Bot, Send, AlertTriangle, CheckSquare, Activity, Terminal, ShieldCheck, Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import { InsightCard, ChatMessage } from '../types';
import { queryNeuroLink, generatePredictiveInsights } from '../services/geminiService';
import { useSimulation } from '../context/SimulationContext';

const InsightPanel: React.FC = () => {
  const { insights } = useSimulation(); // Connected to Simulation Context
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [prediction, setPrediction] = useState<InsightCard | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen, prediction, insights]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    const responseText = await queryNeuroLink(userMsg.text, { /* context passed inside service */ });
    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    setChatHistory(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleGeneratePrediction = async () => {
    setIsPredicting(true);
    const text = await generatePredictiveInsights();
    setPrediction({
        id: 'pred-1',
        type: 'prediction',
        title: 'PREDICTIVE FORECAST (+4H)',
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
    setIsPredicting(false);
  };

  const renderCardIcon = (type: string) => {
    switch (type) {
        case 'alert': return <AlertTriangle className="text-neon-rose w-5 h-5" />;
        case 'verification': return <CheckSquare className="text-neon-blue w-5 h-5" />;
        case 'action': return <Activity className="text-neon-green w-5 h-5" />;
        case 'prediction': return <TrendingUp className="text-purple-400 w-5 h-5" />;
        default: return <Terminal className="text-slate-400 w-5 h-5" />;
    }
  };

  const renderCard = (card: InsightCard) => {
    // ACTIVE VERIFICATION (Simulated Loading)
    if (card.type === 'verification' && card.loading) {
         return (
            <div key={card.id} className="relative p-4 rounded-lg border-l-4 border-neon-blue bg-slate-800/80 mb-3 animate-pulse">
                <div className="flex items-center gap-2 mb-2">
                    <Loader2 className="text-neon-blue w-4 h-4 animate-spin" />
                    <span className="font-bold text-xs text-neon-blue tracking-wider uppercase">VERIFICATION IN PROGRESS</span>
                </div>
                <p className="text-xs font-mono text-slate-300 pl-6">{card.content}</p>
            </div>
         );
    }

    // VERIFIED FACT (Blue Box)
    if (card.type === 'verification' && !card.loading) {
        return (
            <div key={card.id} className="relative p-4 rounded-lg border-l-4 border-neon-blue bg-gradient-to-r from-blue-950/40 to-slate-900/40 shadow-lg shadow-blue-900/10 mb-3">
                <div className="absolute -top-2 -right-2">
                    <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-blue"></span>
                    </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <CheckSquare className="text-neon-blue w-5 h-5" />
                    <span className="font-bold text-xs text-neon-blue tracking-wider uppercase">{card.title}</span>
                </div>
                <p className="text-sm font-bold text-white leading-relaxed pl-7">{card.content}</p>
                <div className="mt-2 pl-7 flex items-center gap-2">
                    <span className="text-[10px] bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded border border-neon-blue/30 font-mono">CONFIDENCE: 100% (FACT)</span>
                    <span className="text-[10px] font-mono text-slate-500">{card.timestamp}</span>
                </div>
            </div>
        )
    }

    if (card.type === 'prediction') {
        return (
            <div key={card.id} className="relative p-4 rounded-lg border-l-4 border-purple-500 bg-gradient-to-r from-purple-900/20 to-slate-900/40 shadow-lg shadow-purple-900/10 mb-3 animate-pulse-fast ring-1 ring-purple-500/20">
                 <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-purple-400 w-5 h-5" />
                    <span className="font-bold text-xs text-purple-400 tracking-wider uppercase">{card.title}</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed pl-7">{card.content}</p>
                 <div className="mt-2 pl-7 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-purple-400/70">AI PROJECTION MODEL V2.5</span>
                    <span className="text-[10px] font-mono text-slate-500">{card.timestamp}</span>
                </div>
            </div>
        );
    }

    let borderClass = 'border-l-4 border-slate-600 bg-slate-800/50';
    let titleClass = 'text-slate-200';
    if (card.type === 'alert') {
        borderClass = 'border-l-4 border-l-neon-rose bg-rose-950/10';
        titleClass = 'text-neon-rose';
    } else if (card.type === 'action') {
        borderClass = 'border-l-4 border-l-neon-green bg-emerald-950/10';
        titleClass = 'text-neon-green';
    }

    return (
        <div key={card.id} className={`p-3 rounded-r-md border border-slate-700/50 ${borderClass} mb-3 animate-in slide-in-from-right fade-in duration-300`}>
            <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                {renderCardIcon(card.type)}
                <span className={`font-bold text-xs uppercase ${titleClass}`}>{card.title}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{card.timestamp}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-7">{card.content}</p>
        </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="w-12 border-l border-slate-700 bg-cyber-slate flex flex-col items-center py-4 cursor-pointer hover:bg-slate-800 transition-colors z-40"
           onClick={() => setIsOpen(true)}>
        <ChevronLeft className="text-slate-400" />
        <div className="mt-8 flex flex-col gap-4">
             <Bot className="text-neon-green w-6 h-6 animate-pulse" />
             <div className="writing-vertical-lr text-slate-500 text-xs font-mono tracking-widest uppercase transform rotate-180">
                Neuro-Link Active
             </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 flex flex-col border-l border-slate-700 bg-cyber-slate/95 backdrop-blur shadow-2xl transition-all duration-300 z-40">
      <div className="h-14 border-b border-slate-700 flex items-center justify-between px-4 bg-slate-900/50 flex-shrink-0">
        <div className="flex items-center gap-2">
           <Bot className="text-neon-green w-5 h-5" />
           <div className="flex flex-col">
             <h2 className="text-sm font-bold text-slate-100 tracking-wide font-mono leading-none">NEURO-LINK AI</h2>
             <span className="text-[10px] text-neon-green/80 font-mono flex items-center gap-1 mt-1">
                <ShieldCheck size={10} /> System Active
             </span>
           </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700" ref={scrollRef}>
        <div className="mb-6">
           <div className="text-xs font-mono text-slate-500 mb-2 font-bold tracking-wider">LIVE ANALYSIS FEED</div>
           {insights.length === 0 ? (
               <div className="text-center text-slate-600 text-xs italic py-4">System Nominal. Waiting for telemetry...</div>
           ) : (
               insights.map((card) => renderCard(card))
           )}
        </div>

        <div className="mb-6 pt-4 border-t border-slate-800">
           <div className="flex items-center justify-between mb-3">
             <div className="text-xs font-mono text-purple-400 font-bold tracking-wider flex items-center gap-2">
                <Sparkles size={12} />
                PREDICTIVE INTELLIGENCE
             </div>
           </div>
           
           {!prediction && (
               <button 
                  onClick={handleGeneratePrediction}
                  disabled={isPredicting}
                  className="w-full py-3 px-4 bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/50 hover:border-purple-500 text-purple-300 hover:text-white rounded-md transition-all duration-200 flex items-center justify-center gap-2 text-xs font-bold font-mono group disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {isPredicting ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        GENERATING FORECAST...
                      </>
                  ) : (
                      <>
                        <TrendingUp size={14} className="group-hover:scale-110 transition-transform" />
                        GENERATE PREDICTIVE INSIGHTS
                      </>
                  )}
               </button>
           )}
           {prediction && renderCard(prediction)}
        </div>

        {chatHistory.length > 0 && (
             <div className="pt-4 border-t border-slate-800">
                <div className="text-xs font-mono text-slate-500 mb-2 font-bold tracking-wider">DIAGNOSTIC SESSION</div>
                <div className="space-y-4">
                    {chatHistory.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                                ${msg.role === 'model' ? 'bg-neon-green/10 text-neon-green' : 'bg-slate-700 text-slate-300'}`}>
                                {msg.role === 'model' ? <Bot size={16} /> : <div className="text-xs font-bold">OP</div>}
                            </div>
                            <div className={`rounded-lg p-3 text-sm max-w-[85%] border ${
                                msg.role === 'model' 
                                ? 'bg-slate-800/50 border-slate-700 text-slate-300' 
                                : 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-2 items-center text-slate-500 text-xs ml-11">
                            <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce delay-150"></span>
                            <span className="font-mono">ANALYZING...</span>
                        </div>
                    )}
                </div>
             </div>
        )}
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-700 flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-slate-800 text-sm text-slate-200 rounded-md pl-3 pr-10 py-3 border border-slate-700 focus:outline-none focus:border-neon-green placeholder-slate-500 font-mono transition-colors"
            placeholder="Ask Neuro-Link..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className="absolute right-2 top-2.5 text-slate-400 hover:text-neon-green transition-colors"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightPanel;

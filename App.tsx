
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { generateSecurityInfographic, analyzeSecurityImage } from './services/geminiService';
import { GeneratedImage, AnalysisResult } from './types';
import { AugmentedCanvas } from './components/AugmentedCanvas';
import { LoadingState } from './components/LoadingState';
import { LinkedInPost } from './components/LinkedInPost';
import { ShieldAlert, Share2, Key, RefreshCw, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fixed aistudio declaration to match the expected global AIStudio type
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio: AIStudio;
  }
}

type AppStatus = 'idle' | 'generating' | 'analyzing' | 'complete' | 'error';

const LINKEDIN_CONTENT = `🔐 The Hidden Vulnerabilities in MCP & A2A: What Security Teams Must Know in 2025

As AI agents become integral to enterprise workflows, two protocols dominate agent ecosystems: Model Context Protocol (MCP) and Agent-to-Agent (A2A). But their flexibility creates sophisticated attack surfaces—and the vulnerabilities hide in plain sight.

The Reality:
- Tool poisoning requires just 0.001% data contamination
- Hidden instructions survive curation
- Malicious MCP servers act as proxies
- A2A session smuggling allows multi-turn command injection

How to Defend:
✅ Semantic Analysis
✅ Behavioral Monitoring
✅ Red Team Simulation
✅ Runtime Guardrails

#AISecurityMatters #MCP #A2A #GenAI #SecurityEngineering`;

function App() {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [activeTopic, setActiveTopic] = useState<'MCP' | 'A2A' | null>(null);
  const [data, setData] = useState<{ image: GeneratedImage; analysis: AnalysisResult | null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLinkedIn, setShowLinkedIn] = useState(false);

  const startAnalysis = async (topic: 'MCP' | 'A2A') => {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
      // Proceeding directly after prompt per instructions
    }

    setStatus('generating');
    setActiveTopic(topic);
    setError(null);

    try {
      const image = await generateSecurityInfographic(topic);
      setData({ image, analysis: null });
      setStatus('analyzing');
      
      const analysis = await analyzeSecurityImage(topic, image.base64);
      setData({ image, analysis });
      setStatus('complete');
    } catch (err: any) {
      if (err.message === 'API_KEY_REQUIRED') {
        setError("Please select a valid API Key from a paid project to use Gemini 3 Pro.");
      } else {
        setError(err.message || "Failed to generate security lab data.");
      }
      setStatus('idle');
    }
  };

  const reset = () => {
    setStatus('idle');
    setData(null);
    setActiveTopic(null);
    setShowLinkedIn(false);
  };

  return (
    <div className="h-screen w-screen bg-[#020202] text-zinc-100 overflow-hidden flex flex-col font-sans">
      
      {/* HUD Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="relative z-10 w-full h-full flex flex-col">
        
        {/* Top Header Bar */}
        <header className="flex-none h-16 border-b border-zinc-800 bg-black/50 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-red-500/10 border border-red-500/50 flex items-center justify-center">
              <ShieldAlert className="text-red-500" size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest uppercase">SecLab <span className="text-zinc-500">v2.5</span></h1>
              <p className="text-[10px] text-zinc-500 font-mono">THREAT_INTEL_ACTIVE</p>
            </div>
          </div>

          <div className="flex gap-4">
            {status === 'complete' && (
              <button 
                onClick={() => setShowLinkedIn(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-xs font-bold transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                <Share2 size={14} /> Generate Social Post
              </button>
            )}
            {status !== 'idle' && (
              <button onClick={reset} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white">
                <ChevronLeft size={20} />
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative">
          <AnimatePresence mode="wait">
            
            {/* IDLE STATE: Dashboard Selection */}
            {status === 'idle' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full flex flex-col items-center justify-center p-8"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-black mb-2 tracking-tight uppercase italic">Security Vulnerability Lab</h2>
                  <p className="text-zinc-500 font-mono text-sm">Select a protocol to generate detailed visual threat analysis</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                  {/* MCP Card */}
                  <motion.button
                    whileHover={{ scale: 1.02, borderColor: 'rgba(239, 68, 68, 0.5)' }}
                    onClick={() => startAnalysis('MCP')}
                    className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-left group transition-all"
                  >
                    <div className="text-red-500 mb-6 group-hover:scale-110 transition-transform">
                       <ShieldAlert size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">MCP Protocol</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                      Analyze tool description poisoning, cross-server shadowing, and malicious server proxies.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Generate Threat Map
                    </div>
                  </motion.button>

                  {/* A2A Card */}
                  <motion.button
                    whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                    onClick={() => startAnalysis('A2A')}
                    className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-left group transition-all"
                  >
                    <div className="text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                       <Share2 size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">A2A Protocol</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                      Discover session smuggling, AgentCard skill poisoning, and privilege escalation risks.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      Generate Threat Map
                    </div>
                  </motion.button>
                </div>

                {error && (
                  <div className="mt-12 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                    <ShieldAlert className="text-red-500" size={16} />
                    <p className="text-red-200 text-sm">{error}</p>
                    {error.includes("API Key") && (
                      <button onClick={() => window.aistudio.openSelectKey()} className="ml-4 text-xs font-bold underline">Select Key</button>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* PROCESSING STATES */}
            {(status === 'generating' || status === 'analyzing') && (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full">
                <LoadingState />
              </motion.div>
            )}

            {/* COMPLETE STATE */}
            {status === 'complete' && data && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full flex flex-col">
                <div className="flex-1 min-h-0 relative">
                  <AugmentedCanvas 
                    image={data.image} 
                    analysis={data.analysis} 
                    isScanning={false}
                  />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* LinkedIn Post Overlay */}
        <AnimatePresence>
          {showLinkedIn && (
            <LinkedInPost 
              content={LINKEDIN_CONTENT} 
              onClose={() => setShowLinkedIn(false)} 
              topic={activeTopic || 'AI Security'}
            />
          )}
        </AnimatePresence>

        {/* Footer Stats */}
        <footer className="flex-none h-10 border-t border-zinc-800 bg-black px-6 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <div className="flex gap-4">
             <span>ENGINE: GEMINI_3_PRO_VISION</span>
             <span>MODEL: FLASH_3_ANALYTICS</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-green-500/70">SECURE_CHANNEL_ENCRYPTED</span>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;

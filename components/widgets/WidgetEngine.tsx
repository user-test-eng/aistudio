
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Segment } from '../../types';
import { motion } from 'framer-motion';
import { AlertCircle, ShieldCheck, Activity } from 'lucide-react';

interface WidgetProps {
  segment: Segment;
}

const GLASS_PANEL = "bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 shadow-2xl w-full max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent";

const DetailedWidget: React.FC<WidgetProps> = ({ segment }) => (
  <motion.div 
    className={`${GLASS_PANEL} p-0 rounded-2xl flex flex-col border-l-4 ${segment.category === 'vulnerability' ? 'border-l-red-600' : 'border-l-blue-600'}`}
  >
    <div className="p-6 border-b border-zinc-900 bg-zinc-900/30">
      <div className="flex justify-between items-start mb-4">
          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
            segment.category === 'vulnerability' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
          }`}>
              {segment.category}
          </span>
          <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{segment.icon}</span>
      </div>
      <h3 className="font-black text-2xl text-white mb-2 tracking-tight uppercase italic">{segment.label}</h3>
    </div>

    <div className="p-6">
      <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-medium">
        {segment.description}
      </p>

      {segment.stats && segment.stats.length > 0 && (
        <div className="space-y-3">
          {segment.stats.map((stat, i) => (
             <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <Activity size={12} className="text-zinc-500" />
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{stat.label}</span>
                </div>
                <span className={`text-xs font-mono font-bold ${
                  stat.value.toLowerCase().includes('high') || stat.value.toLowerCase().includes('critical') 
                  ? 'text-red-500' 
                  : 'text-zinc-200'
                }`}>{stat.value}</span>
             </div>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

const StatsWidget: React.FC<WidgetProps> = ({ segment }) => (
  <motion.div 
    className={`${GLASS_PANEL} p-6 rounded-2xl border-t-2 ${segment.category === 'vulnerability' ? 'border-t-red-600' : 'border-t-blue-600'}`}
  >
    <div className="flex items-center gap-4 mb-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
        segment.category === 'vulnerability' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
      }`}>
        {segment.icon}
      </div>
      <div>
        <h3 className="font-bold text-white text-lg">{segment.label}</h3>
        <p className="text-[10px] text-zinc-500 font-mono">STATUS_REPORT_ID: {Math.random().toString(16).slice(2, 8).toUpperCase()}</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 gap-3 mb-4">
      {segment.stats?.map((stat, idx) => (
        <div key={idx} className="flex justify-between items-center p-3 bg-black/40 rounded border border-white/5">
            <span className="text-[10px] text-zinc-500 uppercase font-mono">{stat.label}</span>
            <span className="text-xs font-bold text-zinc-200">{stat.value}</span>
        </div>
      ))}
    </div>
    <p className="text-xs text-zinc-400 border-t border-zinc-800 pt-4 leading-relaxed">{segment.description}</p>
  </motion.div>
);

export const WidgetEngine: React.FC<WidgetProps> = ({ segment }) => {
  switch (segment.format) {
    case 'stats': return <StatsWidget segment={segment} />;
    case 'detailed': return <DetailedWidget segment={segment} />;
    default: return <DetailedWidget segment={segment} />;
  }
};

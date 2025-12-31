
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Check, Linkedin } from 'lucide-react';

interface Props {
  content: string;
  topic: string;
  onClose: () => void;
}

export const LinkedInPost: React.FC<Props> = ({ content, topic, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600/20 rounded">
                <Linkedin size={20} className="text-blue-500" />
             </div>
             <div>
                <h3 className="font-bold">Generated LinkedIn Post</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Topic: {topic}_THREAT_ANALYSIS</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto max-h-[60vh]">
          <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed bg-black/40 p-6 rounded-xl border border-white/5 select-all">
            {content}
          </pre>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-black/20 flex justify-end gap-3">
           <button 
             onClick={handleCopy}
             className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${
               copied ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-zinc-200'
             }`}
           >
             {copied ? <Check size={16} /> : <Copy size={16} />}
             {copied ? 'Copied to Clipboard' : 'Copy Post Content'}
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

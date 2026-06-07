/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneId } from '../types';

interface SceneAssetsProps {
  currentSceneId: SceneId;
  sceneProgress: number;
}

export default function SceneAssets({ currentSceneId, sceneProgress }: SceneAssetsProps) {
  return (
    <div id="scene-assets-layer" className="absolute inset-0 w-full h-full pointer-events-none select-none z-15">
      
      {/* ------------------ SCENE 2: OYSTER AND THE GREAT PEARL ------------------ */}
      <AnimatePresence>
        {currentSceneId === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-[108px] left-[55%] flex flex-col items-center z-10"
          >
            {/* OYSTER SVG */}
            <svg viewBox="0 0 100 100" className="w-24 h-24 z-10 overflow-visible">
              {/* Bottom shell */}
              <path d="M 10 70 C 10 90, 90 90, 90 70 Q 50 85, 10 70 Z" fill="#b49380" stroke="#785949" strokeWidth="2" />
              {/* Top shell opening based on progression */}
              <g style={{ transformOrigin: '50px 75px', transform: `rotate(${-sceneProgress * 35}deg)` }} className="transition-all duration-300">
                <path d="M 10 65 C 10 32, 90 32, 90 65 Q 50 55, 10 65 Z" fill="#d4b29d" stroke="#785949" strokeWidth="2" />
                {/* inner shell shine */}
                <path d="M 20 60 C 20 40, 80 40, 80 60 Q 50 52, 20 60 Z" fill="#fed7aa" opacity="0.4" />
              </g>

              {/* Magical glowing pearl appearing inside */}
              {sceneProgress > 0.4 && (
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="origin-center"
                  style={{ transformOrigin: '50px 72px' }}
                >
                  {/* Glow */}
                  <circle cx="50" cy="72" r="16" fill="#67e8f9" className="animate-ping" opacity="0.3" />
                  <circle cx="50" cy="72" r="10" fill="#fef08a" className="blur-xs animate-pulse" />
                  {/* solid pearl */}
                  <circle cx="50" cy="72" r="7.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                  <circle cx="48" cy="70" r="2.5" fill="#ffffff" opacity="0.9" /> {/* reflection */}
                </motion.g>
              )}
            </svg>
            <span className="text-blue-900 font-semibold text-[10px] bg-sky-100/85 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs mb-1">Giant Pearl Oyster</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------ SCENE 3: ZOOMED ANKLET FOCUS VIGNETTE ------------------ */}
      <AnimatePresence>
        {currentSceneId === 3 && sceneProgress > 0.1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-20 right-[15%] bg-slate-900/80 backdrop-blur-md p-3.5 rounded-3xl border border-white/15 shadow-2xl flex flex-col items-center gap-2 z-25 max-w-[170px]"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-900/35 border border-emerald-400/40 flex items-center justify-center overflow-hidden relative">
              <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
                {/* Leg bottom skin */}
                <path d="M40,0 L60,0 L60,80 L35,80 Z" fill="#c88c5a" />
                {/* Foot sweep */}
                <path d="M35,80 Q50,85, 75,90 L75,100 L25,100 Z" fill="#c88c5a" />
                {/* Anklet ring beads */}
                <ellipse cx="48" cy="75" rx="14" ry="4.5" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeDasharray="4 3" className="animate-pulse" />
                <circle cx="61.5" cy="75" r="3" fill="#ffffff" className="animate-bounce" />
                {/* Silver shines */}
                <path d="M 61 65 L63 61 L65 65 L69 67 L65 69 L63 73 L61 69 L57 67 Z" fill="#f8fafc" opacity="0.9" className="animate-pulse" />
              </svg>
            </div>
            
            <div className="text-[10px] text-neutral-300 font-medium tracking-tight mt-0.5 text-center">
              Refined Silver chains gleam...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------ SCENE 6: TABLE, COCKTAIL, AND SHATTERING GLASS ------------------ */}
      <AnimatePresence>
        {currentSceneId === 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Mahogany High bar-table */}
            <div className="absolute bottom-[108px] left-[52%] w-16 h-28 flex flex-col items-center">
              {/* Table Stand */}
              <div className="w-1.5 h-full bg-gradient-to-r from-neutral-800 to-neutral-700" />
              {/* Table Base */}
              <div className="w-14 h-3 bg-neutral-900 rounded-lg shadow-md" />
              {/* Table Oval top */}
              <div className="absolute top-0 w-20 h-5 bg-gradient-to-b from-amber-950 to-neutral-900 rounded-full border-t border-amber-900/40 shadow-inner" />
            </div>

            {/* Cocktail cup placement behavior based on progression */}
            {sceneProgress < 0.35 && (
              // Glass sits on table
              <motion.div 
                key="cocktail-standing-table"
                className="absolute bottom-[206px] left-[55%] w-6 h-6 flex justify-center z-25"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <svg viewBox="0 0 24 24" className="w-full h-full text-cyan-400">
                  <path d="M19 3H5v2l7 7v7H8v2h8v-2h-4v-7l7-7V3z" fill="currentColor" />
                  <circle cx="12" cy="6" r="3" fill="#f43f5e" /> {/* Cherry glow */}
                </svg>
              </motion.div>
            )}

            {/* Visual Glass crash event particles & comic words! */}
            {sceneProgress >= 0.52 && sceneProgress <= 0.85 && (
              <motion.div 
                key="glass-shatter-event"
                className="absolute bottom-[108px] left-[56%] w-24 h-24 z-30"
              >
                {/* Comic text crash popup */}
                <motion.div
                  initial={{ scale: 0.1, rotate: -20, opacity: 0 }}
                  animate={{ scale: [1, 1.2, 0.95], rotate: -10, opacity: 1 }}
                  className="bg-red-500 text-white font-extrabold text-xs px-2 py-1 rounded-sm border-2 border-yellow-300 shadow-lg text-center absolute top-[-30px] select-none uppercase tracking-wide flex flex-col leading-none"
                >
                  <span>*CLINK!*</span>
                  <span className="text-[9px] text-yellow-300">SMASHED! 💥</span>
                </motion.div>

                {/* Flying glass fragments */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`glass-fragment-${i}`}
                    animate={{ 
                      x: [0, (Math.random() - 0.5) * 80],
                      y: [0, -Math.random() * 40, Math.random() * 20],
                      rotate: [0, Math.random() * 360],
                      opacity: [1, 1, 0]
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute bg-cyan-200/65 rotate-45 border border-white/40"
                    style={{
                      width: `${5 + Math.random() * 8}px`,
                      height: `${3 + Math.random() * 5}px`,
                      bottom: '10px',
                      left: '20px'
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------ SCENE 7: PROPOSAL PARTICLES AND CONFETTI HEART ------------------ */}
      <AnimatePresence>
        {currentSceneId === 7 && sceneProgress > 0.45 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Bubble hearts and particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`proposal-heart-${i}`}
                initial={{ 
                  x: `${50 + (Math.random() - 0.5) * 45}%`, 
                  y: '90%', 
                  scale: 0.2, 
                  opacity: 0 
                }}
                animate={{ 
                  y: ['80%', '20%'], 
                  scale: [0.2, 1.2, 0.8], 
                  opacity: [0, 0.9, 0],
                  x: [`${50 + (Math.random() - 0.5) * 40}%`, `${52 + (Math.random() - 0.5) * 48}%`]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4.5 + i * 0.5, 
                  delay: i * 0.3, 
                  ease: "easeInOut" 
                }}
                className="absolute text-rose-400 select-none"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>
            ))}
            
            {/* Sparkle star bursts */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                animate={{ scale: [0, 1.2, 0], opacity: [0, 0.9, 0], rotate: 45 }}
                transition={{ repeat: Infinity, duration: 2.8, delay: i * 0.8, ease: "linear" }}
                className="absolute text-yellow-300 w-6 h-6"
                style={{
                  top: `${25 + i * 15}%`,
                  left: `${45 + (i % 2 === 0 ? 18 : -18)}%`
                }}
              >
                🌟
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

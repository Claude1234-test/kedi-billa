/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneId } from '../types';

interface BackgroundProps {
  currentSceneId: SceneId;
  sceneProgress: number; // 0 to 1 within current scene
  scrollProgress: number; // 0 to 1 overall
}

export default function Background({
  currentSceneId,
  sceneProgress,
  scrollProgress,
}: BackgroundProps) {
  return (
    <div id="cinematic-background" className="absolute inset-0 w-full h-full overflow-hidden transition-all duration-700 select-none bg-neutral-900">
      <AnimatePresence mode="popLayout">
        
        {/* SCENE 1: Good Sunny Day */}
        {currentSceneId === 1 && (
          <motion.div
            key="bg-scene-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full bg-gradient-to-b from-sky-400 via-sky-200 to-amber-50"
          >
            {/* Parallax Sun */}
            <div 
              style={{ transform: `translateY(${sceneProgress * 40}px) translateX(${sceneProgress * 20}px)` }} 
              className="absolute top-12 left-1/4 w-24 h-24 rounded-full bg-amber-300 blur-xs shadow-[0_0_50px_rgba(252,211,77,0.7)]"
            />

            {/* Drifting Clouds */}
            <motion.div 
              animate={{ x: [-80, 1200] }} 
              transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
              className="absolute top-16 left-0 opacity-45 pointer-events-none"
            >
              <svg width="120" height="42" viewBox="0 0 120 42" className="fill-white">
                <path d="M 20 30 C 20 20, 40 18, 50 24 C 55 15, 80 15, 85 24 C 95 20, 110 24, 110 32 C 110 38, 95 40, 20 40 Z" />
              </svg>
            </motion.div>

            <motion.div 
              animate={{ x: [-120, 1000] }} 
              transition={{ repeat: Infinity, duration: 55, delay: 10, ease: "linear" }}
              className="absolute top-28 left-0 opacity-25 pointer-events-none"
            >
              <svg width="150" height="50" viewBox="0 0 150 50" className="fill-white">
                <path d="M 30 35 C 30 25, 50 22, 60 28 C 65 18, 95 18, 100 28 C 112 24, 135 28, 135 38 C 135 44, 115 46, 30 46 Z" />
              </svg>
            </motion.div>

            {/* Flying Birds */}
            <div className="absolute top-20 right-1/4 opacity-40">
              {[...Array(3)].map((_, idx) => (
                <motion.div
                  key={`bird-${idx}`}
                  animate={{ 
                    y: [0, -10, 0],
                    x: [0, -200],
                  }}
                  transition={{ 
                    y: { repeat: Infinity, duration: 2.2, delay: idx * 0.4 },
                    x: { repeat: Infinity, duration: 24, delay: idx * 0.4, ease: "linear" }
                  }}
                  className="absolute text-neutral-400 text-xs font-bold"
                  style={{ top: `${idx * 16}px`, right: `-${idx * 24}px` }}
                >
                  <svg width="18" height="12" viewBox="0 0 24 16" className="fill-none stroke-current stroke-2">
                    <path d="M 2 8 Q 8 2, 12 8 Q 16 2, 22 8" />
                  </svg>
                </motion.div>
              ))}
            </div>

            {/* Parallax Background Green Grassway Hills */}
            <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-emerald-700 via-green-600 to-emerald-500 rounded-t-[100%_48px] opacity-90" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-800 via-emerald-700 to-green-600 rounded-t-[100%_24px] opacity-95 transform translate-y-2 scale-x-105" />
          </motion.div>
        )}

        {/* SCENE 2: Beach Vibe */}
        {currentSceneId === 2 && (
          <motion.div
            key="bg-scene-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full bg-gradient-to-b from-orange-400 via-rose-300 to-sky-100"
          >
            {/* Setting Warm Sun */}
            <div className="absolute bottom-36 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-amber-400/80 blur-xs shadow-[0_0_80px_rgba(245,158,11,0.6)]" />

            {/* Floating Palm Silhouette */}
            <div className="absolute bottom-20 left-4 w-44 h-64 opacity-50 z-10 pointer-events-none">
              <svg viewBox="0 0 100 200" className="w-full h-full fill-rose-950">
                {/* trunk */}
                <path d="M 12 200 Q 25 100, 48 50 Q 52 50, 44 200 Z" />
                {/* leaves */}
                <path d="M 46 50 Q 15 40, 5 65" stroke="currentColor" strokeWidth="3" fill="none" />
                <path d="M 46 50 Q 30 18, 15 28" stroke="currentColor" strokeWidth="3" fill="none" />
                <path d="M 48 48 Q 50 10, 68 22" stroke="currentColor" strokeWidth="3" fill="none" />
                <path d="M 48 50 Q 80 40, 92 65" stroke="currentColor" strokeWidth="3" fill="none" />
                <path d="M 48 50 Q 70 70, 75 95" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </div>

            {/* Moving sea waves layered */}
            <div className="absolute bottom-0 left-0 right-0 h-44 overflow-hidden">
              <motion.div 
                animate={{ x: [-20, 20, -20] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute bottom-12 inset-x-[-100px] h-20 bg-sky-400/40 rounded-t-[50%_15px]" 
              />
              <motion.div 
                animate={{ x: [20, -20, 20] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute bottom-6 inset-x-[-100px] h-20 bg-sky-300/60 rounded-t-[50%_15px]" 
              />
              {/* Sandy Shore beach */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-yellow-100 to-amber-100/90 rounded-t-[100%_8px] z-10" />
            </div>
          </motion.div>
        )}

        {/* SCENE 3: Park Vibe */}
        {currentSceneId === 3 && (
          <motion.div
            key="bg-scene-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full bg-gradient-to-b from-lime-200 via-emerald-100 to-green-50"
          >
            {/* Sun Rays */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(253,224,71,0.15),transparent_60%)]" />

            {/* Dangling Tree branches dangling at top */}
            <motion.div 
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-[-10px] inset-x-0 h-32 flex justify-between px-10 opacity-40"
            >
              <svg width="180" height="80" viewBox="0 0 100 50" className="fill-emerald-800">
                <path d="M0 0 C30 5, 60 15, 80 8 C60 18, 40 28, 0 10 Z" />
                <circle cx="45" cy="18" r="10" />
                <circle cx="65" cy="15" r="12" />
                <circle cx="80" cy="10" r="8" />
              </svg>
              <svg width="180" height="80" viewBox="0 0 100 50" className="fill-emerald-800 transform scale-x--1">
                <path d="M0 0 C30 5, 60 15, 80 8 C60 18, 40 28, 0 10 Z" />
                <circle cx="45" cy="18" r="10" />
                <circle cx="65" cy="15" r="12" />
                <circle cx="80" cy="10" r="8" />
              </svg>
            </motion.div>

            {/* Cozy Park Grass Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-emerald-800 via-green-700 to-green-600 rounded-t-[100%_12px] opacity-95">
              {/* Park Bench Silhouette on left */}
              <div className="absolute bottom-3 left-[12%] w-24 h-16 opacity-35">
                <svg viewBox="0 0 100 60" className="w-full h-full fill-emerald-950">
                  {/* Bench Seat and Back */}
                  <rect x="15" y="25" width="70" height="4" />
                  <rect x="15" y="10" width="70" height="4" />
                  <rect x="12" y="8" width="4" height="20" />
                  <rect x="84" y="8" width="4" height="20" />
                  {/* Legs */}
                  <line x1="22" y1="28" x2="18" y2="48" stroke="currentColor" strokeWidth="4.5" />
                  <line x1="78" y1="28" x2="82" y2="48" stroke="currentColor" strokeWidth="4.5" />
                </svg>
              </div>
            </div>
          </motion.div>
        )}

        {/* SCENE 4: Scorching Spell */}
        {currentSceneId === 4 && (
          <motion.div
            key="bg-scene-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full bg-gradient-to-b from-amber-600 via-orange-500 to-neutral-900"
          >
            {/* Blazing Sun Corona Overlay */}
            <div className="absolute inset-0 bg-yellow-400/5 animate-pulse" />
            
            {/* Pulsating Heat Wave Sun */}
            <motion.div 
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-10 left-1/3 -translate-x-1/2 w-44 h-44 rounded-full bg-yellow-300 blur-xs shadow-[0_0_120px_rgba(253,224,71,0.9)] flex items-center justify-center"
            >
              <svg className="w-full h-full animate-spin [animation-duration:40s]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="25" className="fill-yellow-100 opacity-90" />
                <path d="M50 5 L55 25 L45 25 Z" className="fill-yellow-300" />
                <path d="M50 95 L55 75 L45 75 Z" className="fill-yellow-300" />
                <path d="M5 50 L25 55 L25 45 Z" className="fill-yellow-300" />
                <path d="M95 50 L75 55 L75 45 Z" className="fill-yellow-300" />
                <path d="M18 18 L33 33 L26 38 Z" className="fill-yellow-300" />
                <path d="M82 82 L67 67 L74 62 Z" className="fill-yellow-300" />
                <path d="M82 18 L67 33 L74 38 Z" className="fill-yellow-300" />
                <path d="M18 82 L33 67 L26 62 Z" className="fill-yellow-300" />
              </svg>
            </motion.div>

            {/* Rising Heat Waves */}
            <div className="absolute bottom-0 left-0 right-0 h-44 opacity-20 pointer-events-none flex justify-around">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`ripple-${i}`}
                  animate={{ y: [-10, -120], opacity: [0.3, 0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5 + i * 0.4, ease: "linear" }}
                  className="w-1 bg-yellow-400 blur-sm rounded-full"
                  style={{ height: '80px' }}
                />
              ))}
            </div>

            {/* Dry Rocky Footpath Road background */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-neutral-950 via-amber-950 to-amber-900 rounded-t-[100%_8px] opacity-90" />
          </motion.div>
        )}

        {/* SCENE 5: Thawing Glow */}
        {currentSceneId === 5 && (
          <motion.div
            key="bg-scene-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full bg-gradient-to-b from-sky-300 via-sky-100 to-amber-50"
          >
            {/* Soothing morning sun backdrop */}
            <div className="absolute top-16 left-1/4 w-28 h-28 rounded-full bg-amber-200/60 blur-md shadow-[0_0_30px_rgba(253,230,138,0.5)]" />

            {/* Dripping Ice Shimmer Overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none flex justify-around">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`melt-drip-${i}`}
                  animate={{ y: [0, 200], opacity: [0, 0.7, 0] }}
                  transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 rounded-full bg-sky-200"
                />
              ))}
            </div>

            {/* Ground landscape cooling off into serene meadow green */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-emerald-800 to-green-600 rounded-t-[100%_8px] opacity-95" />
          </motion.div>
        )}

        {/* SCENE 6: Speakeasy Spirits */}
        {currentSceneId === 6 && (
          <motion.div
            key="bg-scene-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-950 via-purple-950 to-neutral-950"
          >
            {/* Soft pink neon line on left background */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute top-10 left-[15%] w-1 h-3/5 bg-fuchsia-500 rounded-full blur-xs shadow-[0_0_15px_rgba(244,63,94,0.8)]"
            />
            {/* Soft cyan neon line on right background */}
            <motion.div
              animate={{ opacity: [0.8, 0.4, 0.8] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute top-14 right-[15%] w-1 h-3/5 bg-cyan-400 rounded-full blur-xs shadow-[0_0_15px_rgba(34,211,238,0.8)]"
            />

            {/* Hanging bar-cup silhouettes at the top of the viewport */}
            <div className="absolute top-0 left-0 right-0 height-16 flex justify-around opacity-20 bg-black/40 py-2 border-b border-white/5">
              {[...Array(8)].map((_, i) => (
                <div key={`stem-glass-${i}`} className="w-6 h-8 border-t-2 border-neutral-600 relative rounded-sm flex flex-col items-center">
                  <div className="w-1 h-4 bg-neutral-600" />
                  <div className="w-5 h-3 border-x border-b border-neutral-600 rounded-b-md" />
                </div>
              ))}
            </div>

            {/* Ambient bokeh floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={`bokeh-${i}`}
                  animate={{
                    y: [400, 20],
                    x: [Math.random() * 800, Math.random() * 800],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5 + Math.random() * 4,
                    ease: "easeInOut",
                  }}
                  className="absolute w-4 h-4 rounded-full bg-pink-400/50 blur-xs"
                />
              ))}
            </div>

            {/* Cozy bar mahogany counter floor */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-neutral-900 to-neutral-850 border-t border-amber-900/40 opacity-95 flex items-center justify-center">
              <div className="absolute inset-x-0 bottom-4 h-[1px] bg-neutral-950/45" />
              <div className="absolute inset-x-0 bottom-12 h-[1px] bg-neutral-950/45" />
            </div>
          </motion.div>
        )}

        {/* SCENE 7: Proposal in Sunset */}
        {currentSceneId === 7 && (
          <motion.div
            key="bg-scene-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full bg-gradient-to-b from-fuchsia-950 via-rose-900 to-amber-950"
          >
            {/* Glowing Golden Sunset Sun slipping into the sea line */}
            <div className="absolute bottom-[115px] left-1/2 -translate-x-1/2 w-40 h-16 bg-gradient-to-t from-amber-400 to-rose-300 rounded-t-[100px_40px] blur-xs shadow-[0_-5px_40px_rgba(250,204,21,0.5)] flex items-end justify-center">
              <div className="w-56 h-[2px] bg-yellow-100 opacity-60 blur-xs mb-1 animate-pulse" />
            </div>

            {/* Twinkling romantic evening star vectors */}
            <div className="absolute inset-x-0 top-10 h-32 opacity-80 pointer-events-none">
              {[
                { top: '30px', left: '15%', delay: 0 },
                { top: '20px', left: '42%', delay: 1.2 },
                { top: '45px', left: '78%', delay: 0.6 },
                { top: '55px', left: '88%', delay: 1.8 },
                { top: '35px', left: '30%', delay: 2.2 },
              ].map((star, idx) => (
                <motion.div
                  key={`star-${idx}`}
                  animate={{ scale: [0.3, 1, 0.3], opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 3, delay: star.delay, ease: "easeInOut" }}
                  className="absolute text-yellow-200"
                  style={{ top: star.top, left: star.left }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current">
                    <path d="M12,0 L14.5,9.5 L24,12 L14.5,14.5 L12,24 L9.5,14.5 L0,12 L9.5,9.5 Z" />
                  </svg>
                </motion.div>
              ))}
            </div>

            {/* High-Rise City Line silhouettes */}
            <div className="absolute bottom-[110px] left-[-20px] w-[240px] h-[100px] opacity-35 flex items-end select-none pointer-events-none">
              <svg viewBox="0 0 200 100" className="w-full h-full fill-slate-950">
                <rect x="10" y="30" width="30" height="70" />
                <rect x="45" y="10" width="40" height="90" />
                <rect x="90" y="45" width="25" height="55" />
                <rect x="120" y="25" width="35" height="75" />
                <rect x="160" y="55" width="30" height="45" />
                <rect x="50" y="20" width="4" height="4" className="fill-yellow-200" />
                <rect x="58" y="20" width="4" height="4" className="fill-yellow-200" />
                <rect x="50" y="30" width="4" height="4" className="fill-yellow-200" />
                <rect x="130" y="35" width="4" height="4" className="fill-yellow-200" />
                <rect x="140" y="45" width="4" height="4" className="fill-yellow-200" />
              </svg>
            </div>

            <div className="absolute bottom-[110px] right-[-20px] w-[180px] h-[90px] opacity-25 flex items-end select-none pointer-events-none">
              <svg viewBox="0 0 150 100" className="w-full h-full fill-slate-950">
                <rect x="10" y="40" width="35" height="60" />
                <rect x="55" y="20" width="30" height="80" />
                <rect x="95" y="50" width="40" height="50" />
                <rect x="65" y="35" width="4" height="4" className="fill-yellow-200 animate-pulse" />
              </svg>
            </div>

            {/* Sea horizon line divider */}
            <div className="absolute bottom-[108px] inset-x-0 h-[2px] bg-amber-500/20 shadow-xs" />

            {/* Balcony Railing */}
            <div className="absolute bottom-0 left-0 right-0 h-[110px] bg-gradient-to-t from-neutral-900 to-neutral-800 opacity-100 z-10 shadow-sky-950 border-t-2 border-amber-900/50 flex flex-col justify-end">
              <div className="absolute top-[-30px] inset-x-0 h-[30px] opacity-90 select-none flex justify-around items-end pointer-events-none">
                {[...Array(40)].map((_, i) => (
                  <div key={`rail-rod-${i}`} className="w-[2px] h-full bg-gradient-to-t from-neutral-700 via-neutral-600 to-neutral-800" />
                ))}
                <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-neutral-600 via-neutral-500 to-neutral-600 shadow-sm" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

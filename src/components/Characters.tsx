/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { CharacterState } from '../types';

interface CharactersProps {
  key?: React.Key;
  girl: CharacterState;
  boy: CharacterState;
  sceneProgress: number;
}

const getBoyPleaSpeech = (pose: string): string | null => {
  switch (pose) {
    case 'cry_river':
      return "Satyama en kalyana aasaya kolladha! 😭💔";
    case 'angry_temper':
      return "Ayyo! If you say No, I will tell your dad! 😤💥";
    case 'puppy_plead':
      return "I promise, unlimited pani-puri/ice-cream forever! 🥺👉👈";
    case 'cardboard_romance':
      return "Look at my beautiful bio-data charts! 📋💖";
    case 'dramatic_faint':
      return "Fainted due to extreme level of rejection shock... 💫💤";
    case 'sing_guitar':
      return "Don't break my melody! Please say YES! 🎸🎵";
    case 'bollywood_dance':
      return "See my hero steps! How can you say No to this? 🕺🔥";
    case 'giant_ring':
      return "This massive custom diamond is real! Say yes! 💍✨";
    default:
      return null;
  }
};

export default function Characters({ girl, boy, sceneProgress }: CharactersProps) {
  // We track the previous X positions to suppress smooth transitions on scene jumps
  const prevBoyXRef = useRef(boy.x);
  const prevGirlXRef = useRef(girl.x);

  useEffect(() => {
    prevBoyXRef.current = boy.x;
    prevGirlXRef.current = girl.x;
  }, [boy.x, girl.x]);

  const isBoyJump = Math.abs(boy.x - prevBoyXRef.current) > 40;
  const isGirlJump = Math.abs(girl.x - prevGirlXRef.current) > 40;

  // Walk cycle leg rotations computed based on sceneProgress inside active walks
  const getLegAngles = (charState: CharacterState) => {
    if (charState.pose === 'walk' || charState.pose === 'walk-back') {
      const freq = 16; // Frequency of leg swings
      const leftLeg = Math.sin(sceneProgress * Math.PI * freq) * 22;
      const rightLeg = -Math.sin(sceneProgress * Math.PI * freq) * 22;
      const bob = Math.abs(Math.sin(sceneProgress * Math.PI * freq)) * 4.5;
      return { leftLeg, rightLeg, bob };
    }
    return { leftLeg: 0, rightLeg: 0, bob: 0 };
  };

  const girlWalk = getLegAngles(girl);
  const boyWalk = getLegAngles(boy);

  // Dynamic humor templates for cardboard sign boards held by the boy
  const getCardboardText = () => {
    // We can infer the state of rejection from boy's current pose
    if (boy.pose === 'cardboard_romance') {
      // Return a funny list of slogans that rotate or show based on sceneProgress
      const slogans = [
        "My mom already bought sweets! 🍬",
        "This Ring is Non-Refundable! 😭",
        "I'll wash dishes forever, I promise! 🧹",
        "Will love you 3000! Pls say YES? ❤️",
        "I'm cute, tall, and have curly hair! 🥺"
      ];
      // Pick based on simple floor scroll progress math to give variation
      const idx = Math.floor(sceneProgress * 4.9) % slogans.length;
      return slogans[idx];
    }
    return "Please? 🥺";
  };

  return (
    <div id="character-layer" className="absolute inset-x-0 bottom-[108px] h-48 z-20 pointer-events-none select-none">
      
      {/* ------------------ BOY CHARACTER RENDER ------------------ */}
      <motion.div
        id="character-boy"
        className="absolute bottom-0 w-24 h-56 origin-bottom flex flex-col items-center"
        animate={{
          left: `${boy.x}%`,
          bottom: `${-boy.y}px`,
          rotate: boy.pose === 'faint' || boy.pose === 'dramatic_faint' ? [0, -90] : boy.pose === 'kneel' || boy.pose === 'giant_ring' || boy.pose === 'sing_guitar' ? [0, 4] : 0,
          scaleX: boy.scaleX,
          opacity: boy.opacity,
        }}
        transition={{
          left: isBoyJump ? { type: 'tween', duration: 0 } : {
            type: 'spring',
            stiffness: 180,
            damping: 20,
            mass: 0.85,
          },
          bottom: {
            type: 'spring',
            stiffness: 180,
            damping: 20,
            mass: 0.85,
          },
          default: {
            type: 'spring',
            stiffness: 180,
            damping: 20,
            mass: 0.85,
          }
        }}
      >
        {/* Surprise heart/shouting marks above head */}
        {boy.pose === 'stand' && sceneProgress > 0.1 && (
          <motion.div
            initial={{ scale: 0, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: -20, opacity: 1 }}
            className="absolute top-[-30px] flex gap-1 z-30"
          >
            <span className="text-rose-500 text-xl animate-bounce">❤️</span>
            <span className="text-yellow-400 text-xl font-bold font-mono">!</span>
          </motion.div>
        )}

        {/* COMIC SPEECH BUBBLE FOR REJECTIONS */}
        {getBoyPleaSpeech(boy.pose) && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: -72 }}
            className="absolute left-1/2 -translate-x-1/2 z-40 bg-white text-slate-900 border border-indigo-100 py-1.5 px-3 rounded-xl shadow-2xl font-bold text-[10px] w-40 text-center select-none pointer-events-none"
          >
            {/* Triangular Speech bubble notch */}
            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r border-b border-indigo-100 rotate-45 shadow-xs" />
            <span className="leading-tight block text-rose-500 font-extrabold uppercase text-[7.5px] tracking-wider mb-0.5">Boy pleads:</span>
            <span className="leading-tight font-serif italic text-slate-800">{getBoyPleaSpeech(boy.pose)}</span>
          </motion.div>
        )}

        {/* Faint starry swirls above head */}
        {(boy.pose === 'faint' || boy.pose === 'dramatic_faint') && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
            className="absolute top-[-35px] left-1/2 -to-x-1/2 flex gap-1 text-yellow-300 text-lg font-bold select-none z-30 font-mono"
            style={{ transformOrigin: 'center' }}
          >
            💫🌀✨
          </motion.div>
        )}

        {/* Outer Ice Block wrapper for scene 4 */}
        {boy.pose === 'freeze' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.85, scale: 1.05 }}
            className="absolute inset-y-[-10px] inset-x-[-12px] bg-sky-200/50 rounded-xl border border-sky-300 backdrop-blur-subtle shadow-[0_0_35px_rgba(186,230,253,0.95)] z-30 flex items-center justify-center overflow-hidden"
          >
            {/* Ice specular textures */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-300/30 via-transparent to-white/40" />
            <svg className="absolute inset-0 w-full h-full text-white/35 stroke-current fill-none stroke-2" viewBox="0 0 100 200">
              <path d="M10,20 L40,70 L20,130 M80,44 L60,110 L90,160 M30,165 L50,190" />
            </svg>
            <span className="text-white font-extrabold text-xs shadow-xs drop-shadow-[0_2px_4px_rgba(2,132,199,0.9)] px-1 py-0.5 rounded uppercase tracking-wider scale-90 select-none">FROZEN!</span>
          </motion.div>
        )}

        {/* ANIME EMOTION CLOUDS FOR HUMOR STATES */}
        {boy.pose === 'angry_temper' && (
          <motion.div
            animate={{ scale: [0.9, 1.2, 0.9] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute top-[-30px] flex items-center gap-1 z-35 bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded border border-yellow-300 shadow-md font-mono"
          >
            <span>💢 GRRR! 💢</span>
          </motion.div>
        )}

        {/* FLOATING TEARS STREAM FOR CRYING RIVER */}
        {boy.pose === 'cry_river' && (
          <div className="absolute top-0 w-full z-35 flex justify-between px-4 pointer-events-none">
            {/* Left tear jet */}
            <motion.div
              animate={{ 
                y: [0, 60], 
                x: [-10, -50],
                scale: [1, 2.5, 0.5],
                opacity: [1, 0.8, 0] 
              }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeOut" }}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 blur-[0.5px]"
            />
            {/* Right tear jet */}
            <motion.div
              animate={{ 
                y: [0, 60], 
                x: [10, 50],
                scale: [1, 2.5, 0.5],
                opacity: [1, 0.8, 0] 
              }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 blur-[0.5px]"
            />
            <span className="absolute top-[-25px] left-1/2 -translate-x-1/2 text-cyan-300 font-extrabold text-[10px] font-mono tracking-wide uppercase">WAAAAH! 😭</span>
          </div>
        )}

        {/* PUPPY PLEAD EYES POPUP */}
        {boy.pose === 'puppy_plead' && (
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="absolute top-[-30px] z-35 bg-pink-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full border border-pink-300 uppercase tracking-wider shadow-md"
          >
            Please Sweetheart? 🥺👉👈
          </motion.div>
        )}

        {/* BOY SVG CONTAINER */}
        <div style={{ transform: `translateY(${boyWalk.bob}px)` }} className="w-full h-full relative flex flex-col items-center">
          <svg viewBox="0 0 100 200" className="w-full h-full overflow-visible">
            <defs>
              {/* STYLISH 24-YEAR-OLD INDIAN BOY wardrobe colors */}
              <linearGradient id="boyJacket" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f4c3a" /> {/* Pine Emerald Deep */}
                <stop offset="100%" stopColor="#1b855a" /> {/* Rich Green forest Accent */}
              </linearGradient>
              <linearGradient id="boyTee" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2c2a29" /> {/* Elegant charcoal inner shirt */}
                <stop offset="100%" stopColor="#181716" />
              </linearGradient>
              <linearGradient id="boySkinTone" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c58451" /> {/* Caramel Indian Skin */}
                <stop offset="100%" stopColor="#9b5c2c" /> {/* Deep shadow shading */}
              </linearGradient>
              <linearGradient id="boyHairStyle" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1f1a17" /> {/* Very dark obsidian hair */}
                <stop offset="100%" stopColor="#0d0b0a" />
              </linearGradient>
            </defs>

            {/* Stylish Handsome 24yo Curly Hair Volume Accent */}
            <g fill="url(#boyHairStyle)">
              {/* Trendy side-shaved curly volume layers */}
              <path d="M26 40 C26 15, 74 15, 74 40 C75 43, 68 50, 58 45 C54 48, 44 48, 40 45 C32 49, 25 43, 26 40 Z" />
              {/* Defined handsome loose curls */}
              <circle cx="32" cy="25" r="7.5" />
              <circle cx="44" cy="21" r="8.5" />
              <circle cx="56" cy="21" r="8.5" />
              <circle cx="68" cy="25" r="7.5" />
              <circle cx="25" cy="33" r="5.5" />
              <circle cx="75" cy="33" r="5.5" />
              <circle cx="36" cy="29" r="8" />
              <circle cx="50" cy="26" r="9" />
              <circle cx="64" cy="29" r="8" />
              <circle cx="48" cy="17" r="6" />
              <circle cx="36" cy="19" r="6.5" />
              <circle cx="64" cy="19" r="6.5" />
            </g>

            {/* Head Face Oval */}
            <circle cx="50" cy="46" r="14.5" fill="url(#boySkinTone)" />
            
            {/* ears */}
            <circle cx="33.5" cy="46" r="3.5" fill="url(#boySkinTone)" />
            <circle cx="66.5" cy="46" r="3.5" fill="url(#boySkinTone)" />

            {/* Subtle Handsome 24yo Beard/Stubble Shadow underjaw line */}
            <path d="M 34 48 C 36 60, 64 60, 66 48 C 60 56, 40 56, 34 48 Z" fill="#65351a" opacity="0.32" />

            {/* Facial Expressions based on humor or state */}
            {boy.pose === 'faint' || boy.pose === 'dramatic_faint' ? (
              // spiral dizzy fainted eyes
              <>
                <path d="M42 44 Q46 48, 42 50" stroke="#1f2937" strokeWidth="1.5" fill="none" />
                <path d="M58 44 Q62 48, 58 50" stroke="#1f2937" strokeWidth="1.5" fill="none" />
                <path d="M45 54 Q50 58, 55 54" stroke="#1f2937" strokeWidth="1.5" fill="none" />
              </>
            ) : boy.pose === 'freeze' ? (
              // frozen shocked eyes
              <>
                <circle cx="43" cy="45" r="2.5" fill="#0284c7" />
                <circle cx="57" cy="45" r="2.5" fill="#0284c7" />
                <ellipse cx="50" cy="53" rx="4" ry="2.5" fill="#0369a1" />
              </>
            ) : boy.pose === 'angry_temper' ? (
              // cross-eyed hilarious angry look
              <>
                <path d="M38 42 L46 45 M62 42 L54 45" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="44" cy="46" r="2" fill="#ef4444" />
                <circle cx="56" cy="46" r="2" fill="#ef4444" />
                <path d="M44 54 L56 54" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : boy.pose === 'cry_river' ? (
              // squeezed crying eyes
              <>
                <path d="M40 46 L45 42 L40 42" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" />
                <path d="M60 46 L55 42 L60 42" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" />
                <ellipse cx="50" cy="53" rx="5" ry="4" fill="#0891b2" /> {/* massive crying mouth */}
              </>
            ) : boy.pose === 'puppy_plead' ? (
              // Giant puppy eyes with stars
              <>
                <circle cx="43" cy="45" r="4.5" fill="#1e293b" />
                <circle cx="57" cy="45" r="4.5" fill="#1e293b" />
                <circle cx="41.5" cy="43.5" r="1.5" fill="#ffffff" />
                <circle cx="55.5" cy="43.5" r="1.5" fill="#ffffff" />
                <circle cx="44" cy="46" r="1.2" fill="#ffffff" />
                <circle cx="58" cy="46" r="1.2" fill="#ffffff" />
                {/* pleading micro smile */}
                <path d="M46 52 Q50 54, 54 52" stroke="#1e293b" strokeWidth="1.5" fill="none" />
              </>
            ) : (
              // basic charming expressions (Kneel, stand, walk, etc.)
              <>
                <circle cx="44" cy="45" r="2.2" fill="#1e293b" />
                <circle cx="56" cy="45" r="2.2" fill="#1e293b" />
                {/* cute blushes */}
                <circle cx="39" cy="48" r="2.5" fill="#fda4af" opacity="0.6" strokeWidth="0" />
                <circle cx="61" cy="48" r="2.5" fill="#fda4af" opacity="0.6" strokeWidth="0" />
                <path d="M46 51 Q50 55, 54 51" stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              </>
            )}

            {/* Neck */}
            <rect x="47" y="58" width="6" height="8" fill="url(#boySkinTone)" />

            {/* BODY POSE RENDER */}
            {boy.pose === 'kneel' || boy.pose === 'giant_ring' || boy.pose === 'sing_guitar' ? (
              // KNEELING TRANSFORMATION POSITIONS
              <>
                {/* Pine green outer blazer jacket and black inner crew */}
                <path d="M35 66 C35 66, 65 66, 60 115 L32 110 Z" fill="url(#boyJacket)" />
                <path d="M44 66 L56 66 L52 82 L48 82 Z" fill="url(#boyTee)" /> {/* tee collar */}
                
                {/* Beige chinos trousers folded */}
                <path d="M32 110 L60 115 L72 145 L40 152 L24 130 Z" fill="#e5e5e0" stroke="#cbd5e1" strokeWidth="1" />
                {/* Knees on ground */}
                <circle cx="34" cy="149" r="7" fill="#cbd5e1" />
                <circle cx="70" cy="143" r="6" fill="#cbd5e1" />

                {/* Left arm supporting */}
                <path d="M38 74 L25 95 L32 99 L42 80 Z" fill="url(#boyJacket)" />

                {boy.pose === 'kneel' && (
                  // Classic bouquet delivery
                  <g transform="translate(18, 80) rotate(-5)">
                    <path d="M40 76 L25 95 L34 100 L44 82 Z" fill="url(#boyJacket)" />
                    {/* Bunch Bouquet */}
                    <path d="M 12 15 L 2 31 L 18 31 Z" fill="#d97706" /> {/* jute wrapper */}
                    <circle cx="6" cy="12" r="6" fill="#f43f5e" /> {/* Red rose floral puffs */}
                    <circle cx="14" cy="12" r="6" fill="#e11d48" />
                    <circle cx="10" cy="6" r="6" fill="#be123c" />
                    <circle cx="5" cy="18" r="3" fill="#be123c" />
                    <circle cx="15" cy="18" r="3" fill="#f43f5e" />
                    <path d="M3 10 C0 8, 0 14, 3 14 Z" fill="#16a34a" />
                    <path d="M17 10 C20 8, 20 14, 17 14 Z" fill="#16a34a" />
                  </g>
                )}

                {boy.pose === 'giant_ring' && (
                  // Super humorous oversized glittering diamond ring
                  <g transform="translate(14, 72)" className="animate-bounce">
                    <circle cx="12" cy="18" r="10" fill="none" stroke="#fbbf24" strokeWidth="3" />
                    {/* Gigantic glittering neon blue diamond */}
                    <polygon points="12,0 4,8 12,14 20,8" fill="#a5f3fc" stroke="#22d3ee" strokeWidth="1" />
                    {/* Diamond sparkles */}
                    <path d="M12,2 L14,6 L18,8 L14,10 L12,14 L10,10 L6,8 L10,6 Z" fill="#ffffff" opacity="0.8" />
                    <circle cx="12" cy="8" r="3" fill="#ffffff" opacity="0.9" className="animate-pulse" />
                  </g>
                )}

                {boy.pose === 'sing_guitar' && (
                  // Wooden acoustic guitar sing-along proposal method
                  <g transform="translate(12, 75)" className="overflow-visible">
                    {/* Guitar Body */}
                    <ellipse cx="14" cy="24" rx="10" ry="8" fill="#b45309" stroke="#78350f" strokeWidth="1" />
                    <ellipse cx="6" cy="24" rx="8" ry="7" fill="#b45309" stroke="#78350f" strokeWidth="1" />
                    {/* Sound hole */}
                    <circle cx="10" cy="24" r="3.5" fill="#451a03" />
                    {/* Guitar Neck wood */}
                    <rect x="14" y="22" width="22" height="3.5" fill="#78350f" />
                    <rect x="36" y="20" width="4" height="6.5" fill="#451a03" /> {/* Headstock */}
                    {/* Arm holding/strumming */}
                    <path d="M18 -5 L6 15 L12 20" stroke="url(#boyJacket)" strokeWidth="6" strokeLinecap="round" />
                    <circle cx="7" cy="18" r="3" fill="url(#boySkinTone)" />
                    {/* Music notes vector puffs */}
                    <motion.text
                      x="28" y="10"
                      animate={{ y: [10, -15], opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                      className="fill-cyan-400 font-bold text-[12px]"
                    >
                      ♪
                    </motion.text>
                    <motion.text
                      x="2" y="14"
                      animate={{ y: [14, -8], opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                      className="fill-pink-400 font-bold text-[12px]"
                    >
                      ♫
                    </motion.text>
                  </g>
                )}
              </>
            ) : boy.pose === 'romantic_hug' ? (
              // DELIGHTFUL WRAPPING EMBRACE POSITIONS
              <>
                {/* Standing holding girl */}
                <path d="M34 66 L66 66 L62 120 L38 120 Z" fill="url(#boyJacket)" />
                <path d="M44 66 L56 66 L52 82 L48 82 Z" fill="url(#boyTee)" />
                {/* Joyous arms wrapped tightly around girl's waist */}
                <path d="M35 78 C24 85, 20 100, 32 108 L38 98" stroke="url(#boyJacket)" strokeWidth="8.5" strokeLinecap="round" fill="none" />
                <path d="M65 78 C74 85, 78 100, 68 108 L62 98" stroke="url(#boyJacket)" strokeWidth="8.5" strokeLinecap="round" fill="none" />
                
                {/* Chinos */}
                <rect x="38" y="120" width="24" height="15" fill="#cbd5e1" />
                <g>
                  <rect x="38" y="135" width="10" height="40" rx="2" fill="#cbd5e1" />
                  <rect x="34" y="171" width="14" height="8" rx="2" fill="#475569" />
                </g>
                <g>
                  <rect x="52" y="135" width="10" height="40" rx="2" fill="#cbd5e1" />
                  <rect x="52" y="171" width="14" height="8" rx="2" fill="#475569" />
                </g>
              </>
            ) : boy.pose === 'bollywood_dance' ? (
              // HILARIOUS SUPERSTAR BOLLYWOOD HERO POSE
              <>
                {/* Swagger trunk curve */}
                <path d="M38 66 L66 66 L58 120 L34 120 Z" fill="url(#boyJacket)" />
                <path d="M43 66 L55 66 L51 80 L47 80 Z" fill="url(#boyTee)" />
                
                {/* One arm up running in hair, other hand on hip swaggering */}
                <path d="M62 70 Q 82 52, 68 34" stroke="url(#boyJacket)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                <path d="M38 72 Q 22 84, 34 96" stroke="url(#boyJacket)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                
                {/* swagger legs */}
                <rect x="34" y="120" width="24" height="15" fill="#e5e5e0" />
                <g style={{ transformOrigin: '38px 135px', transform: 'rotate(-12deg)' }}>
                  <rect x="34" y="135" width="7" height="40" rx="2" fill="#e5e5e0" />
                  <rect x="30" y="171" width="13" height="8" rx="2" fill="#475569" />
                </g>
                <g style={{ transformOrigin: '54px 135px', transform: 'rotate(15deg)' }}>
                  <rect x="51" y="135" width="7" height="40" rx="2" fill="#e5e5e0" />
                  <rect x="51" y="171" width="13" height="8" rx="2" fill="#475569" />
                </g>
              </>
            ) : boy.pose === 'cardboard_romance' ? (
              // ROMANCE CARDBOARD PLAN
              <>
                <path d="M36 66 L64 66 L60 120 L40 120 Z" fill="url(#boyJacket)" />
                <path d="M44 66 L56 66 L52 82 L48 82 Z" fill="url(#boyTee)" />

                {/* Left and right arms raising up to hold placard */}
                <path d="M38 74 L25 61" stroke="url(#boyJacket)" strokeWidth="6.5" strokeLinecap="round" />
                <path d="M62 74 L75 61" stroke="url(#boyJacket)" strokeWidth="6.5" strokeLinecap="round" />

                {/* Cardboard Placard Panel */}
                <g transform="translate(4, 25)" className="z-30">
                  <rect x="0" y="0" width="92" height="34" rx="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="2.5" />
                  {/* Funny plea text centered */}
                  <text 
                    x="46" y="21" 
                    textAnchor="middle" 
                    className="font-sans font-extrabold fill-amber-950 text-[6.5px]"
                  >
                    {getCardboardText()}
                  </text>
                </g>

                {/* legs */}
                <path d="M40 120 L60 120 L58 135 L42 135 Z" fill="#e5e5e0" />
                <rect x="41" y="135" width="7" height="40" rx="2" fill="#e5e5e0" />
                <rect x="37" y="171" width="13" height="8" rx="2" fill="#475569" />
                <rect x="52" y="135" width="7" height="40" rx="2" fill="#e5e5e0" />
                <rect x="52" y="171" width="13" height="8" rx="2" fill="#475569" />
              </>
            ) : (
              // STANDARD STANDING/WALKING ACTIONS
              <>
                {/* Torso: smart jacket with black inner shirt */}
                <path d="M36 66 L64 66 L60 120 L40 120 Z" fill="url(#boyJacket)" />
                <path d="M44 66 L56 66 L52 82 L48 82 Z" fill="url(#boyTee)" /> {/* tee layer */}
                
                {/* Arms */}
                {boy.pose === 'drink' ? (
                  // Raised a cool neon high-ball cocktail glass
                  <>
                    <path d="M38 72 L22 90 L26 96 L41 78 Z" fill="url(#boyJacket)" />
                    <path d="M62 72 L78 58 L84 62 L65 80 Z" fill="url(#boyJacket)" />
                    {/* Detailed cocktail glass */}
                    <path d="M82 48 L73 60 L79 60 Z" fill="#22d3ee" opacity="0.9" />
                    <line x1="76" y1="60" x2="76" y2="67" stroke="#94a3b8" strokeWidth="2.5" />
                    <line x1="70" y1="67" x2="82" y2="67" stroke="#94a3b8" strokeWidth="2.5" />
                    <circle cx="78" cy="52" r="3.5" fill="#ef4444" /> {/* cherry glowing */}
                  </>
                ) : (
                  // Natural physical arms swaying inside walking
                  <>
                    <g style={{ transformOrigin: '40px 70px', transform: `rotate(${boyWalk.leftLeg * 0.45}deg)` }}>
                      <path d="M36 68 L24 105 L29 107 L40 76 Z" fill="url(#boyJacket)" />
                      <circle cx="26" cy="107" r="3.5" fill="url(#boySkinTone)" />
                    </g>
                    <g style={{ transformOrigin: '60px 70px', transform: `rotate(${boyWalk.rightLeg * 0.45}deg)` }}>
                      <path d="M64 68 L76 105 L71 107 L60 76 Z" fill="url(#boyJacket)" />
                      <circle cx="74" cy="107" r="3.5" fill="url(#boySkinTone)" />
                    </g>
                  </>
                )}

                {/* Chinos trousers pants */}
                <path d="M40 120 L60 120 L58 135 L42 135 Z" fill="#e5e5e0" />

                {/* Left Leg */}
                <g style={{ transformOrigin: '43px 135px', transform: `rotate(${boyWalk.leftLeg}deg)` }}>
                  <rect x="41" y="135" width="7" height="40" rx="2" fill="#e5e5e0" />
                  {/* Stylish Modern leather loafers shoe */}
                  <rect x="36" y="171" width="14" height="8" rx="2" fill="#451a03" />
                  {/* socks line cut */}
                  <line x1="41" y1="170" x2="48" y2="170" stroke="#f5f5f4" strokeWidth="1" />
                </g>

                {/* Right Leg */}
                <g style={{ transformOrigin: '57px 135px', transform: `rotate(${boyWalk.rightLeg}deg)` }}>
                  <rect x="52" y="135" width="7" height="40" rx="2" fill="#e5e5e0" />
                  <rect x="52" y="171" width="14" height="8" rx="2" fill="#451a03" />
                  <line x1="52" y1="170" x2="59" y2="170" stroke="#f5f5f4" strokeWidth="1" />
                </g>
              </>
            )}
          </svg>
        </div>
      </motion.div>


      {/* ------------------ GIRL CHARACTER RENDER ------------------ */}
      <motion.div
        id="character-girl"
        className="absolute bottom-0 w-24 h-41 origin-bottom flex flex-col items-center"
        animate={{
          left: `${girl.x}%`,
          bottom: `${-girl.y}px`,
          scaleX: girl.scaleX,
          opacity: girl.opacity,
        }}
        transition={{
          left: isGirlJump ? { type: 'tween', duration: 0 } : {
            type: 'spring',
            stiffness: 170,
            damping: 22,
            mass: 0.85,
          },
          bottom: {
            type: 'spring',
            stiffness: 170,
            damping: 22,
            mass: 0.85,
          },
          default: {
            type: 'spring',
            stiffness: 170,
            damping: 22,
            mass: 0.85,
          }
        }}
      >
        {/* Blush & heart sparklers in turning cute scene */}
        {girl.pose === 'turn-cute' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
            className="absolute top-[-30px] flex text-rose-500 text-base pointer-events-none select-none z-30 font-bold"
          >
            🌸✨😊
          </motion.div>
        )}

        {/* Shyness blush swirls */}
        {girl.pose === 'shy' && (
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute top-[-25px] text-pink-400 text-lg z-30 select-none animate-pulse"
          >
            🫣💞
          </motion.div>
        )}

        {/* GIRL SVG CONTAINER */}
        <div style={{ transform: `translateY(${girlWalk.bob}px)` }} className="w-full h-full relative flex flex-col items-center">
          <svg viewBox="0 0 100 200" className="w-full h-full overflow-visible">
            <defs>
              {/* STYLISH 24-YEAR-OLD INDIAN GIRL wardrobe colors */}
              <linearGradient id="girlRoyalDress" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d946ef" /> {/* Vibrant Royal Fuchsia */}
                <stop offset="100%" stopColor="#701a75" /> {/* Dark Plum Velvet */}
              </linearGradient>
              <linearGradient id="girlDarkHair" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#221510" /> {/* Dark chocolate brown waves */}
                <stop offset="100%" stopColor="#0d0705" />
              </linearGradient>
              <linearGradient id="girlSkinTone" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#cb8f60" /> {/* Honey Indian Glow Skin */}
                <stop offset="100%" stopColor="#a36b3b" />
              </linearGradient>
            </defs>

            {/* Elegant long flowing hair behind head */}
            <path d="M 28 42 Q 13 80, 24 125 Q 50 115, 76 125 Q 87 80, 72 42 Z" fill="url(#girlDarkHair)" />

            {/* Head Face OVal */}
            <circle cx="50" cy="42" r="13.5" fill="url(#girlSkinTone)" />
            
            {/* Elegant Rose-Gold Hair Bow clip accessory */}
            <path d="M43 25 L57 25 L50 31 Z" fill="#ca8a04" />
            <circle cx="50" cy="26" r="3.5" fill="#f59e0b" />

            {/* Front Fringe Soft Bangs */}
            <path d="M35 34 Q 50 24, 65 34 C 65 34, 61 44, 55 41 Q 50 43, 45 41 C 39 44, 35 34, 35 34 Z" fill="url(#girlDarkHair)" />

            {/* Eyes & Blushes Expressions */}
            {girl.pose === 'turn-cute' ? (
              // wide sparkling adorable big eyes with blushes
              <>
                <ellipse cx="44" cy="41" rx="2" ry="2.6" fill="#1c0f0a" />
                <ellipse cx="56" cy="41" rx="2" ry="2.6" fill="#1c0f0a" />
                <circle cx="45" cy="40" r="0.75" fill="#ffffff" />
                <circle cx="57" cy="40" r="0.75" fill="#ffffff" />
                
                {/* deep pink-gold cheeks blush circles */}
                <circle cx="38" cy="46" r="4" fill="#ec4899" opacity="0.85" />
                <circle cx="62" cy="46" r="4" fill="#ec4899" opacity="0.85" />
                
                <path d="M 46 47 Q 50 51, 54 47 Z" fill="#881337" />
              </>
            ) : girl.pose === 'shy' ? (
              // squeezed happy shyness blushes
              <>
                <path d="M41 42 Q45 38, 49 42" stroke="#1c0f0a" strokeWidth="2" fill="none" />
                <path d="M51 42 Q55 38, 59 42" stroke="#1c0f0a" strokeWidth="2" fill="none" />
                
                {/* blushes */}
                <circle cx="37" cy="46" r="5" fill="#db2777" opacity="0.95" />
                <circle cx="63" cy="46" r="5" fill="#db2777" opacity="0.95" />
                
                <ellipse cx="50" cy="48" rx="2" ry="2" fill="#881337" />
              </>
            ) : (
              // basic stylish smile (Walk, stand)
              <>
                <ellipse cx="45" cy="41" rx="1.8" ry="2.2" fill="#1c0f0a" />
                <ellipse cx="57" cy="41" rx="1.8" ry="2.2" fill="#1c0f0a" />
                <circle cx="39" cy="45" r="2.5" fill="#fda4af" opacity="0.65" />
                <circle cx="61" cy="45" r="2.5" fill="#fda4af" opacity="0.65" />
                <path d="M47 48 Q50 51, 53 48" stroke="#1c0f0a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              </>
            )}

            {/* Neck */}
            <rect x="47" y="55" width="6" height="7" fill="url(#girlSkinTone)" />

            {/* Torso Dress (Stylish two-layered designer outfit) */}
            <path d="M38 62 L62 62 L74 125 L26 125 Z" fill="url(#girlRoyalDress)" />
            
            {/* Elegant Golden Belt Embroidery Ribbon */}
            <rect x="36" y="73" width="28" height="5.5" fill="#eab308" rx="1.5" />
            <circle cx="50" cy="76" r="3" fill="#ca8a04" />
            <path d="M50 78 Q41 88, 44 98" stroke="#eab308" strokeWidth="2.5" fill="none" />

            {/* Arms */}
            {girl.pose === 'shy' ? (
              // shy arms interlocking together
              <>
                <path d="M35 65 Q24 78, 41 88" stroke="url(#girlSkinTone)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                <path d="M65 65 Q76 78, 59 88" stroke="url(#girlSkinTone)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                <circle cx="50" cy="88" r="4" fill="url(#girlSkinTone)" />
              </>
            ) : girl.pose === 'romantic_hug' ? (
              // arms holding boy's shoulders/neck closely
              <>
                <path d="M35 65 C 22 75, 12 85, 24 94 L32 85" stroke="url(#girlSkinTone)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                <path d="M65 65 C 78 75, 88 85, 76 94 L68 85" stroke="url(#girlSkinTone)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              </>
            ) : (
              // natural swinging arm details
              <>
                <g style={{ transformOrigin: '38px 65px', transform: `rotate(${-girlWalk.leftLeg * 0.45}deg)` }}>
                  <path d="M38 63 L28 100" stroke="url(#girlSkinTone)" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="28" cy="100" r="3.5" fill="url(#girlSkinTone)" />
                </g>
                <g style={{ transformOrigin: '62px 65px', transform: `rotate(${-girlWalk.rightLeg * 0.45}deg)` }}>
                  <path d="M62 63 L72 100" stroke="url(#girlSkinTone)" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="72" cy="100" r="3.5" fill="url(#girlSkinTone)" />
                </g>
              </>
            )}

            {/* Left Leg */}
            <g style={{ transformOrigin: '42px 125px', transform: `rotate(${girlWalk.leftLeg}deg)` }}>
              <rect x="39" y="125" width="6.5" height="42" rx="2" fill="url(#girlSkinTone)" />
              
              {/* Silver Jewelry Anklet - Scene 3 Sparkle Highlight */}
              {girl.pose === 'shy' ? (
                <g className="animate-pulse">
                  <ellipse cx="42.25" cy="155" rx="5" ry="1.5" fill="none" stroke="#f1f5f9" strokeWidth="2" />
                  <circle cx="45" cy="155" r="1.5" fill="#ffffff" />
                  <circle cx="39.5" cy="155" r="1.5" fill="#ffffff" />
                </g>
              ) : null}

              {/* Chic Purple Block Heels */}
              <ellipse cx="41.5" cy="167" rx="6" ry="4" fill="#701a75" />
              <rect x="36.5" y="167" width="2.5" height="6" fill="#cbd5e1" />
            </g>

            {/* Right Leg */}
            <g style={{ transformOrigin: '58px 125px', transform: `rotate(${girlWalk.rightLeg}deg)` }}>
              <rect x="54" y="125" width="6.5" height="42" rx="2" fill="url(#girlSkinTone)" />
              {/* Chic Purple Block Heels */}
              <ellipse cx="56.5" cy="167" rx="6" ry="4" fill="#701a75" />
              <rect x="58.5" y="167" width="2.5" height="6" fill="#cbd5e1" />
            </g>
          </svg>
        </div>
      </motion.div>
      
    </div>
  );
}

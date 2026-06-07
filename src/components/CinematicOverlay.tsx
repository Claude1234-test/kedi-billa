/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown, RotateCcw, Music } from 'lucide-react';
import { SceneConfig } from '../types';
import { SONG_LYRICS } from '../utils/songEngine';

interface CinematicOverlayProps {
  currentScene: SceneConfig;
  sceneProgress: number;
  scrollProgress: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  autoScroll: boolean;
  setAutoScroll: (auto: boolean) => void;
  onReset: () => void;
  onSkipToScene: (id: number) => void;
  scenes: SceneConfig[];
  musicType: 'synth' | 'mp3';
  setMusicType: (type: 'synth' | 'mp3') => void;
  customAudioUrl: string | null;
  customAudioName: string | null;
  onUploadCustomAudio: (file: File) => void;
  onClearCustomAudio: () => void;
}

export default function CinematicOverlay({
  currentScene,
  sceneProgress,
  scrollProgress,
  soundEnabled,
  setSoundEnabled,
  autoScroll,
  setAutoScroll,
  onReset,
  onSkipToScene,
  scenes,
  musicType,
  setMusicType,
  customAudioUrl,
  customAudioName,
  onUploadCustomAudio,
  onClearCustomAudio,
}: CinematicOverlayProps) {
  // Load lyrics synchronized tracking calculation
  const elapsedSeconds = scrollProgress * 67;
  const activeLine = SONG_LYRICS.find(l => elapsedSeconds >= l.start && elapsedSeconds <= l.end);
  
  let words: string[] = [];
  let activeIndex = -1;
  if (activeLine) {
    words = activeLine.text.split(" ");
    const lineDuration = activeLine.end - activeLine.start;
    const progressInLine = elapsedSeconds - activeLine.start;
    const lineRatio = Math.max(0, Math.min(progressInLine / (lineDuration || 1), 1));
    activeIndex = Math.min(Math.floor(lineRatio * words.length), words.length - 1);
  }

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API safely
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Safe synthesizer sound trigger based on active state changes
  const playSynthesizedSFX = (type: 'breeze' | 'pearl' | 'anklet' | 'freeze' | 'smash' | 'proposal') => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      if (type === 'pearl') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 1.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (type === 'anklet') {
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400 + i * 400, now + i * 0.1);
          gain.gain.setValueAtTime(0.1, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.6);
        }
      } else if (type === 'freeze') {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc2.type = 'sawtooth';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 1.5);
        osc2.frequency.setValueAtTime(100, now);
        osc2.frequency.exponentialRampToValueAtTime(450, now + 1.0);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc2.start(now);
        osc.stop(now + 1.6);
        osc2.stop(now + 1.6);
      } else if (type === 'smash') {
        const osc = ctx.createOscillator();
        const bGain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(30, now + 0.8);
        
        const chime = ctx.createOscillator();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(2200, now);
        chime.frequency.exponentialRampToValueAtTime(900, now + 0.4);

        bGain.gain.setValueAtTime(0.2, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        
        osc.connect(bGain);
        chime.connect(bGain);
        bGain.connect(ctx.destination);
        osc.start(now);
        chime.start(now);
        osc.stop(now + 0.8);
        chime.stop(now + 0.8);
      } else if (type === 'proposal') {
        const notes = [261.63, 329.63, 392.00, 493.88, 523.25];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.15);
          gain.gain.setValueAtTime(0.12, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 1.8);
        });
      }
    } catch (e) {
      console.warn('Web Audio Playback Error:', e);
    }
  };

  // Monitor scene progress landmarks to trigger audio feedback dynamically
  const prevSceneIdRef = useRef<number>(1);
  const triggerRef1 = useRef<boolean>(false);
  const triggerRef2 = useRef<boolean>(false);
  const triggerRef3 = useRef<boolean>(false);
  const triggerRef4 = useRef<boolean>(false);
  const triggerRef5 = useRef<boolean>(false);

  useEffect(() => {
    const sId = currentScene.id;
    
    // Scene transition general bell
    if (sId !== prevSceneIdRef.current) {
      playSynthesizedSFX('anklet');
      prevSceneIdRef.current = sId;
    }

    // Specific landmark sound cues across the 7 scenes
    if (sId === 2 && sceneProgress > 0.4 && !triggerRef1.current) {
      playSynthesizedSFX('pearl');
      triggerRef1.current = true;
    }
    if (sId === 3 && sceneProgress > 0.15 && !triggerRef2.current) {
      playSynthesizedSFX('anklet');
      triggerRef2.current = true;
    }
    if (sId === 4 && sceneProgress > 0.45 && !triggerRef3.current) {
      playSynthesizedSFX('freeze');
      triggerRef3.current = true;
    }
    if (sId === 6 && sceneProgress > 0.52 && !triggerRef4.current) {
      playSynthesizedSFX('smash');
      triggerRef4.current = true;
    }
    if (sId === 7 && sceneProgress > 0.55 && !triggerRef5.current) {
      playSynthesizedSFX('proposal');
      triggerRef5.current = true;
    }

    // Reset markers when corresponding scenes are inactive
    if (sId !== 2) triggerRef1.current = false;
    if (sId !== 3) triggerRef2.current = false;
    if (sId !== 4) triggerRef3.current = false;
    if (sId !== 6) triggerRef4.current = false;
    if (sId !== 7) triggerRef5.current = false;

  }, [currentScene.id, sceneProgress]);

  return (
    <div id="cinematic-overlay-container" className="absolute inset-0 w-full h-full pointer-events-none z-30 flex flex-col justify-between p-6 select-none">
      
      {/* HEADER SECTION - Auto Scroll HUD Controls */}
      <header className="w-full flex items-center justify-end pointer-events-auto">
        {/* CONTROLS BAR: Mute, AutoPlay & Reset */}
        <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-lg px-3 py-1.5 rounded-full border border-white/10">
          {/* Autoplay toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`cursor-pointer p-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
              autoScroll 
                ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]' 
                : 'text-neutral-300 hover:bg-white/10'
            }`}
            title={autoScroll ? "Pause Cinematic Autoplay" : "Enable Cinematic Autoplay"}
          >
            {autoScroll ? <Pause size={14} /> : <Play size={14} />}
            <span className="hidden sm:inline text-[11px] uppercase tracking-wider pr-1">
              {autoScroll ? 'Autoplay On' : 'Autoplay'}
            </span>
          </button>

          {/* Sound Synthesizer toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              getAudioContext();
            }}
            className={`cursor-pointer p-1.5 rounded-full transition-all ${
              soundEnabled ? 'text-rose-400 hover:bg-white/10' : 'text-neutral-500 hover:bg-white/5'
            }`}
            title={soundEnabled ? "Mute Synthesizer SFX" : "Unmute Synthesizer SFX"}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* MP3/WAV Upload & Permanent Selector Trigger */}
          <div className="flex items-center gap-1 border-l border-white/10 pl-2">
            <label className="cursor-pointer p-1.5 rounded-full text-neutral-300 hover:bg-white/10 transition-all flex items-center justify-center animate-pulse" title="Upload custom song (MP3, WAV, etc.) to keep permanently">
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUploadCustomAudio(file);
                  }
                }}
              />
              <Music size={14} className={musicType === 'mp3' ? 'text-emerald-400' : 'text-neutral-400'} />
            </label>
            {customAudioUrl && (
              <div className="flex items-center gap-1 bg-neutral-900/80 rounded-full border border-white/5 py-0.5 px-2">
                <button
                  onClick={() => {
                    const nextType = musicType === 'synth' ? 'mp3' : 'synth';
                    setMusicType(nextType);
                    setSoundEnabled(true);
                  }}
                  className={`text-[9.5px] font-mono font-extrabold transition-all truncate max-w-[85px] selection:bg-transparent ${
                    musicType === 'mp3' 
                      ? 'text-emerald-400 font-bold' 
                      : 'text-neutral-400'
                  }`}
                  title={`Track: ${customAudioName || 'Uploaded Audio'}. Click to toggle source.`}
                >
                  {musicType === 'mp3' ? 'Custom MP3' : 'Synth'}
                </button>
                <button
                  onClick={onClearCustomAudio}
                  className="cursor-pointer text-rose-500 hover:text-rose-400 font-bold text-[9px] pl-0.5"
                  title="Remove custom stored audio file from browser"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="cursor-pointer p-1.5 rounded-full text-neutral-300 hover:bg-white/10 transition-all hover:rotate-[-45deg] border-l border-white/10 pl-2"
            title="Reset to Scene 1"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </header>

      {/* FOOTER SECTION - Continuous scrolling timeline status bar with Real-time active Lyrics */}
      <footer className="w-full flex flex-col items-center gap-3.5 pointer-events-auto">
        {/* Real-time synchronized lyrics card */}
        <div id="lyrics-karaoke-board" className="w-full max-w-xl mx-auto bg-slate-950/75 backdrop-blur-md rounded-2xl border border-white/10 px-5 py-3 text-center min-h-[58px] flex items-center justify-center shadow-2xl select-none mb-1">
          {activeLine ? (
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              {words.map((word, idx) => {
                const isActive = idx === activeIndex;
                const isPast = idx < activeIndex;
                return (
                  <span
                    key={`${word}-${idx}`}
                    className={`text-sm tracking-wide transition-all duration-150 inline-block ${
                      isActive
                        ? 'text-rose-400 font-extrabold scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.75)]'
                        : isPast
                        ? 'text-amber-100/90 font-medium'
                        : 'text-neutral-500/40 font-normal scale-95'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-center opacity-30 select-none">
              <span className="text-sm text-rose-400/80 animate-pulse">🎵</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500/60 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-sm text-rose-400/80 animate-pulse">🎵</span>
            </div>
          )}
        </div>

        <div className="w-full max-w-4xl flex items-center gap-3 px-4">
          <ChevronUp className="text-neutral-500 animate-bounce scroll-prompt-up" size={13} />
          <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden relative">
            <div 
              style={{ width: `${scrollProgress * 100}%` }}
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-500 to-amber-300 rounded-full transition-all duration-100"
            />
          </div>
          <ChevronDown className="text-neutral-500 animate-bounce scroll-prompt-down" size={13} />
        </div>
      </footer>
    </div>
  );
}

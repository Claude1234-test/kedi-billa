/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Navigation, ChevronDown, RotateCcw } from 'lucide-react';
import { SceneConfig, SceneId, CharacterState } from './types';
import Background from './components/Background';
import Characters from './components/Characters';
import SceneAssets from './components/SceneAssets';
import CinematicOverlay from './components/CinematicOverlay';
import { RomanticSynthSong } from './utils/songEngine';

const SCENES: SceneConfig[] = [
  {
    id: 1,
    title: "Sunbeams & Flutter",
    subtitle: "A Good Sunny Day",
    description: "A gorgeous sun rises in sapphire skies. The girl walks with soft, elegant strides through the blossom fields, as the boy follows her every step in awe.",
    startScroll: 0.0,
    endScroll: 0.15
  },
  {
    id: 2,
    title: "Ocean Serenade",
    subtitle: "Beachside Discovery",
    description: "Suddenly she turns back to catch him, flashing an adorable cute smile. The horizon transforms into a tropical sunset shore where a glistening oyster opens to reveal a magical pearl.",
    startScroll: 0.15,
    endScroll: 0.20
  },
  {
    id: 3,
    title: "Blushing Meadow",
    subtitle: "A Park Secret",
    description: "The pearl fades. Turning in utter shyness, her face blushes warm gold. The boy catches a glimpse of her ankle, where a refined silver anklet appears in a tranquil spring park.",
    startScroll: 0.20,
    endScroll: 0.33
  },
  {
    id: 4,
    title: "Scorching Spell",
    subtitle: "Hot Summer Surprise",
    description: "Blazing heat waves ripple under a scorching midday sun. The girl halts and swivels to find him trailing, freezing the startled boy instantly inside a glossy solid ice block!",
    startScroll: 0.33,
    endScroll: 0.39
  },
  {
    id: 5,
    title: "Thawing Glow",
    subtitle: "Warm Spring Melt",
    description: "Amused by his shock, she takes a step back towards him. The biting frost cracks and melts away from the sun. Freed from the ice, the boy warmheartedly resumes following his muse.",
    startScroll: 0.39,
    endScroll: 0.44
  },
  {
    id: 6,
    title: "Speakeasy Spirits",
    subtitle: "Bar Neon Crash",
    description: "They wander into a cozy, neon-lit speakeasy. Seeking courage, the boy swipes a fancy cocktail and gulps it down... before tipping backward, fainting onto the floor with a clatter!",
    startScroll: 0.44,
    endScroll: 0.56
  },
  {
    id: 7,
    title: "Proposal in Sunset",
    subtitle: "Balcony of Tomorrow",
    description: "Far atop a penthouse balcony in the cooling breeze, she helps him up. Overlooking the crimson seaside skyline, he drops to one knee and proposes with a brilliant bundle of roses.",
    startScroll: 0.56,
    endScroll: 1.0
  }
];

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false); // Default to false

  // Music configuration & Custom MP3 states
  const [musicType, setMusicType] = useState<'synth' | 'mp3'>('synth');
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customAudioName, setCustomAudioName] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{
    text: string;
    type: 'success' | 'error' | 'info' | null;
  }>({ text: '', type: null });

  // Restore persisted audio on mount
  useEffect(() => {
    async function restoreAudio() {
      try {
        const { getPermanentAudio } = await import('./utils/audioStorage');
        const saved = await getPermanentAudio();
        if (saved) {
          const url = URL.createObjectURL(saved.blob);
          setCustomAudioUrl(url);
          setCustomAudioName(saved.name);
          setMusicType('mp3');
          setSoundEnabled(true);
        } else {
          // Fallback: If no browser-persisted custom file is present in IndexedDB,
          // check if they've placed a "song.mp3" file inside their project's "public/" directory.
          // In Vite-based builds (like GitHub to Vercel), files in "public/" are served at the root "/" path.
          // This automatically makes the song sync across all devices visiting the site!
          const defaultSongUrl = '/song.mp3';
          const res = await fetch(defaultSongUrl, { method: 'GET' });
          const contentType = res.headers.get('content-type') || '';
          if (res.ok && !contentType.includes('text/html')) {
            setCustomAudioUrl(defaultSongUrl);
            setCustomAudioName('song.mp3');
            setMusicType('mp3');
            setSoundEnabled(true);
          }
        }
      } catch (err) {
        console.warn("Could not restore custom MP3 from database or fallback directory file", err);
      }
    }
    restoreAudio();
  }, []);

  const handleUploadCustomAudio = async (file: File) => {
    setSaveStatus({ text: `Storing "${file.name}" permanently in your browser...`, type: 'info' });
    try {
      const { savePermanentAudio } = await import('./utils/audioStorage');
      await savePermanentAudio(file);
      setSaveStatus({ text: `"${file.name}" successfully stored permanently!`, type: 'success' });
    } catch (e: any) {
      console.warn("Failed to save audio permanently", e);
      setSaveStatus({ text: e.message || "Saved temporarily for this session.", type: 'info' });
    }
    const url = URL.createObjectURL(file);
    setCustomAudioUrl(url);
    setCustomAudioName(file.name);
    setMusicType('mp3');
    setSoundEnabled(true);

    // Auto-clear notification after 4.5 seconds
    setTimeout(() => {
      setSaveStatus(prev => prev.type === 'info' ? prev : { text: '', type: null });
    }, 4500);
  };

  const handleClearCustomAudio = () => {
    try {
      localStorage.removeItem('fallback_custom_song');
      const req = indexedDB.open('RomanticAnimationAudioDB_v2', 1);
      req.onsuccess = (e: any) => {
        const db = e.target.result;
        if (db.objectStoreNames.contains('audioStore')) {
          const transaction = db.transaction(['audioStore'], 'readwrite');
          transaction.objectStore('audioStore').delete('custom_song');
        }
      };
    } catch (e) {
      console.warn("Deletion failed", e);
    }
    setCustomAudioUrl(null);
    setCustomAudioName(null);
    setMusicType('synth');
    setSaveStatus({ text: "Custom audio removed from storage. Reset to original synth.", type: 'info' });
    setTimeout(() => {
      setSaveStatus({ text: '', type: null });
    }, 3000);
  };

  // Original Romantic Synthesizer song engine
  const songEngineRef = useRef<RomanticSynthSong | null>(null);
  // Custom HTMLAudioElement for local MP3 playback
  const mp3Ref = useRef<HTMLAudioElement | null>(null);

  // Helper effect to manage custom HTMLAudioElement source binding with automatic error fallback
  useEffect(() => {
    let activeHandler: (() => void) | null = null;
    
    if (customAudioUrl) {
      const handleAudioError = () => {
        console.warn("Custom audio URL failed to load/play. Falling back to synthesizer.", customAudioUrl);
        setMusicType('synth');
      };
      activeHandler = handleAudioError;

      if (!mp3Ref.current) {
        mp3Ref.current = new Audio(customAudioUrl);
        mp3Ref.current.loop = true;
      } else {
        mp3Ref.current.src = customAudioUrl;
      }
      mp3Ref.current.addEventListener('error', handleAudioError);
    }

    return () => {
      if (mp3Ref.current) {
        if (activeHandler) {
          mp3Ref.current.removeEventListener('error', activeHandler);
        }
        mp3Ref.current.pause();
        mp3Ref.current = null;
      }
    };
  }, [customAudioUrl]);

  // Main synchronized audio manager with graceful interaction listeners for autoplay
  useEffect(() => {
    // 1. Fully silence/clear synthetic player
    if (songEngineRef.current) {
      songEngineRef.current.stop();
    }
    if (!songEngineRef.current) {
      songEngineRef.current = new RomanticSynthSong();
    }

    // 2. Fully pause custom MP3
    if (mp3Ref.current) {
      mp3Ref.current.pause();
    }

    // Attempt to start audio playback
    const attemptPlay = () => {
      if (soundEnabled) {
        if (musicType === 'synth') {
          songEngineRef.current?.start(true);
        } else if (musicType === 'mp3' && mp3Ref.current) {
          mp3Ref.current.play().catch(err => {
            console.warn("Autoplay blocked custom MP3 playback initially, waiting for action", err);
          });
        }
      }
    };

    attemptPlay();

    // Attach listeners on major interaction vectors to automatically play as soon as they interact with the page
    const handleFirstInteraction = () => {
      attemptPlay();
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('scroll', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });

    return () => {
      songEngineRef.current?.stop();
      if (mp3Ref.current) {
        mp3Ref.current.pause();
      }
      cleanupListeners();
    };
  }, [soundEnabled, musicType, customAudioUrl]);

  // Proposal interaction states
  const [proposal, setProposal] = useState<{
    state: 'pending' | 'rejected' | 'accepted';
    subState: 'normal' | 'cry' | 'angry' | 'plead' | 'card' | 'faint' | 'guitar' | 'dance' | 'giant_ring';
    rejectionCount: number;
    showHelpHint: boolean;
  }>({
    state: 'pending',
    subState: 'normal',
    rejectionCount: 0,
    showHelpHint: false,
  });

  const proposalRef = useRef(proposal);
  useEffect(() => {
    proposalRef.current = proposal;
  }, [proposal]);



  // Web Audio Synthesizer feedback tones
  const playProposalTone = (type: 'accept' | 'reject' | 'try_again') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      if (type === 'accept') {
        const freqs = [261.63, 329.63, 392.00, 523.25, 659.25];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 1.5);
        });
      } else if (type === 'reject') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.6);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(349.23, now);
        osc.frequency.setValueAtTime(440.00, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      console.warn("Synthesizer failed", e);
    }
  };

  // Safe scene layout boundary check
  const getActiveScene = (progress: number): SceneConfig => {
    const active = SCENES.find(s => progress >= s.startScroll && progress <= s.endScroll);
    return active || SCENES[SCENES.length - 1];
  };

  const currentScene = getActiveScene(scrollProgress);
  const currentSceneId = currentScene.id as SceneId;

  // Calculate percentage progress strictly within the current scene (0 to 1)
  const getSceneProgress = (progress: number, scene: SceneConfig): number => {
    const diff = scene.endScroll - scene.startScroll;
    if (diff <= 0) return 0;
    const currentLocal = (progress - scene.startScroll) / diff;
    return Math.max(0, Math.min(1, currentLocal));
  };

  const sceneProgress = getSceneProgress(scrollProgress, currentScene);

  // Auto-scroll ticking hook synchronized with Custom MP3 playhead
  useEffect(() => {
    if (!autoScroll) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      let nextScrollY = 0;

      // Authentically drive animation frame directly from the MP3 file currentTime to ensure perfect lock!
      if (musicType === 'mp3' && mp3Ref.current && !isNaN(mp3Ref.current.duration) && mp3Ref.current.duration > 0) {
        const audioPos = mp3Ref.current.currentTime / mp3Ref.current.duration;
        nextScrollY = audioPos * maxScroll;
      } else {
        const duration = 67000; // Complete full 7-step cycle in 67s beautifully (1.07 min)
        const delta = now - lastTime;
        lastTime = now;
        const currentScrollY = window.scrollY;
        nextScrollY = currentScrollY + (maxScroll / duration) * delta;
      }

      // Wrap-around ending screen allows loop back
      if (nextScrollY >= maxScroll) {
        nextScrollY = 0;
        setProposal({
          state: 'pending',
          subState: 'normal',
          rejectionCount: 0,
          showHelpHint: false,
        });
        if (musicType === 'mp3' && mp3Ref.current) {
          mp3Ref.current.currentTime = 0;
        }
      }

      // Proactively stop auto-scroll right on proposal point (50% through Scene 7)
      if (currentSceneId === 7) {
        const scProgress = getSceneProgress(window.scrollY / maxScroll, SCENES[6]);
        if (scProgress >= 0.50 && proposalRef.current.state !== 'accepted') {
          setAutoScroll(false);
          const pinnedY = (SCENES[6].startScroll + 0.52 * (SCENES[6].endScroll - SCENES[6].startScroll)) * maxScroll;
          window.scrollTo(0, pinnedY);
          return;
        }
      }

      window.scrollTo(0, nextScrollY);
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [autoScroll, currentSceneId, musicType]);

  // Window scroll track event with proposal locks and manual sound seek
  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height <= 0) return;
      const progress = Math.max(0, Math.min(1, top / height));

      // Strictly defend the Scene 7 Proposal moment: prevent scrolling past 54% of scene 7
      const activeSc = SCENES.find(s => progress >= s.startScroll && progress <= s.endScroll) || SCENES[SCENES.length - 1];
      if (activeSc.id === 7) {
        const scProg = (progress - activeSc.startScroll) / (activeSc.endScroll - activeSc.startScroll);
        if (scProg >= 0.54 && proposalRef.current.state !== 'accepted') {
          const pinnedY = (activeSc.startScroll + 0.52 * (activeSc.endScroll - activeSc.startScroll)) * height;
          window.scrollTo(0, pinnedY);
          setScrollProgress(activeSc.startScroll + 0.51 * (activeSc.endScroll - activeSc.startScroll));
          return;
        }
      }

      setScrollProgress(progress);

      // If user is operating manually (not in autoscroll), seamlessly synchronize audio playhead
      if (!autoScroll) {
        if (musicType === 'mp3' && mp3Ref.current && !isNaN(mp3Ref.current.duration) && mp3Ref.current.duration > 0) {
          const targetTime = progress * mp3Ref.current.duration;
          // Avoid micro seek updates on micro changes
          if (Math.abs(mp3Ref.current.currentTime - targetTime) > 0.6) {
            mp3Ref.current.currentTime = targetTime;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: false });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [proposal.state, autoScroll, musicType]);

  // Compute character states dynamically based on scroll triggers
  const getCharactersState = (): { girl: CharacterState; boy: CharacterState } => {
    let girl: CharacterState = { x: 30, y: 0, scaleX: 1, pose: 'stand', opacity: 1 };
    let boy: CharacterState = { x: 10, y: 0, scaleX: 1, pose: 'stand', opacity: 1 };

    // Standard offscreen coordinates for entering/leaving
    const girlStart = -15;
    const boyStart = -30;
    const girlEnd = 115;
    const boyEnd = 100;

    // Default target action positions for each scene
    let girlActiveStart = 45;
    let girlActiveEnd = 68;
    let boyActiveStart = 20;
    let boyActiveEnd = 44;

    // Define scene-specific layout anchors for active phases to prevent jumps
    switch (currentSceneId) {
      case 1:
        girlActiveStart = 40; girlActiveEnd = 70;
        boyActiveStart = 16; boyActiveEnd = 46;
        break;
      case 2:
        girlActiveStart = 45; girlActiveEnd = 65;
        boyActiveStart = 20; boyActiveEnd = 40;
        break;
      case 3:
        girlActiveStart = 42; girlActiveEnd = 60;
        boyActiveStart = 18; boyActiveEnd = 38;
        break;
      case 4:
        girlActiveStart = 40; girlActiveEnd = 66;
        boyActiveStart = 15; boyActiveEnd = 46;
        break;
      case 5:
        girlActiveStart = 66; girlActiveEnd = 58;
        boyActiveStart = 46; boyActiveEnd = 40;
        break;
      case 6:
        girlActiveStart = 45; girlActiveEnd = 65;
        boyActiveStart = 20; boyActiveEnd = 40;
        break;
      case 7:
        girlActiveStart = 45; girlActiveEnd = 64;
        boyActiveStart = 22; boyActiveEnd = 44;
        break;
    }

    // MULTI-PHASE SCHEDULER (0.0 to 0.20 ENTRANCE, 0.20 to 0.80 ACTIVE, 0.80 to 1.00 EXIT)
    if (sceneProgress < 0.20) {
      // 1. Entrance Walking-In Phase
      const ratio = sceneProgress / 0.20;
      girl.x = girlStart + ratio * (girlActiveStart - girlStart);
      girl.pose = 'walk';
      girl.scaleX = 1;

      boy.x = boyStart + ratio * (boyActiveStart - boyStart);
      boy.pose = 'walk';
      boy.scaleX = 1;

      return { girl, boy };
    } else if (sceneProgress > 0.80) {
      // 3. Exit Walking-Out Phase (Only exits Scene 7 if accepted!)
      if (currentSceneId === 7 && proposal.state !== 'accepted') {
        // Force stay in the proposal deck until she accepts!
        girl.x = 64;
        girl.pose = 'turn-cute';
        girl.scaleX = -1;

        boy.x = 44;
        boy.pose = 'kneel';
        boy.scaleX = 1;
        return { girl, boy };
      }

      const ratio = (sceneProgress - 0.80) / 0.20;
      girl.x = girlActiveEnd + ratio * (girlEnd - girlActiveEnd);
      girl.pose = 'walk';
      girl.scaleX = 1;

      boy.x = boyActiveEnd + ratio * (boyEnd - boyActiveEnd);
      boy.pose = 'walk';
      boy.scaleX = 1;

      // Special interactive finish: they walk offscreen very close together holding hands!
      if (currentSceneId === 7 && proposal.state === 'accepted') {
        boy.x = Math.max(girlStart, girl.x - 7); 
        boy.scaleX = 1;
        girl.scaleX = 1;
      }

      return { girl, boy };
    } else {
      // 2. Active Scene Interaction Phase (0.20 to 0.80) - map progress from 0 to 1
      const activeProgress = (sceneProgress - 0.20) / 0.60;

      switch (currentSceneId) {
        case 1:
          // Walk across flower garden together
          girl.x = girlActiveStart + activeProgress * (girlActiveEnd - girlActiveStart);
          girl.pose = 'walk';
          girl.scaleX = 1;

          boy.x = boyActiveStart + activeProgress * (boyActiveEnd - boyActiveStart);
          boy.pose = 'walk';
          boy.scaleX = 1;
          break;

        case 2:
          // Beach Walk & surprise turn
          girl.x = girlActiveEnd;
          if (activeProgress < 0.40) {
            girl.pose = 'stand';
            girl.scaleX = 1;
          } else {
            girl.pose = 'turn-cute';
            girl.scaleX = -1; // turns cute
          }

          boy.x = boyActiveStart + activeProgress * (boyActiveEnd - boyActiveStart);
          boy.pose = activeProgress < 0.80 ? 'walk' : 'stand';
          boy.scaleX = 1;
          break;

        case 3:
          // Blushing meadow silver anklet
          girl.x = girlActiveEnd;
          girl.pose = 'shy';
          girl.scaleX = -1;

          boy.x = boyActiveStart + activeProgress * (boyActiveEnd - boyActiveStart);
          boy.pose = activeProgress < 0.80 ? 'walk' : 'stand';
          boy.scaleX = 1;
          break;

        case 4:
          // Sorching Spell: Girl turns and Boy freezes!
          if (activeProgress < 0.55) {
            const ratio = activeProgress / 0.55;
            girl.x = girlActiveStart + ratio * (girlActiveEnd - girlActiveStart);
            girl.pose = 'walk';
            girl.scaleX = 1;

            boy.x = boyActiveStart + ratio * (boyActiveEnd - boyActiveStart);
            boy.pose = 'walk';
            boy.scaleX = 1;
          } else {
            girl.x = girlActiveEnd;
            girl.pose = 'turn-cute';
            girl.scaleX = -1;

            boy.x = boyActiveEnd;
            boy.pose = 'freeze'; // solid frozen ice block!
            boy.scaleX = 1;
          }
          break;

        case 5:
          // Thawing Glow: she steps back and he melts
          boy.x = boyActiveStart; // starts frozen spot
          if (activeProgress < 0.50) {
            const ratio = activeProgress / 0.50;
            girl.x = girlActiveStart - ratio * (girlActiveStart - girlActiveEnd);
            girl.pose = 'walk-back';
            girl.scaleX = -1;

            boy.pose = 'freeze';
            boy.scaleX = 1;
          } else {
            girl.x = girlActiveEnd;
            girl.pose = 'stand';
            girl.scaleX = 1;

            const ratio = (activeProgress - 0.50) / 0.50;
            boy.x = boyActiveStart - ratio * (boyActiveStart - boyActiveEnd);
            boy.pose = 'walk';
            boy.scaleX = 1;
          }
          break;

        case 6:
          // Speakeasy Drinks & Faint
          if (activeProgress < 0.40) {
            const ratio = activeProgress / 0.40;
            girl.x = girlActiveStart + ratio * (girlActiveEnd - girlActiveStart);
            girl.pose = 'walk';
            girl.scaleX = 1;

            boy.x = boyActiveStart + ratio * (boyActiveEnd - boyActiveStart);
            boy.pose = 'walk';
            boy.scaleX = 1;
          } else if (activeProgress < 0.65) {
            girl.x = girlActiveEnd;
            girl.pose = 'stand';
            girl.scaleX = 1;

            boy.x = boyActiveEnd;
            boy.pose = 'drink'; // sipping glowing cocktail
            boy.scaleX = 1;
          } else {
            const ratio = (activeProgress - 0.65) / 0.35;
            girl.x = girlActiveEnd - ratio * 10;
            girl.pose = 'walk-back';
            girl.scaleX = -1; // races over concerned

            boy.x = boyActiveEnd - ratio * 4;
            boy.y = ratio * 14;
            boy.pose = 'faint'; // dizzy fainting fall!
            boy.scaleX = 1;
          }
          break;

        case 7:
          // Sunset Penthouse Balcony - Interactive Proposal Node!
          if (activeProgress < 0.35) {
            const ratio = activeProgress / 0.35;
            girl.x = 80 - ratio * 16; 
            girl.pose = 'walk-back';
            girl.scaleX = -1;

            boy.x = 36 + ratio * 8;
            boy.y = 14 * (1 - ratio);
            boy.pose = 'walk';
            boy.scaleX = 1;
          } else {
            girl.x = 64;
            boy.x = 44;
            boy.y = 0;

            // Compute actual interactive proposal branches
            if (proposal.state === 'pending') {
              boy.pose = 'kneel';
              girl.pose = 'turn-cute';
              girl.scaleX = -1;
            } else if (proposal.state === 'accepted') {
              // Delightful cozy cuddle hug!
              boy.x = 55;
              girl.x = 58;
              boy.pose = 'romantic_hug';
              boy.scaleX = 1;
              girl.pose = 'romantic_hug';
              girl.scaleX = -1;
            } else if (proposal.state === 'rejected') {
              // Direct posing from comical subState
              girl.scaleX = -1;
              if (proposal.subState === 'cry') {
                boy.pose = 'cry_river';
                girl.pose = 'shy';
              } else if (proposal.subState === 'angry') {
                boy.pose = 'angry_temper';
                girl.pose = 'stand';
              } else if (proposal.subState === 'plead') {
                boy.pose = 'puppy_plead';
                girl.pose = 'shy';
              } else if (proposal.subState === 'card') {
                boy.pose = 'cardboard_romance';
                girl.pose = 'turn-cute';
              } else if (proposal.subState === 'faint') {
                boy.pose = 'dramatic_faint';
                boy.y = -2;
                girl.pose = 'shy';
              } else if (proposal.subState === 'guitar') {
                boy.pose = 'sing_guitar';
                girl.pose = 'shy';
              } else if (proposal.subState === 'dance') {
                boy.pose = 'bollywood_dance';
                girl.pose = 'turn-cute';
              } else if (proposal.subState === 'giant_ring') {
                boy.pose = 'giant_ring';
                girl.pose = 'turn-cute';
              } else {
                boy.pose = 'kneel';
                girl.pose = 'turn-cute';
              }
            }
          }
          break;
      }
    }

    return { girl, boy };
  };

  const { girl, boy } = getCharactersState();

  const handleAcceptProposal = () => {
    playProposalTone('accept');
    setProposal(prev => ({
      ...prev,
      state: 'accepted'
    }));
    // Re-engage autoplay/scroll immediately to automatically float them to the beautiful curtain call!
    setAutoScroll(true);
  };

  const handleRejectProposal = () => {
    playProposalTone('reject');
    setProposal(prev => {
      const nextCount = prev.rejectionCount + 1;
      const subs: typeof prev.subState[] = [
        'cry',
        'angry',
        'plead',
        'card',
        'faint',
        'guitar',
        'dance',
        'giant_ring'
      ];
      const nextSub = subs[(nextCount - 1) % subs.length];
      return {
        ...prev,
        state: 'rejected',
        subState: nextSub,
        rejectionCount: nextCount,
        showHelpHint: nextCount >= 3
      };
    });
  };

  const handleSkip = (sceneId: number) => {
    const segment = SCENES.find(s => s.id === sceneId);
    if (!segment) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    window.scrollTo({
      top: segment.startScroll * maxScroll + 2,
      behavior: 'smooth'
    });
  };

  const handleReset = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setScrollProgress(0);
    setProposal({
      state: 'pending',
      subState: 'normal',
      rejectionCount: 0,
      showHelpHint: false,
    });
  };

  // Showing fireworks or ending marquee when scroll progress reaches the final limit
  const isEnding = scrollProgress >= 0.98;

  return (
    <div id="movie-stage-canvas" className="relative w-full text-slate-100 font-sans selection:bg-rose-500/30">
      
      {/* 1. SEVEN LAYER SCROLL REAL ESTATE TRACKING DIV */}
      <div className="w-full h-[650vh] absolute top-0 left-0 pointer-events-none" />

      {/* 2. THE FLOATING VIEWPORT CANVAS CONTAINER (STAYS COMPACT IN FOCUS VIEWPOR) */}
      <main className="fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center justify-center z-10">
        
        {/* CINEMATIC PARALLAX SCENE BACKGROUND FRAME */}
        <Background 
          currentSceneId={currentSceneId} 
          sceneProgress={sceneProgress} 
          scrollProgress={scrollProgress} 
        />

        {/* STATIC MIDDLEGROUND DECORATIVE PATHWAY */}
        <div className="absolute inset-x-0 bottom-0 h-44 pointer-events-none select-none z-10">
          {/* Subtle dirt lane shadow for continuous left-to-right grounding */}
          <div className="absolute bottom-24 inset-x-0 h-10 bg-black/10 blur-md rounded-full scale-y-50" />
        </div>

        {/* THE LAYERED CHARACTER MODELS (GIRL & BOY ACTORS) */}
        <Characters 
          key={currentSceneId}
          girl={girl} 
          boy={boy} 
          sceneProgress={sceneProgress} 
        />

        {/* DETAILED INTERACTIVE SCENE OBJECT NODES */}
        <SceneAssets 
          currentSceneId={currentSceneId} 
          sceneProgress={sceneProgress} 
        />

        {/* FULL MULTIMEDIA CONTROLS & DESCRIPTIVE DIALOGUE SUBTITLES OVERLAY */}
        <CinematicOverlay 
          currentScene={currentScene} 
          sceneProgress={sceneProgress} 
          scrollProgress={scrollProgress}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          autoScroll={autoScroll}
          setAutoScroll={setAutoScroll}
          onReset={handleReset}
          onSkipToScene={handleSkip}
          scenes={SCENES}
          musicType={musicType}
          setMusicType={setMusicType}
          customAudioUrl={customAudioUrl}
          customAudioName={customAudioName}
          onUploadCustomAudio={handleUploadCustomAudio}
          onClearCustomAudio={handleClearCustomAudio}
        />

        {/* DYNAMIC STORAGE STATUS NOTIFICATION BAR */}
        <AnimatePresence>
          {saveStatus.type && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className={`absolute top-20 left-1/2 z-50 px-5 py-2.5 rounded-full border text-[11px] font-bold uppercase tracking-wider shadow-2xl flex items-center gap-2.5 backdrop-blur-md pointer-events-none select-none max-w-[90%] sm:max-w-md ${
                saveStatus.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
                  : saveStatus.type === 'error'
                  ? 'bg-rose-950/90 border-rose-500/30 text-rose-300'
                  : 'bg-slate-900/95 border-rose-500/20 text-rose-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                saveStatus.type === 'success' 
                  ? 'bg-emerald-400' 
                  : saveStatus.type === 'error' 
                  ? 'bg-rose-500' 
                  : 'bg-rose-400'
              } animate-ping`} />
              <span className="truncate">{saveStatus.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INTERACTIVE PROPOSAL BOTTOM BUTTONS */}
        <AnimatePresence>
          {currentSceneId === 7 && sceneProgress >= 0.43 && proposal.state !== 'accepted' && !isEnding && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              transition={{ type: 'spring', stiffness: 125, damping: 20 }}
              className="absolute bottom-28 left-1/2 z-40 flex flex-row gap-4 items-center justify-center w-full max-w-[280px] sm:max-w-xs px-4 pointer-events-auto"
            >
              {/* Accept Proposal Button */}
              <button
                onClick={handleAcceptProposal}
                style={{ transform: `scale(${1 + Math.min(proposal.rejectionCount * 0.16, 1.2)})` }}
                className="cursor-pointer flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border border-emerald-400/20 text-white font-extrabold text-[11px] uppercase tracking-widest py-3 px-5 rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.35)] active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                Accept 💖
              </button>

              {/* Reject Proposal Button */}
              <button
                onClick={handleRejectProposal}
                style={{ transform: `scale(${Math.max(1 - proposal.rejectionCount * 0.16, 0.45)})` }}
                className="cursor-pointer flex-1 bg-slate-900/90 hover:bg-neutral-800 border border-white/10 text-neutral-200 font-extrabold text-[10px] uppercase tracking-widest py-3 px-4 rounded-full shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                {proposal.rejectionCount === 0 && "Reject 😢"}
                {proposal.rejectionCount === 1 && "Really? 🥺"}
                {proposal.rejectionCount === 2 && "Double check? 💔"}
                {proposal.rejectionCount === 3 && "Think again! 😭"}
                {proposal.rejectionCount === 4 && "Try yes? 🤪"}
                {proposal.rejectionCount === 5 && "Pretty Please? 👉👈"}
                {proposal.rejectionCount === 6 && "No way! 🚫"}
                {proposal.rejectionCount >= 7 && "Locked! 🔒"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic floating hearts if proposal is accepted */}
        {proposal.state === 'accepted' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
            {[...Array(16)].map((_, idx) => {
              const startX = 40 + Math.random() * 20;
              const pathX1 = 30 + Math.random() * 40;
              const pathX2 = 10 + Math.random() * 80;
              return (
                <motion.div
                  key={`accepted-heart-${idx}`}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.5, 
                    x: `${startX}%`, 
                    y: '75%' 
                  }}
                  animate={{ 
                    opacity: [0, 1, 1, 0], 
                    scale: [0.5, 1.5, 1], 
                    x: [
                      `${startX}%`,
                      `${pathX1}%`, 
                      `${pathX2}%`
                    ],
                    y: '-10%' 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3 + Math.random() * 2.5, 
                    delay: idx * 0.2 
                  }}
                  className="absolute text-rose-500 text-3xl"
                >
                  ❤️
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Dynamic visual instruction box for manual scroll onboarding */}
        <AnimatePresence>
          {scrollProgress < 0.05 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-28 w-fit bg-slate-900/80 backdrop-blur-xs py-1.5 px-4 rounded-full border border-white/5 shadow-xs flex items-center gap-2.5 z-25 text-[11px] font-bold text-neutral-300 uppercase tracking-wider"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Scroll down or toggle autoplay to walk</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LyricLine {
  text: string;
  start: number; // in seconds
  end: number;   // in seconds
}

export const SONG_LYRICS: LyricLine[] = [
  { start: 0, end: 10, text: "Pogayila andha pulla Poonu maari" },
  { start: 11, end: 13, text: "Bokkunu sirikayila Muthumaari" },
  { start: 14, end: 22, text: "Poda ava maari Yaaru poliva yaaru poliva Boomiyila kaadhal poo maari" },
  { start: 23, end: 29, text: "Kathiri veyilu Utchiyila veesa Appadi kulirum Andha pull pesa" },
  { start: 30, end: 37, text: "Saarayathil yedhu bodha Andha pulla paatha Sattunuthaan maarum paadha Thaana thannanaanae" },
  { start: 38, end: 48, text: "Munnaala naan kaama raasu Andha pullayaala Ipo naanum dhevadhaasu Thaana thananana naanae" }
];

export class RomanticSynthSong {
  private ctx: AudioContext | null = null;
  private intervalId: any = null;
  private currentBeat = 0;
  private isPlaying = false;
  private gainNode: GainNode | null = null;

  // Romantic G-Major 4-chord progression
  // G - D - Em - C
  private chords = [
    [98.00, 146.83, 196.00, 246.94],  // G3, D4, G4, B4
    [73.42, 110.00, 146.83, 220.00],  // D3, A3, D4, F#4
    [82.41, 130.81, 164.81, 246.94],  // E3, C4, E4, G4 (Em vibe using nice notes)
    [65.41, 130.81, 196.00, 261.63],  // C3, C4, G4, C5
  ];

  private melodyNotes = [
    293.66, 329.63, 392.00, 440.00, 493.88, 587.33  // D4, E4, G4, A4, B4, D5 (pure G Pentatonic)
  ];

  constructor() {}

  public start(soundEnabled: boolean) {
    if (this.isPlaying) return;
    if (!soundEnabled) return;

    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.gainNode = this.ctx.createGain();
      // Set very gentle, warm background atmospheric volume
      this.gainNode.gain.setValueAtTime(0.06, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      this.isPlaying = true;
      this.currentBeat = 0;

      // Romantic ballad tempo: 110 BPM (approx 540ms per beat)
      this.intervalId = setInterval(() => this.playBeat(), 540);
    } catch (e) {
      console.warn("Romantic synth engine failed to start", e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }

  private playBeat() {
    if (!this.ctx || !this.gainNode) return;
    const now = this.ctx.currentTime;

    const chordIndex = Math.floor(this.currentBeat / 8) % this.chords.length;
    const chordNotes = this.chords[chordIndex];

    // 1. Play warm electric bass on every 1st and 5th beat of a chord measure
    if (this.currentBeat % 4 === 0) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      
      bassOsc.type = 'sine';
      // play the root note very low
      bassOsc.frequency.setValueAtTime(chordNotes[0], now);
      
      bassGain.gain.setValueAtTime(0.3, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      
      bassOsc.connect(bassGain);
      bassGain.connect(this.gainNode);
      bassOsc.start(now);
      bassOsc.stop(now + 1.2);
    }

    // 2. Play beautiful arpeggiating acoustic chords
    const arpIndex = this.currentBeat % 4;
    const chordNote = chordNotes[arpIndex];
    if (chordNote) {
      const chordOsc = this.ctx.createOscillator();
      const chordGain = this.ctx.createGain();

      chordOsc.type = 'triangle';
      chordOsc.frequency.setValueAtTime(chordNote, now);
      
      chordGain.gain.setValueAtTime(0.12, now);
      chordGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      chordOsc.connect(chordGain);
      chordGain.connect(this.gainNode);
      chordOsc.start(now);
      chordOsc.stop(now + 0.9);
    }

    // 3. Play a sparkling chime key on select steps for a beautiful background melody
    if (this.currentBeat % 2 === 1 || Math.random() > 0.6) {
      const melodyNote = this.melodyNotes[Math.floor(Math.random() * this.melodyNotes.length)];
      const synthOsc = this.ctx.createOscillator();
      const synthGain = this.ctx.createGain();

      synthOsc.type = 'sine';
      synthOsc.frequency.setValueAtTime(melodyNote, now);
      
      synthGain.gain.setValueAtTime(0.08, now);
      synthGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      synthOsc.connect(synthGain);
      synthGain.connect(this.gainNode);
      synthOsc.start(now);
      synthOsc.stop(now + 0.6);
    }

    this.currentBeat++;
  }
}

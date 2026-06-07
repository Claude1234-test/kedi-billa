/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CharacterState {
  x: number;          // Horizontal position as % of viewport (0 to 100)
  y: number;          // Vertical offset (for falling, kneeling, etc.)
  scaleX: number;     // 1 for facing right, -1 for facing left
  pose: 'walk' | 'stand' | 'turn-cute' | 'shy' | 'freeze' | 'drink' | 'faint' | 'kneel' | 'walk-back' | 'cry_river' | 'angry_temper' | 'puppy_plead' | 'cardboard_romance' | 'dramatic_faint' | 'sing_guitar' | 'bollywood_dance' | 'giant_ring' | 'romantic_hug';
  opacity: number;
}

export interface SceneConfig {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  startScroll: number; // Start relative scroll value (0 to 1)
  endScroll: number;   // End relative scroll value (0 to 1)
}

export type SceneId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface AppState {
  scrollProgress: number; // 0 to 1 representing total scroll progress
  currentSceneId: SceneId;
  sceneProgress: number;  // 0 to 1 scroll progress within current scene
  girl: CharacterState;
  boy: CharacterState;
  soundEnabled: boolean;
  autoScroll: boolean;
}

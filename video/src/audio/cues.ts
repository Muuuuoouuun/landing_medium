import {getShot} from '../script';
import {CHORES, CHORE_GAP, CHORE_START} from '../shots/chores-data';
import {BEAT, BPM, DURATION, FPS} from '../theme';

/**
 * Cue sheet for the soundtrack. Every sound effect is pinned to the frame where its picture event
 * happens, so `npm run audio` re-syncs the sound whenever shot timings in script.ts change.
 * Local frames below mirror the animation constants in each shot component.
 */
export type Cue = {
  /** Global frame of the sync point: the moment the picture lands, hits or starts moving. */
  frame: number;
  /** Synth name in audio/sfx.py. */
  sound: string;
  /** Linear gain relative to the sound's default level. */
  gain?: number;
  /** Stereo position, -1 (left) … 1 (right). */
  pan?: number;
  /** End position for sounds that travel across the stereo field. */
  panTo?: number;
  /** Musical pitch for tonal cues, e.g. "C#5". */
  pitch?: string;
  /** Frames the sound should span (risers, sweeps, rolls, typing). */
  length?: number;
  /** Deterministic variation index. */
  variant?: number;
};

const at = (shotId: string, local: number) => getShot(shotId).from + local;
/** Screen x (0–1920) to a gentle stereo position. */
const panX = (x: number) => Math.max(-0.8, Math.min(0.8, ((x - 960) / 960) * 0.8));

const s04 = getShot('S04');
const s11 = getShot('S11');
const steps = s11.marks ?? {v1: 4, v2: 20, v3: 40};
const logoFrame = getShot('S13').from;

export const CUES: Cue[] = [
  // S01 — clock spins in, chores ping in from where each card lands, time starts slipping.
  {frame: at('S01', 0), sound: 'clockSpin', length: 20},
  {frame: at('S01', 6), sound: 'textSwish', gain: 0.7},
  {frame: at('S01', 24), sound: 'textSwish', gain: 0.7},
  ...CHORES.map((chip, i) => ({
    frame: Math.round(at('S01', CHORE_START + i * CHORE_GAP)),
    sound: 'notify',
    pan: panX(chip.x),
    variant: i,
    gain: chip.urgent ? 1.1 : 0.9,
  })),
  {frame: at('S01', 30), sound: 'tickAccel', length: 30},
  {frame: at('S01', 34), sound: 'stressRumble', length: 26},

  // S02 — the chores bar stretches off screen.
  {frame: at('S02', 0), sound: 'textSwish', gain: 0.6},
  {frame: at('S02', 6), sound: 'barGrow', length: 16},
  {frame: at('S02', 17), sound: 'textSwish', gain: 0.6},
  {frame: at('S02', 22), sound: 'stretchRiser', length: 38},

  // S03 — the meeting window appears, its tiles topple one by one, then it drops away.
  {frame: at('S03', 0), sound: 'windowIn'},
  ...Array.from({length: 9}).map((_, i) => ({
    frame: Math.round(at('S03', 22 + i * 1.8)),
    sound: 'tileClack',
    pan: [-0.45, 0, 0.45][i % 3],
    variant: i,
  })),
  {frame: at('S03', 28), sound: 'windowDrop', length: 12},

  // S04 — strike-through, slot roll, and the brand hit on beat 9.
  {frame: at('S04', 0), sound: 'penStrike'},
  {frame: at('S04', (s04.hit ?? 20) - 10), sound: 'slotRoll', length: 10},
  {frame: at('S04', s04.hit ?? 20), sound: 'brandHit'},
  {frame: at('S04', (s04.hit ?? 20) + 6), sound: 'glint', pan: 0.3, panTo: 0.6},

  // ACT 3 — whips between cards (sync point = the cut), UI events inside each card.
  {frame: at('S05', 0), sound: 'whip', pan: 0.6, panTo: -0.6},
  {frame: at('S05', 8), sound: 'digitalTick', pan: 0.5},
  {frame: at('S05', 16), sound: 'digitalTick', pan: 0.5, variant: 1},
  {frame: at('S05', 17), sound: 'shutter', pan: 0.45},
  {frame: at('S05', 19), sound: 'pop', pan: 0.45, variant: 2},
  {frame: at('S05', 21), sound: 'check', pan: 0.4},

  {frame: at('S06', 0), sound: 'whip', pan: 0.6, panTo: -0.6},
  ...[1, 3.5, 6].map((local, i) => ({frame: Math.round(at('S06', local)), sound: 'pop', pan: 0.45, variant: i, gain: 0.7})),
  {frame: at('S06', 4), sound: 'zip', pan: 0.2, panTo: 0.6, length: 16},
  {frame: at('S06', 20), sound: 'flipLand', pan: 0.6},
  {frame: at('S06', 23), sound: 'check', pan: 0.6, variant: 1},

  {frame: at('S07', 0), sound: 'whip', pan: 0.6, panTo: -0.6},
  ...Array.from({length: 5}).map((_, i) => ({frame: at('S07', 1 + i * 2), sound: 'pop', pan: 0.45, variant: i, gain: 0.55})),
  ...Array.from({length: 5}).map((_, i) => ({frame: at('S07', 5 + i * 2), sound: 'tick', pan: 0.4, variant: i})),
  {frame: at('S07', 6), sound: 'dataCount', pan: 0.5, length: 24},

  // S08 — zoom out into hundreds of students; the music holds its breath before the drop.
  {frame: at('S08', 0), sound: 'whip', pan: 0.6, panTo: -0.6, gain: 0.8},
  {frame: at('S08', 0), sound: 'zoomOut', length: 34},
  {frame: at('S08', 2), sound: 'popRain', length: 32},

  // S09 — the drop: "AI" slams in, then the lecture is scanned and scored.
  {frame: at('S09', 0), sound: 'dropHit'},
  {frame: at('S09', 0), sound: 'glitch', length: 12},
  {frame: at('S09', 12), sound: 'whooshUp'},
  {frame: at('S09', 15), sound: 'panelIn'},
  {frame: at('S09', 20), sound: 'scan', pan: -0.7, panTo: 0.1, length: 30},
  ...[24, 30, 38].map((local, i) => ({frame: at('S09', local), sound: 'hudType', pan: [-0.6, -0.1, -0.3][i], variant: i})),
  ...Array.from({length: 5}).map((_, i) => ({frame: Math.round(at('S09', 26 + i * 3.5)), sound: 'dataBlip', pan: 0.55, variant: i})),
  {frame: at('S09', 48), sound: 'success', pan: 0.5},

  // S10 — one AI sweep sorts and checks the to-dos; the summary types itself.
  {frame: at('S10', 4), sound: 'sweepShimmer', pan: -0.7, panTo: 0.5, length: 13},
  {frame: at('S10', 6), sound: 'cardShuffle', pan: -0.3},
  {frame: at('S10', 16), sound: 'pop', pan: 0.3, variant: 3},
  ...Array.from({length: 4}).map((_, i) => ({frame: at('S10', 17 + i * 3), sound: 'tick', pan: -0.35, variant: i + 2})),
  {frame: at('S10', 17), sound: 'airyRise', length: 18},
  {frame: at('S10', 18), sound: 'typing', pan: 0.3, length: 16},

  // S11 — AI feedback flies in and the lecture climbs v1.0 → v2.0 → v3.0 (A major arpeggio).
  {frame: at('S11', steps.v1), sound: 'stepUp', pitch: 'A4', pan: -0.6, gain: 0.7},
  {frame: at('S11', 0), sound: 'pop', pan: -0.3, variant: 4},
  {frame: at('S11', steps.v2 - 12), sound: 'zip', pan: -0.3, panTo: 0, length: 12},
  {frame: at('S11', steps.v2), sound: 'stepUp', pitch: 'C#5', pan: 0},
  {frame: at('S11', steps.v2 + 2), sound: 'glint', pan: -0.1, panTo: 0.2, gain: 0.6},
  {frame: at('S11', steps.v2 + 6), sound: 'badge', pan: 0.1},
  {frame: at('S11', steps.v2 - 1), sound: 'pop', pan: 0.25, variant: 1},
  {frame: at('S11', steps.v3 - 12), sound: 'zip', pan: 0.25, panTo: 0.55, length: 12},
  {frame: at('S11', steps.v3), sound: 'stepUpBig', pitch: 'E5', pan: 0.55},
  {frame: at('S11', steps.v3), sound: 'sparkle', pan: 0.55, length: 18},
  {frame: at('S11', steps.v3 + 6), sound: 'badge', pan: 0.6, variant: 1},
  {frame: at('S11', steps.v3 + 6), sound: 'continueChime', pan: 0.75},
  {frame: at('S11', 54), sound: 'whooshOut'},

  // S12 + S13 — the clock rewinds to 22:00, then the logo lands on beat 28.
  {frame: at('S12', 0), sound: 'rewind', length: 16},
  {frame: at('S12', 8), sound: 'textSwish', gain: 0.5},
  {frame: at('S12', 17), sound: 'textSwish', gain: 0.5},
  {frame: logoFrame - 6, sound: 'liftWhoosh'},
  {frame: logoFrame, sound: 'logoHit'},
  {frame: logoFrame + 8, sound: 'glint', pan: -0.2, panTo: 0.4, gain: 0.8},
  {frame: logoFrame + 12, sound: 'ctaClick'},
];

/** Beat markers the score is built around (in beats from frame 0). */
export const MUSIC = {
  bpm: BPM,
  beatFrames: BEAT,
  /** Bass pulse enters with S02. */
  bassInBeat: getShot('S02').from / BEAT,
  /** S03's question: the music goes muffled, as if heard through a meeting call. */
  muffleBeat: getShot('S03').from / BEAT,
  /** S04 starts: everything stops except the slot roll and a reverse swell. */
  breakBeat: s04.from / BEAT,
  /** The slot lands: bright groove starts. */
  turnBeat: (s04.from + (s04.hit ?? 20)) / BEAT,
  /** The pre-drop gap during the S08 zoom-out. */
  preDropBeat: (getShot('S09').from - BEAT) / BEAT,
  /** "AI" drop. */
  dropBeat: (getShot('S09').from + (getShot('S09').hit ?? 0)) / BEAT,
  /** Upgrade steps on v2.0 / v3.0. */
  stepBeats: [at('S11', steps.v2) / BEAT, at('S11', steps.v3) / BEAT],
  /** Rewind into the callback line. */
  callbackBeat: getShot('S12').from / BEAT,
  /** Logo hit. */
  logoBeat: logoFrame / BEAT,
};

export const TIMELINE = {fps: FPS, durationInFrames: DURATION};

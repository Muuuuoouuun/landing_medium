"""The score: a 90 BPM cue composed around the picture's beat markers (cues.json -> music).

Arc
  intro    D minor, ticking clock, drone, pulse bass; goes muffled on S03's question
  break    everything stops, a reversed D major chord swells into the brand hit
  groove   D major tech-pop (D – A – Bm – G) with a bell hook, one chord change per feature card
  pre-drop riser, then half a beat of silence
  drop     "AI": four-on-the-floor, pumping pads, 16th arp (Bm – G – D – A)
  rewind   the drop is played backwards into the callback line
  callback soft Dsus2 pad and a few bell notes
  logo     open D add9 chord that rings out to the last frame
"""
from __future__ import annotations

import numpy as np
from pedalboard import Compressor, Pedalboard

from dsp import (
    SR, Track, bandpass, delay, drive, env_adsr, env_ar, env_exp, fades, fm_bell, glide, highpass, hz, lowpass,
    n_of, noise, pump, reverb, saw, sine, square, stereo, supersaw, sweep, time, widen,
)

CHORDS = {
    'Dm': ['D3', 'F3', 'A3', 'D4'],
    'Bbmaj7': ['Bb2', 'D3', 'F3', 'A3'],
    'Gm9': ['G2', 'Bb2', 'D3', 'A3'],
    'D': ['D3', 'F#3', 'A3', 'D4'],
    'A': ['A2', 'C#3', 'E3', 'A3'],
    'Bm': ['B2', 'D3', 'F#3', 'B3'],
    'G': ['G2', 'B2', 'D3', 'G3'],
    'Dsus2': ['D3', 'E3', 'A3', 'D4'],
    'Dadd9': ['D3', 'A3', 'D4', 'F#4', 'A4', 'E5'],
}
ROOTS = {'Dm': 'D2', 'Bbmaj7': 'Bb1', 'Gm9': 'G1', 'D': 'D2', 'A': 'A1', 'Bm': 'B1', 'G': 'G1', 'Dsus2': 'D2', 'Dadd9': 'D2'}
ARP_TONES = {
    'D': ['D5', 'F#5', 'A5', 'D6'],
    'A': ['C#5', 'E5', 'A5', 'C#6'],
    'Bm': ['B4', 'D5', 'F#5', 'B5'],
    'G': ['B4', 'D5', 'G5', 'B5'],
}


# ───────────────────────── instruments ─────────────────────────

def kick(vel: float = 1.0) -> np.ndarray:
    """Punchy kick that still reads on phone speakers: short 55 Hz body, a 150 Hz knock and a click."""
    s = 0.4
    n = n_of(s)
    t = time(n)
    f = 55 + (180 - 55) * np.exp(-t / 0.025)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16)
    knock = np.sin(2 * np.pi * 150 * t) * np.exp(-t / 0.03) * 0.45
    click = highpass(noise(s, 11), 2500) * np.exp(-t / 0.003) * 0.5
    return fades(drive((body * 0.8 + knock + click) * 1.2, 1.8) * vel, 0.0005, 0.02)


def clap(vel: float = 1.0, seed: int = 0) -> np.ndarray:
    s = 0.4
    n = n_of(s)
    out = np.zeros((2, n))
    for ch in range(2):
        x = np.zeros(n)
        for k, at in enumerate((0.0, 0.009, 0.018)):
            b = bandpass(noise(0.02, seed * 10 + ch * 3 + k), 900, 7000) * env_exp(n_of(0.02), 0.004)
            i = n_of(at)
            x[i: i + len(b)] += b
        tail = bandpass(noise(s, seed * 10 + ch + 50), 1000, 6000) * env_exp(n, 0.09)
        i = n_of(0.02)
        x[i:] += tail[: n - i] * 0.7
        out[ch] = x
    return fades(out * vel * 0.5, 0.0005, 0.03)


def snare(vel: float = 1.0, seed: int = 0) -> np.ndarray:
    s = 0.25
    n = n_of(s)
    x = bandpass(noise(s, 900 + seed), 1500, 8000) * env_exp(n, 0.1) + sine(190, s) * env_exp(n, 0.04) * 0.6
    return stereo(fades(x * vel * 0.4, 0.0005, 0.02))


_HAT_FREQS = (205.3, 304.4, 369.6, 522.7, 540.0, 800.0)


def hat(vel: float = 1.0, open_: bool = False, seed: int = 0) -> np.ndarray:
    s = 0.35 if open_ else 0.08
    n = n_of(s)
    metal = sum(square(f * 1.6, s) for f in _HAT_FREQS)
    x = bandpass(metal, 6500, 12000) * 0.6 + highpass(noise(s, 700 + seed), 8000) * 0.5
    x = highpass(x, 7000) * env_exp(n, 0.22 if open_ else 0.03)
    return fades(x * vel * 0.32, 0.0003, 0.01)


def crash(vel: float = 1.0, seconds: float = 2.4) -> np.ndarray:
    n = n_of(seconds)
    metal = sum(square(f * 2.3, seconds) for f in _HAT_FREQS)
    out = np.stack([
        highpass(noise(seconds, 41), 3500) * 0.7 + bandpass(metal, 4000, 11000) * 0.4,
        highpass(noise(seconds, 42), 3500) * 0.7 + bandpass(metal, 4200, 11500) * 0.4,
    ]) * env_ar(n, 0.003, 0.9)
    return fades(out * vel * 0.22, 0.0005, 0.2)


def bass_note(note: str, seconds: float, vel: float = 1.0, cutoff: float = 900) -> np.ndarray:
    f = hz(note)
    n = n_of(seconds)
    sub = sine(f, seconds)
    bright = lowpass(saw(f, seconds), cutoff * 2, 2)
    dark = lowpass(saw(f, seconds), cutoff * 0.5, 2)
    filt_env = env_exp(n, 0.1)
    tone = sub * 0.4 + (bright * filt_env + dark * (1 - filt_env)) * 0.6
    return fades(drive(tone * env_adsr(n, 0.004, 0.08, 0.75, 0.04), 1.6) * vel, 0.001, 0.01)


def pad_chord(notes: list[str], seconds: float, cutoff: float = 1800, attack: float = 0.3, release: float = 0.5, seed: int = 0) -> np.ndarray:
    total = seconds + release
    n = n_of(total)
    out = np.zeros((2, n))
    for k, note in enumerate(notes):
        out += supersaw(hz(note), total, voices=7, detune_cents=14, seed=seed * 31 + k)
    out = highpass(lowpass(out, cutoff, 2), 140, 1) / np.sqrt(len(notes))
    return fades(out * env_adsr(n, attack, 0.3, 0.85, release), 0.002, 0.05)


def pluck(note: str, seconds: float = 0.4, cutoff: float = 4200, vel: float = 1.0) -> np.ndarray:
    f = hz(note)
    n = n_of(seconds)
    raw = saw(f, seconds) * 0.6 + square(f, seconds, 0.3) * 0.4
    bright = lowpass(raw, cutoff, 2)
    dark = lowpass(raw, 420, 2)
    fe = env_exp(n, 0.07)
    return fades((bright * fe + dark * (1 - fe)) * env_ar(n, 0.002, 0.13) * vel, 0.0005, 0.03)


def bell_note(note: str, seconds: float = 1.2, vel: float = 1.0) -> np.ndarray:
    return fades(fm_bell(hz(note), seconds, ratio=3.5, index=1.8, decay=0.55) * vel, 0.0005, 0.05)


def tick_sound(high: bool) -> np.ndarray:
    s = 0.03
    n = n_of(s)
    tone = sine(3200 if high else 1900, s) * env_exp(n, 0.005)
    burst = bandpass(noise(s, 3 if high else 4), 2500, 8000) * env_exp(n, 0.003)
    return fades(tone * 0.7 + burst * 0.6, 0.0003, 0.005)


def riser(seconds: float, f0: float = 300, f1: float = 7000, seed: int = 0) -> np.ndarray:
    n = n_of(seconds)
    t = time(n)
    air = sweep(noise(seconds, seed), 'bandpass', glide(f0, f1, seconds), width_oct=1.0)
    tone = lowpass(saw(glide(110, 440, seconds), seconds), 2500) * 0.25
    env = (t / seconds) ** 2.2
    return widen(stereo(fades((air + tone) * env, 0.01, 0.02)), 0.5)


def reverse_chord(notes: list[str], seconds: float) -> np.ndarray:
    """A chord's reverb tail played backwards: swells into the next downbeat."""
    hitn = sum(pluck(nm, 0.5, 6000) for nm in notes) / len(notes)
    wet = reverb(stereo(hitn), mix=1.0, decay=2.4)
    seg = wet[:, : n_of(seconds)]
    rev = seg[:, ::-1]
    return rev / (np.max(np.abs(rev)) + 1e-9)


# ───────────────────────── score ─────────────────────────

class Score:
    def __init__(self, music: dict, total_s: float):
        self.m = music
        self.B = 60.0 / music['bpm']
        self.total = total_s
        pad_len = total_s + 4.0
        self.intro = Track(pad_len)
        self.drums = Track(pad_len)
        self.bass = Track(pad_len)
        self.pads = Track(pad_len)
        self.keys = Track(pad_len)
        self.fx = Track(pad_len)
        self.drop_bus = Track(pad_len)
        self.drop_drums = Track(pad_len)
        self.kicks: list[float] = []

    def t(self, beat: float) -> float:
        return beat * self.B

    # intro ------------------------------------------------------------
    def compose_intro(self):
        m = self.m
        b_bass, b_muffle, b_break = m['bassInBeat'], m['muffleBeat'], m['breakBeat']
        for k in range(int(b_break * 2)):
            self.intro.add(tick_sound(k % 2 == 0), self.t(k / 2), 0.16 if k % 2 == 0 else 0.11)
        drone_s = self.t(b_break) + 0.4
        n = n_of(drone_s)
        tt = time(n)
        drone = sine(hz('D2'), drone_s) * 0.35 + lowpass(saw(hz('D2'), drone_s), 420) * 0.55
        drone *= np.clip(tt / self.t(2), 0, 1) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.35 * tt))
        self.intro.add(stereo(fades(drone, 0.01, 0.3)), 0.0, 0.1)
        for chord, b0, b1 in (('Dm', 0, b_bass), ('Bbmaj7', b_bass, b_muffle), ('Gm9', b_muffle, b_break)):
            self.intro.add(pad_chord(CHORDS[chord], self.t(b1 - b0), cutoff=1200, attack=0.5 if b0 == 0 else 0.15, release=0.35, seed=b0), self.t(b0), 0.08)
        k = 0
        b = b_bass
        while b < b_break - 1e-6:
            root = ROOTS['Bbmaj7'] if b < b_muffle else ROOTS['Gm9']
            vel = 0.55 + 0.4 * (b - b_bass) / (b_break - b_bass)
            note = root if k % 4 != 3 else root[:-1] + str(int(root[-1]) + 1)
            self.intro.add(stereo(bass_note(note, self.B * 0.42, vel, 700)), self.t(b), 0.22)
            b += 0.5
            k += 1
        self.intro.add(riser(self.t(b_muffle - b_bass), 250, 5000, seed=5), self.t(b_bass), 0.035)
        # S03's question: everything sounds like it's coming through a meeting call.
        nbuf = self.intro.buf.shape[-1]
        tt = time(nbuf)
        cutoff = np.full(nbuf, 18000.0)
        a, z = self.t(b_muffle) - 0.08, self.t(b_muffle) + 0.18
        ramp = np.clip((tt - a) / (z - a), 0, 1)
        cutoff = 18000 * (380 / 18000) ** ramp
        self.intro.buf = sweep(self.intro.buf, 'lowpass', cutoff, block=128)
        # Hard stop at the break (short fade so nothing clicks).
        cut = n_of(self.t(b_break))
        fade = n_of(0.04)
        self.intro.buf[:, cut: cut + fade] *= np.linspace(1, 0, fade)
        self.intro.buf[:, cut + fade:] = 0

    # break ------------------------------------------------------------
    def compose_break(self):
        b_break, b_turn = self.m['breakBeat'], self.m['turnBeat']
        swell_s = self.t(b_turn - b_break)
        self.fx.add(reverse_chord(CHORDS['D'], swell_s), self.t(b_turn), 0.3, preroll_s=swell_s)
        rev_cym = crash(1.0, swell_s)[:, ::-1]
        self.fx.add(rev_cym, self.t(b_turn), 0.5, preroll_s=swell_s)

    # groove -----------------------------------------------------------
    def compose_groove(self):
        turn, pre = self.m['turnBeat'], self.m['preDropBeat']
        changes = [(turn, 'D'), (turn + 3, 'A'), (turn + 5, 'Bm'), (turn + 7, 'G')]
        self.drums.add(crash(1.0), self.t(turn), 0.5)
        for i, (b0, chord) in enumerate(changes):
            b1 = changes[i + 1][0] if i + 1 < len(changes) else pre + 0.5
            self.pads.add(pad_chord(CHORDS[chord], self.t(b1 - b0), cutoff=2600, attack=0.06, release=0.25, seed=40 + i), self.t(b0), 0.075)
            # Bass: 8ths on the root, octave pop on the last 8th of each beat pair.
            b = b0
            k = 0
            while b < min(b1, pre) - 1e-6:
                root = ROOTS[chord]
                note = root[:-1] + str(int(root[-1]) + 1) if k % 4 == 3 else root
                self.bass.add(stereo(bass_note(note, self.B * 0.45, 0.9, 1000)), self.t(b), 0.24)
                b += 0.5
                k += 1
            # Pluck arp on 8ths.
            tones = ARP_TONES[chord]
            b = b0
            k = 0
            while b < min(b1, pre) - 1e-6:
                note = tones[[0, 1, 2, 1, 3, 2, 1, 2][k % 8]]
                self.keys.add(delay(pluck(note, 0.35, 3800, 0.9), self.B * 0.75, feedback=0.35, mix=0.25), self.t(b), 0.05)
                b += 0.5
                k += 1
        # Bell hook, one phrase across the four feature cards.
        hook = [(0, 'F#5', 1), (1, 'A5', 0.5), (1.5, 'B5', 0.5), (2, 'A5', 1), (3, 'E5', 1), (4, 'C#5', 0.5), (4.5, 'E5', 0.5), (5, 'F#5', 1), (6, 'D5', 1), (7, 'B5', 1)]
        for off, note, length in hook:
            self.keys.add(delay(stereo(bell_note(note, 1.2, 1.0)), self.B * 0.75, feedback=0.3, mix=0.2), self.t(turn + off), 0.06)
        # Drums: 1, and-of-2, 3 kicks; claps on 2 and 4; 16th hats; open hat on the and-of-4.
        b = turn
        while b < pre - 1e-6:
            pos = (b - turn) % 4
            if pos in (0, 1.5, 2):
                self.drums.add(stereo(kick(1.0 if pos != 1.5 else 0.8)), self.t(b), 0.34)
                self.kicks.append(self.t(b))
            if pos in (1, 3):
                self.drums.add(clap(0.9, seed=int(b * 2)), self.t(b), 0.5)
            accent = {0.0: 0.45, 0.25: 0.22, 0.5: 0.75, 0.75: 0.3}[round((b - int(b)) * 4) / 4]
            self.drums.add(stereo(hat(accent, open_=(pos == 3.5), seed=int(b * 4))), self.t(b), 0.35)
            b += 0.25
        # Snare roll into the pre-drop, then a riser that stops half a beat before the drop.
        b = pre - 1
        while b < pre + 0.5 - 1e-6:
            prog = (b - (pre - 1)) / 1.5
            self.drums.add(snare(0.3 + 0.7 * prog, seed=int(b * 8)), self.t(b), 0.35)
            b += 0.125
        self.fx.add(riser(self.t(2.5), 300, 8000, seed=9), self.t(pre - 2), 0.08)

    # drop -------------------------------------------------------------
    def compose_drop(self):
        drop, cb = self.m['dropBeat'], self.m['callbackBeat']
        changes = [(drop, 'Bm'), (drop + 2, 'G'), (drop + 4, 'D'), (drop + 6, 'A')]
        bus = self.drop_bus
        drums = self.drop_drums
        drums.add(crash(1.2), self.t(drop), 0.55)
        drums.add(crash(0.8), self.t(drop + 4), 0.8)
        kicks = []
        for i, (b0, chord) in enumerate(changes):
            b1 = changes[i + 1][0] if i + 1 < len(changes) else cb
            bus.add(pad_chord([n[:-1] + str(int(n[-1]) + 1) for n in CHORDS[chord]], self.t(b1 - b0), cutoff=4200, attack=0.02, release=0.15, seed=70 + i), self.t(b0), 0.07)
            sub_len = self.t(b1 - b0)
            sub = sine(hz(ROOTS[chord]), sub_len) * env_adsr(n_of(sub_len), 0.01, 0.1, 0.9, 0.05)
            bus.add(stereo(fades(sub, 0.002, 0.02)), self.t(b0), 0.11)
            b = b0
            while b < b1 - 1e-6:
                root = ROOTS[chord]
                bus.add(stereo(bass_note(root[:-1] + str(int(root[-1]) + 1), self.B * 0.4, 0.9, 1400)), self.t(b + 0.5), 0.16)
                b += 1
            tones = ARP_TONES[chord]
            pattern = [0, 1, 2, 3, 2, 1, 2, 3]
            b = b0
            k = 0
            while b < b1 - 1e-6:
                note = tones[pattern[k % 8]]
                bus.add(delay(pluck(note, 0.25, 5200, 0.9 if k % 4 == 0 else 0.6), self.B * 0.75, feedback=0.3, mix=0.18), self.t(b), 0.045)
                b += 0.25
                k += 1
        b = drop
        while b < cb - 1e-6:
            pos = b - drop
            if abs(pos - round(pos)) < 1e-6:
                drums.add(stereo(kick(1.0)), self.t(b), 0.36)
                kicks.append(self.t(b))
                if int(round(pos)) % 2 == 1:
                    drums.add(clap(1.0, seed=int(b * 2) + 100), self.t(b), 0.5)
            frac = round((b - int(b)) * 4) / 4
            drums.add(stereo(hat({0.0: 0.4, 0.25: 0.25, 0.5: 0.8, 0.75: 0.3}[frac], open_=(frac == 0.5), seed=int(b * 4) + 500)), self.t(b), 0.3)
            b += 0.25
        for sb in self.m.get('stepBeats', []):
            drums.add(crash(0.5, 1.2), self.t(sb), 0.5)
        # Pads, bass and arp pump against the kick; the drums themselves stay punchy.
        bus.buf *= pump(bus.buf.shape[-1], kicks, depth=0.5, release=0.22)
        self.kicks += kicks
        # Hard stop where the rewind starts.
        cut = n_of(self.t(cb))
        fade = n_of(0.02)
        for track in (bus, drums):
            track.buf[:, cut: cut + fade] *= np.linspace(1, 0, fade)
            track.buf[:, cut + fade:] = 0

    # rewind + callback + logo --------------------------------------------
    def compose_ending(self, drop_mix: np.ndarray):
        cb, logo = self.m['callbackBeat'], self.m['logoBeat']
        # Rewind: the last second of the drop, backwards and sped up, sliding down in pitch.
        src = drop_mix[:, n_of(self.t(cb) - 1.0): n_of(self.t(cb))][:, ::-1]
        out_len = n_of(0.5)
        pos = np.cumsum(np.linspace(2.6, 1.4, out_len))
        pos = np.clip(pos, 0, src.shape[-1] - 1)
        rew = np.stack([np.interp(pos, np.arange(src.shape[-1]), src[c]) for c in range(2)])
        rew = sweep(rew, 'lowpass', glide(9000, 900, 0.5), block=128)
        self.fx.add(fades(rew, 0.01, 0.12), self.t(cb), 0.75)
        # Callback: a soft, open pad and a few bell notes.
        self.pads.add(pad_chord(CHORDS['Dsus2'], self.t(logo - cb) - 0.15, cutoff=1300, attack=0.35, release=0.4, seed=90), self.t(cb) + 0.15, 0.07)
        sub_len = self.t(logo - cb)
        self.bass.add(stereo(fades(sine(hz('D2'), sub_len) * env_adsr(n_of(sub_len), 0.3, 0.2, 0.8, 0.3), 0.01, 0.1)), self.t(cb), 0.07)
        for off, note in ((0.5, 'A4'), (1.0, 'D5'), (1.5, 'E5')):
            self.keys.add(stereo(bell_note(note, 1.4, 0.8)), self.t(cb + off), 0.04)
        # Logo: an open D add9 chord that rings to the last frame.
        ring = self.total - self.t(logo) + 0.5
        self.pads.add(pad_chord(CHORDS['Dadd9'], ring, cutoff=5200, attack=0.01, release=0.6, seed=99) * env_exp(n_of(ring + 0.6), 1.1), self.t(logo), 0.11)
        for note in ('D5', 'F#5', 'A5'):
            self.keys.add(stereo(bell_note(note, ring, 0.9)), self.t(logo), 0.05)
        self.bass.add(stereo(fades(sine(hz('D2'), ring) * env_exp(n_of(ring), 0.9), 0.003, 0.2)), self.t(logo), 0.15)
        self.drums.add(stereo(kick(1.0)), self.t(logo), 0.4)
        self.drums.add(crash(1.0, 3.0), self.t(logo), 0.8)

    # render -------------------------------------------------------------
    def render(self) -> np.ndarray:
        self.compose_intro()
        self.compose_break()
        self.compose_groove()
        self.compose_drop()
        pre_n = self.drums.buf.shape[-1]
        groove_pump = pump(pre_n, [k for k in self.kicks if k < self.t(self.m['dropBeat'])], depth=0.35, release=0.2)
        self.pads.buf *= groove_pump
        self.bass.buf *= groove_pump
        self.keys.buf *= 0.6 + 0.4 * groove_pump
        drop_mix = self.drop_bus.buf + self.drop_drums.buf
        self.compose_ending(drop_mix)

        dry = self.intro.buf + self.drums.buf + self.bass.buf + self.pads.buf + self.keys.buf + self.fx.buf + drop_mix
        send = self.pads.buf * 0.6 + self.keys.buf * 0.8 + self.drop_bus.buf * 0.15
        wet = reverb(send, mix=1.0, decay=2.4, damp=7000)[:, : dry.shape[-1]] - send
        mix = highpass(dry + wet * 0.2, 28, 2)
        glue = Pedalboard([Compressor(threshold_db=-20, ratio=2.2, attack_ms=8, release_ms=160)])
        mix = glue(mix.astype(np.float32), SR).astype(float)
        return mix

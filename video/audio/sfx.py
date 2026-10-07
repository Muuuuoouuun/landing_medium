"""Synthesized sound effects. Each one takes a cue and returns (stereo sound, preroll seconds).

The preroll is how much of the sound plays before the cue's sync frame (e.g. a reverse swell that
peaks exactly when the picture hits). Pitches stay inside D major / D minor so effects sit in the score.
"""
from __future__ import annotations

import numpy as np

from dsp import (
    bandpass, drive, env_ar, env_exp, env_swell, fades, fm_bell, glide, highpass, hz, lowpass,
    n_of, noise, pan, reverb, rng, saw, sine, square, stereo, sweep, time, widen,
)

FPS = 30


def _length_s(cue: dict, default_frames: float) -> float:
    return (cue.get('length') or default_frames) / FPS


def _place(mono: np.ndarray, cue: dict, default_pan: float = 0.0) -> np.ndarray:
    """Pan a mono sound, travelling from `pan` to `panTo` when both are given."""
    p0 = cue.get('pan', default_pan)
    p1 = cue.get('panTo')
    if p1 is None:
        return pan(mono, p0)
    return pan(mono, np.linspace(p0, p1, mono.shape[-1]))


def _click(seconds: float = 0.012, hi: float = 7000, lo: float = 2200, tone: float = 3400, seed: int = 0) -> np.ndarray:
    n = n_of(seconds)
    burst = bandpass(noise(seconds, seed), lo, hi) * env_exp(n, 0.0025)
    ping = sine(tone, seconds) * env_exp(n, 0.004) * 0.5
    return fades(burst * 1.6 + ping, 0.0003, 0.002)


def _whoosh(seconds: float, f0: float, f1: float, peak_at: float = 0.6, width: float = 1.2, seed: int = 1, f_mid: float | None = None) -> np.ndarray:
    n = n_of(seconds)
    src = noise(seconds, seed, 'pink')
    if f_mid is None:
        freqs = glide(f0, f1, seconds)
    else:
        k = int(n * peak_at)
        freqs = np.concatenate([f0 * (f_mid / f0) ** np.linspace(0, 1, k), f_mid * (f1 / f_mid) ** np.linspace(0, 1, n - k)])
    return fades(sweep(src, 'bandpass', freqs, width_oct=width) * env_swell(n, peak_at, 1.6), 0.002, 0.02)


def _bell(note, seconds: float = 0.6, decay: float = 0.35, bright: float = 0.35) -> np.ndarray:
    f = hz(note)
    n = n_of(seconds)
    t = time(n)
    tone = np.sin(2 * np.pi * f * t) + bright * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / (decay * 0.3))
    return fades(tone * env_ar(n, 0.002, decay), 0.0005, 0.02)


def _pop(f0: float, seconds: float = 0.09) -> np.ndarray:
    n = n_of(seconds)
    body = sine(glide(f0, f0 * 0.55, seconds), seconds) * env_exp(n, 0.035)
    return fades(body + _pad_to(_click(0.006, 9000, 3000, f0 * 2.2), n) * 0.25, 0.0005, 0.01)


def _pad_to(x: np.ndarray, n: int) -> np.ndarray:
    return np.pad(x, (0, max(0, n - len(x))))[:n]


def _sub_boom(f0: float, f1: float, seconds: float, tau: float, amount: float = 2.0) -> np.ndarray:
    n = n_of(seconds)
    return drive(sine(glide(f0, f1, 0.35), seconds) * env_ar(n, 0.002, tau), amount)


def _reverse_swell(seconds: float, seed: int, lo: float = 400, hi: float = 9000, decay: float = 1.8) -> np.ndarray:
    """Reversed reverb tail of a noise burst: a crescendo that lands on the cue."""
    burst = bandpass(noise(0.06, seed), lo, hi) * env_exp(n_of(0.06), 0.02)
    tail = reverb(burst, mix=1.0, decay=decay)[:, : n_of(seconds)]
    rev = tail[:, ::-1]
    return rev / (np.max(np.abs(rev)) + 1e-9)


# ───────────────────────── ACT 1 · before ─────────────────────────

def clockSpin(cue):
    dur = _length_s(cue, 20)
    track = np.zeros(n_of(dur + 0.08))
    t = 0.0
    k = 0
    while t < dur - 0.02:
        rate = 46 * (7 / 46) ** (t / dur)
        c = _click(0.01, 7500, 2600, 3200 + 300 * (k % 2), seed=k)
        i = n_of(t)
        track[i: i + len(c)] += c[: len(track) - i] * (0.55 + 0.45 * (1 - t / dur))
        t += 1 / rate
        k += 1
    clack = _click(0.03, 4500, 900, 1250, seed=99) + sine(310, 0.03) * env_exp(n_of(0.03), 0.01) * 0.6
    i = n_of(dur - 0.01)
    track[i: i + len(clack)] += clack[: len(track) - i] * 1.2
    return _place(track * 0.35, cue), 0.0


def textSwish(cue):
    s = 0.45
    n = n_of(s)
    l = sweep(noise(s, 11, 'pink'), 'bandpass', glide(1600, 5200, s), width_oct=1.4)
    r = sweep(noise(s, 12, 'pink'), 'bandpass', glide(1700, 5600, s), width_oct=1.4)
    env = env_swell(n, 0.25, 1.4)
    return np.stack([l, r]) * env * 0.05, 0.03


_NOTIFY = [('A5', 'D6'), ('C6', 'F6'), ('D6', 'G6'), ('F6', 'A6'), ('G6', 'C7')]


def notify(cue):
    a, b = _NOTIFY[cue.get('variant', 0) % len(_NOTIFY)]
    s = 0.42
    n = n_of(s)
    tone = np.zeros(n)
    for k, note in enumerate((a, b)):
        f = hz(note)
        seg = 0.32
        part = (np.sin(2 * np.pi * f * time(n_of(seg))) + 0.25 * np.sin(4 * np.pi * f * time(n_of(seg)))) * env_ar(n_of(seg), 0.002, 0.09)
        i = n_of(0.065 * k)
        tone[i: i + len(part)] += part[: n - i] * (0.8 if k == 0 else 1.0)
    tone = fades(tone, 0.0005, 0.03)
    return reverb(_place(tone * 0.13, cue), mix=0.18, decay=0.9), 0.0


def tickAccel(cue):
    dur = _length_s(cue, 30)
    track = np.zeros(n_of(dur + 0.05))
    t = 0.0
    k = 0
    while t < dur:
        interval = 0.17 * (0.035 / 0.17) ** (t / dur)
        c = _click(0.014, 6500, 1800, 2600 if k % 2 == 0 else 1800, seed=200 + k)
        i = n_of(t)
        track[i: i + len(c)] += c[: len(track) - i] * (0.45 + 0.55 * t / dur)
        t += interval
        k += 1
    return _place(track * 0.18, cue), 0.0


def stressRumble(cue):
    dur = _length_s(cue, 26)
    n = n_of(dur)
    t = time(n)
    body = sine(55, dur) * (0.75 + 0.25 * np.sin(2 * np.pi * 7 * t)) * 0.6 + lowpass(noise(dur, 21), 220, 2) * 0.6
    env = (t / dur) ** 1.6
    return stereo(fades(drive(body * env * 1.4, 1.8), 0.01, 0.06) * 0.22), 0.0


def barGrow(cue):
    dur = _length_s(cue, 16)
    n = n_of(dur)
    tone = sine(glide(520, 780, dur), dur) * env_swell(n, 0.7, 1.2)
    return _place(tone * 0.05, cue), 0.0


def stretchRiser(cue):
    dur = _length_s(cue, 38)
    n = n_of(dur)
    t = time(n)
    vib = 1 + (0.004 + 0.02 * t / dur) * np.sin(2 * np.pi * (5 + 6 * t / dur) * t)
    tone = saw(glide(170, 520, dur) * vib, dur)
    tone = sweep(tone, 'lowpass', glide(500, 3600, dur))
    air = sweep(noise(dur, 31), 'bandpass', glide(800, 6000, dur), width_oct=1.0) * 0.35
    env = (t / dur) ** 1.3
    return widen(stereo(fades((tone * 0.5 + air) * env, 0.01, 0.03) * 0.16), 0.4), 0.0


# ───────────────────────── ACT 2 · turn ─────────────────────────

def windowIn(cue):
    w = _whoosh(0.32, 400, 2600, peak_at=0.7, seed=41)
    pop = _pad_to(_pop(620, 0.08), n_of(0.32))
    out = w * 0.18 + np.roll(pop, n_of(0.22)) * 0.12
    return _place(out, cue), 0.12


def tileClack(cue):
    v = cue.get('variant', 0)
    s = 0.08
    n = n_of(s)
    f = 1150 * (1 + 0.035 * ((v * 7) % 5 - 2))
    tone = sine(f, s) * env_exp(n, 0.016)
    snap = bandpass(noise(s, 50 + v), 2000, 6500) * env_exp(n, 0.006)
    thock = sine(220, s) * env_exp(n, 0.025) * 0.6
    return _place(fades(tone * 0.5 + snap * 0.9 + thock, 0.0003, 0.01) * 0.16, cue), 0.0


def windowDrop(cue):
    dur = _length_s(cue, 12)
    w = _whoosh(dur, 2600, 260, peak_at=0.45, seed=61)
    thump = _pad_to(sine(glide(70, 42, 0.15), 0.15) * env_exp(n_of(0.15), 0.05), n_of(dur))
    return _place(w * 0.16 + np.roll(thump, n_of(dur * 0.8)) * 0.25, cue), 0.0


def penStrike(cue):
    s = 0.24
    n = n_of(s)
    grain = np.abs(lowpass(noise(s, 71), 70, 1))
    grain /= grain.max() + 1e-9
    scratch = bandpass(noise(s, 72), 2400, 7500) * (0.4 + 0.6 * grain) * env_ar(n, 0.01, 0.09)
    return _place(fades(scratch, 0.002, 0.02) * 0.2, {'pan': -0.3, 'panTo': 0.15}), 0.0


def slotRoll(cue):
    dur = _length_s(cue, 10)
    track = np.zeros(n_of(dur + 0.02))
    t = 0.0
    k = 0
    while t < dur - 0.01:
        rate = 60 * (16 / 60) ** (t / dur)
        c = _click(0.008, 6000, 1500, 2100 + 150 * (k % 3), seed=300 + k)
        i = n_of(t)
        track[i: i + len(c)] += c[: len(track) - i]
        t += 1 / rate
        k += 1
    whirr = bandpass(noise(dur + 0.02, 81), 600, 1700) * np.linspace(1, 0.2, len(track)) * 0.4
    return _place((track + whirr) * 0.24, cue), dur


def brandHit(cue):
    pre = 0.55
    swell = _reverse_swell(pre, 91, 300, 9000) * 0.32
    s = 2.0
    n = n_of(s)
    boom = _sub_boom(95, 42, s, 0.5, 2.6) * 0.55
    punch = lowpass(noise(s, 92), 5000) * env_exp(n, 0.045) * 0.55
    thud = sine(180, s) * env_exp(n, 0.07) * 0.5
    air = highpass(noise(s, 93), 3000) * env_ar(n, 0.003, 0.28) * 0.18
    hit = reverb(widen(stereo(boom + punch + thud) + np.stack([air, highpass(noise(s, 94), 3000) * env_ar(n, 0.003, 0.28) * 0.18]), 0.3), mix=0.18, decay=1.8)
    out = np.zeros((2, n_of(pre) + hit.shape[-1]))
    out[:, : swell.shape[-1]] += swell
    out[:, n_of(pre):] += hit
    return out * 0.46, pre


def glint(cue):
    s = 0.5
    n = n_of(s)
    tone = np.zeros(n)
    for k, (f0, f1) in enumerate([(2600, 4400), (3300, 5600), (4100, 7000), (5200, 8400)]):
        tone += sine(glide(f0, f1, s), s) * env_ar(n, 0.005 + 0.02 * k, 0.12) * (0.6 - 0.1 * k)
    air = sweep(noise(s, 101), 'bandpass', glide(5000, 10000, s), width_oct=0.8) * env_swell(n, 0.3, 1.2) * 0.5
    return reverb(_place(fades(tone * 0.6 + air, 0.002, 0.04) * 0.07, cue), mix=0.35, decay=1.3), 0.0


# ───────────────────────── ACT 3 · after ─────────────────────────

def whip(cue):
    s = 0.34
    w = _whoosh(s, 450, 700, peak_at=0.42, f_mid=3600, width=1.1, seed=111)
    return _place(w * 0.2, cue), s * 0.42


def digitalTick(cue):
    f = 1900 if cue.get('variant', 0) == 0 else 2350
    s = 0.06
    tone = sine(f, s) * env_exp(n_of(s), 0.012)
    return _place(fades(tone, 0.0005, 0.01) * 0.06, cue), 0.0


def shutter(cue):
    s = 0.16
    n = n_of(s)
    track = np.zeros(n)
    c1 = _click(0.012, 7500, 1500, 4200, seed=121)
    slap = bandpass(noise(0.04, 122), 300, 2200) * env_exp(n_of(0.04), 0.01)
    c2 = _click(0.012, 6500, 1300, 3600, seed=123) * 0.7
    for snd, at in ((c1, 0.0), (slap, 0.012), (c2, 0.055)):
        i = n_of(at)
        track[i: i + len(snd)] += snd[: n - i]
    return reverb(_place(track * 0.28, cue), mix=0.12, decay=0.4), 0.0


def pop(cue):
    f0 = [900, 1050, 1200, 1350, 760][cue.get('variant', 0) % 5]
    return reverb(_place(_pop(f0) * 0.13, cue), mix=0.12, decay=0.6), 0.0


def check(cue):
    notes = [('D6', 'A6'), ('E6', 'B6')][cue.get('variant', 0) % 2]
    s = 0.6
    n = n_of(s)
    tone = np.zeros(n)
    for k, note in enumerate(notes):
        b = _bell(note, s - 0.07 * k, decay=0.3)
        i = n_of(0.07 * k)
        tone[i: i + len(b)] += b[: n - i]
    return reverb(_place(tone * 0.085, cue), mix=0.25, decay=1.1), 0.0


def zip(cue):
    dur = _length_s(cue, 12)
    w = _whoosh(dur, 1300, 6200, peak_at=0.75, width=0.9, seed=131)
    return _place(w * 0.12, cue), 0.0


def flipLand(cue):
    s = 0.12
    n = n_of(s)
    track = np.zeros(n)
    for k, at in enumerate((0.0, 0.028)):
        f = bandpass(noise(0.03, 140 + k), 1000, 4200) * env_exp(n_of(0.03), 0.006)
        i = n_of(at)
        track[i: i + len(f)] += f[: n - i]
    thump = sine(glide(160, 90, s), s) * env_exp(n, 0.04) * 0.6
    return _place((track + thump) * 0.2, cue), 0.0


_TICKS = ['D6', 'E6', 'F#6', 'A6', 'B6', 'D7', 'E7']


def tick(cue):
    note = _TICKS[cue.get('variant', 0) % len(_TICKS)]
    s = 0.09
    tone = sine(hz(note), s) * env_exp(n_of(s), 0.025)
    return _place(fades(tone, 0.0004, 0.01) * 0.05, cue), 0.0


def dataCount(cue):
    dur = _length_s(cue, 24)
    track = np.zeros(n_of(dur + 0.03))
    k = 0
    t = 0.0
    while t < dur:
        f = 1400 * (2600 / 1400) ** (t / dur)
        b = sine(f, 0.02) * env_exp(n_of(0.02), 0.005)
        i = n_of(t)
        track[i: i + len(b)] += b[: len(track) - i] * (1 - 0.5 * t / dur)
        t += 1 / 28
        k += 1
    return _place(track * 0.035, cue), 0.0


def zoomOut(cue):
    dur = _length_s(cue, 34)
    n = n_of(dur)
    l = sweep(noise(dur, 151, 'pink'), 'bandpass', glide(6000, 380, dur), width_oct=1.3)
    r = sweep(noise(dur, 152, 'pink'), 'bandpass', glide(6300, 360, dur), width_oct=1.3)
    env = env_ar(n, 0.08, dur * 0.45)
    return np.stack([l, r]) * env * 0.07, 0.0


def popRain(cue):
    dur = _length_s(cue, 32)
    r = rng(161)
    out = np.zeros((2, n_of(dur + 0.05)))
    count = 70
    for k in range(count):
        t = dur * np.sqrt(r.random())
        f = r.uniform(1600, 3400)
        p = _pop(f, 0.03) * r.uniform(0.4, 1.0)
        snd = pan(p, r.uniform(-0.9, 0.9))
        i = n_of(t)
        m = min(snd.shape[-1], out.shape[-1] - i)
        out[:, i: i + m] += snd[:, :m]
    return out * 0.02, 0.0


# ───────────────────────── ACT 4 · AI ─────────────────────────

def dropHit(cue):
    pre = 0.28
    suck = _reverse_swell(pre, 171, 600, 10000, decay=1.2) * 0.22
    s = 2.6
    n = n_of(s)
    boom = _sub_boom(88, 38, s, 0.7, 3.0) * 0.6
    kick = drive(sine(glide(160, 55, 0.08), s) * env_exp(n, 0.12), 3.0) * 0.6
    t = time(n)
    metal = sum(np.sin(2 * np.pi * f * t) * w for f, w in ((220, 0.5), (347, 0.4), (512, 0.3), (739, 0.25))) * env_exp(n, 0.5) * 0.25
    crash_l = highpass(noise(s, 172), 1500) * env_ar(n, 0.003, 0.35) * 0.22
    crash_r = highpass(noise(s, 173), 1500) * env_ar(n, 0.003, 0.35) * 0.22
    hit = reverb(stereo(boom * 0.9 + kick + metal) + np.stack([crash_l, crash_r]), mix=0.2, decay=2.0)
    out = np.zeros((2, n_of(pre) + hit.shape[-1]))
    out[:, : suck.shape[-1]] += suck
    out[:, n_of(pre):] += hit
    return out * 0.45, pre


def glitch(cue):
    dur = _length_s(cue, 12)
    r = rng(181)
    out = np.zeros((2, n_of(dur)))
    t = 0.0
    while t < dur:
        seg = r.uniform(0.018, 0.04)
        kind = r.integers(0, 3)
        if kind == 0:
            x = square(r.uniform(180, 1300), seg) * 0.6
        elif kind == 1:
            x = noise(seg, int(r.integers(0, 10_000))) * 0.35
        else:
            x = np.zeros(n_of(seg))
        hold = int(r.integers(2, 12))
        x = np.repeat(x[::hold], hold)[: n_of(seg)]
        x = np.round(x * 6) / 6
        snd = pan(fades(x, 0.001, 0.002), r.choice([-0.8, 0.8, 0.0]))
        i = n_of(t)
        m = min(snd.shape[-1], out.shape[-1] - i)
        out[:, i: i + m] += snd[:, :m]
        t += seg
    out = highpass(out, 300)
    return out * np.linspace(1, 0.3, out.shape[-1]) * 0.1, 0.0


def whooshUp(cue):
    w = _whoosh(0.32, 400, 5200, peak_at=0.7, seed=191)
    return _place(w * 0.14, cue), 0.1


def panelIn(cue):
    w = _whoosh(0.26, 500, 2400, peak_at=0.65, seed=201)
    p = _pad_to(_pop(700, 0.08), w.shape[-1])
    return _place(w * 0.12 + np.roll(p, n_of(0.17)) * 0.1, cue), 0.1


def scan(cue):
    dur = _length_s(cue, 30)
    n = n_of(dur)
    t = time(n)
    carrier = sine(glide(600, 1300, dur), dur) * (0.6 + 0.4 * np.sin(2 * np.pi * 24 * t))
    hiss = sweep(noise(dur, 211), 'bandpass', glide(1500, 4200, dur), width_oct=0.7)
    blips = np.zeros(n)
    for k in range(int(dur * 12)):
        b = sine(2400 + 120 * (k % 4), 0.015) * env_exp(n_of(0.015), 0.004)
        i = n_of(k / 12)
        blips[i: i + len(b)] += b[: n - i]
    env = np.clip(np.minimum(t / 0.06, (dur - t) / 0.12), 0, 1)
    return _place((carrier * 0.35 + hiss * 0.5 + blips * 0.4) * env * 0.09, cue), 0.0


def hudType(cue):
    r = rng(220 + cue.get('variant', 0))
    s = 0.3
    n = n_of(s)
    track = np.zeros(n)
    for k in range(7):
        f = r.uniform(1800, 3200)
        b = sine(f, 0.014) * env_exp(n_of(0.014), 0.004)
        i = n_of(k * 0.036 + r.uniform(0, 0.008))
        track[i: i + len(b)] += b[: n - i]
    return _place(track * 0.06, cue), 0.0


_BLIPS = ['B5', 'D6', 'E6', 'F#6', 'A6']


def dataBlip(cue):
    note = _BLIPS[cue.get('variant', 0) % len(_BLIPS)]
    return reverb(_place(_bell(note, 0.25, 0.09, 0.2) * 0.07, cue), mix=0.2, decay=0.8), 0.0


def success(cue):
    s = 0.9
    n = n_of(s)
    tone = np.zeros(n)
    for k, note in enumerate(('D6', 'F#6', 'A6')):
        b = _bell(note, s - 0.06 * k, decay=0.35)
        i = n_of(0.06 * k)
        tone[i: i + len(b)] += b[: n - i] * (0.8 + 0.1 * k)
    return reverb(_place(tone * 0.08, cue), mix=0.3, decay=1.4), 0.0


def sweepShimmer(cue):
    dur = _length_s(cue, 13)
    n = n_of(dur)
    hiss = sweep(noise(dur, 231), 'bandpass', glide(5000, 10500, dur), width_oct=0.9)
    tone = sum(sine(glide(f, f * 2.4, dur), dur) * (0.5 - 0.1 * k) for k, f in enumerate((2000, 2600, 3300)))
    env = env_swell(n, 0.5, 1.3)
    return reverb(_place((hiss * 0.6 + tone * 0.4) * env * 0.08, cue), mix=0.3, decay=1.2), 0.0


def cardShuffle(cue):
    s = 0.3
    n = n_of(s)
    track = np.zeros(n)
    for k in range(4):
        w = bandpass(noise(0.07, 240 + k), 1000 + 200 * k, 5000) * env_swell(n_of(0.07), 0.3, 1.2)
        i = n_of(0.045 * k)
        track[i: i + len(w)] += w[: n - i]
    return _place(track * 0.1, cue), 0.0


def airyRise(cue):
    dur = _length_s(cue, 18)
    n = n_of(dur)
    breath = sweep(noise(dur, 251, 'pink'), 'bandpass', glide(800, 4200, dur), width_oct=1.2)
    voices = sine(glide(hz('A5'), hz('D6'), dur), dur) * 0.5 + sine(glide(hz('D6'), hz('F#6'), dur), dur) * 0.35
    env = env_swell(n, 0.55, 1.2)
    return reverb(widen(stereo((breath * 0.5 + voices * 0.3) * env * 0.07), 0.5), mix=0.35, decay=1.6), 0.0


def typing(cue):
    dur = _length_s(cue, 16)
    r = rng(261)
    track = np.zeros(n_of(dur + 0.05))
    t = 0.0
    while t < dur:
        key = bandpass(noise(0.02, int(r.integers(0, 10_000))), 1500, 5000) * env_exp(n_of(0.02), 0.004)
        thock = sine(r.uniform(180, 240), 0.03) * env_exp(n_of(0.03), 0.008) * 0.6
        snd = _pad_to(key, len(thock)) + thock
        i = n_of(t)
        track[i: i + len(snd)] += snd[: len(track) - i] * r.uniform(0.5, 1.0)
        t += r.uniform(0.028, 0.05)
    return _place(track * 0.12, cue), 0.0


def stepUp(cue, big: bool = False):
    note = cue.get('pitch', 'A4')
    f = hz(note)
    s = 1.6 if big else 1.2
    n = n_of(s)
    bell = fm_bell(f, s, ratio=3.5, index=2.4, decay=0.7 if big else 0.55) * 0.55
    octave = fm_bell(f * 2, s, ratio=2.0, index=1.2, decay=0.45) * 0.25
    thump = sine(glide(115, 60, 0.12), s) * env_exp(n, 0.07) * (0.7 if big else 0.45)
    body = _place(bell + octave + thump, cue)
    if big:
        # A fifth above, spread wide, for the final upgrade.
        body = body + widen(stereo(fm_bell(f * 1.5, s, ratio=3.0, index=1.0, decay=0.6) * 0.2), 0.6)
    out = reverb(body, mix=0.3, decay=1.8)
    if big:
        pre = 0.22
        rise = _whoosh(pre, 600, 4200, peak_at=0.9, seed=271) * 0.12
        full = np.zeros((2, n_of(pre) + out.shape[-1]))
        full[:, : rise.shape[-1]] += stereo(rise)
        full[:, n_of(pre):] += out
        return full * 0.22, pre
    return out * 0.2, 0.0


def stepUpBig(cue):
    return stepUp(cue, big=True)


def sparkle(cue):
    dur = _length_s(cue, 18)
    r = rng(281)
    out = np.zeros((2, n_of(dur + 0.4)))
    p0 = cue.get('pan', 0.0)
    for k in range(10):
        t = dur * (k / 10) ** 1.3
        f = r.uniform(3000, 7000)
        b = _bell(f, 0.35, 0.12, 0.3)
        snd = pan(b * r.uniform(0.5, 1.0), np.clip(p0 + r.uniform(-0.45, 0.45), -1, 1))
        i = n_of(t)
        m = min(snd.shape[-1], out.shape[-1] - i)
        out[:, i: i + m] += snd[:, :m]
    return reverb(out * 0.045, mix=0.4, decay=1.6), 0.0


def badge(cue):
    note = ['A6', 'B6'][cue.get('variant', 0) % 2]
    s = 0.3
    tone = _bell(note, s, 0.12, 0.3) + _pad_to(_pop(1300, 0.06), n_of(s)) * 0.4
    return _place(tone * 0.06, cue), 0.0


def continueChime(cue):
    s = 1.2
    n = n_of(s)
    tone = np.zeros(n)
    for k, note in enumerate(('C#6', 'E6', 'A6')):
        b = _bell(note, s - 0.09 * k, 0.4, 0.2)
        i = n_of(0.09 * k)
        tone[i: i + len(b)] += b[: n - i] * (1 - 0.15 * k)
    return reverb(_place(tone * 0.045, cue), mix=0.45, decay=2.0), 0.0


def whooshOut(cue):
    w = lowpass(_whoosh(0.3, 2000, 600, peak_at=0.4, seed=291), 3000)
    return _place(w * 0.12, cue), 0.05


# ───────────────────────── ACT 5 · ending ─────────────────────────

def rewind(cue):
    dur = _length_s(cue, 16)
    n = n_of(dur)
    track = np.zeros(n + n_of(0.08))
    t = 0.0
    k = 0
    while t < dur:
        chirp = sine(glide(2600, 650, 0.07), 0.07) * env_swell(n_of(0.07), 0.2, 1.0)
        i = n_of(t)
        track[i: i + len(chirp)] += chirp[: len(track) - i] * (0.6 + 0.4 * (k % 2))
        t += 0.075 * (0.55 ** (t / dur))
        k += 1
    warble = bandpass(noise(dur + 0.08, 301), 800, 3000) * (0.5 + 0.5 * np.sin(2 * np.pi * 31 * time(len(track))))
    return _place((track * 0.5 + warble * 0.25) * 0.12, cue), 0.0


def liftWhoosh(cue):
    w = _whoosh(0.35, 500, 2600, peak_at=0.6, seed=311)
    return _place(w * 0.1, cue), 0.1


def logoHit(cue):
    pre = 0.65
    swell = _reverse_swell(pre, 321, 500, 11000, decay=2.2) * 0.3
    s = 2.4
    n = n_of(s)
    boom = _sub_boom(72, 40, s, 0.7, 2.4) * 0.5
    punch = lowpass(noise(s, 322), 4000) * env_exp(n, 0.05) * 0.35
    t = time(n)
    shimmer = sum(np.sin(2 * np.pi * hz(note) * t) for note in ('D7', 'F#7', 'A7')) * env_ar(n, 0.01, 0.8) * 0.06
    crash = np.stack([highpass(noise(s, 323), 2500), highpass(noise(s, 324), 2500)]) * env_ar(n, 0.004, 0.6) * 0.14
    hit = reverb(stereo(boom + punch + shimmer) + crash, mix=0.32, decay=3.0)
    out = np.zeros((2, n_of(pre) + hit.shape[-1]))
    out[:, : swell.shape[-1]] += swell
    out[:, n_of(pre):] += hit
    return out * 0.55, pre


def ctaClick(cue):
    s = 0.08
    n = n_of(s)
    click = _pad_to(_click(0.01, 8000, 3000, 2600, seed=331), n)
    tone = sine(1200, s) * env_exp(n, 0.012) * 0.4
    thock = sine(160, s) * env_exp(n, 0.02) * 0.6
    return _place((click + tone + thock) * 0.16, cue), 0.0


SOUNDS = {
    fn.__name__: fn
    for fn in (
        clockSpin, textSwish, notify, tickAccel, stressRumble, barGrow, stretchRiser,
        windowIn, tileClack, windowDrop, penStrike, slotRoll, brandHit, glint,
        whip, digitalTick, shutter, pop, check, zip, flipLand, tick, dataCount, zoomOut, popRain,
        dropHit, glitch, whooshUp, panelIn, scan, hudType, dataBlip, success, sweepShimmer, cardShuffle,
        airyRise, typing, stepUp, stepUpBig, sparkle, badge, continueChime, whooshOut,
        rewind, liftWhoosh, logoHit, ctaClick,
    )
}

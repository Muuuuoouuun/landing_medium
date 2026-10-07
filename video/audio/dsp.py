"""Small DSP toolkit for the ClassIn soundtrack: oscillators, envelopes, filters, space and mixing.

Everything is plain numpy/scipy so the soundtrack is fully synthesized and reproducible (seeded noise).
Stereo signals are float arrays shaped (2, n); mono signals are shaped (n,).
"""
from __future__ import annotations

import re

import numpy as np
from scipy import signal

SR = 48000


def n_of(seconds: float) -> int:
    return max(1, int(round(seconds * SR)))


def time(n: int) -> np.ndarray:
    return np.arange(n) / SR


def rng(seed: int | str) -> np.random.Generator:
    if isinstance(seed, str):
        seed = sum((i + 1) * ord(c) for i, c in enumerate(seed))
    return np.random.default_rng(seed)


# ───────────────────────── pitch ─────────────────────────

_NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def hz(note: str | float) -> float:
    """'A4' -> 440.0, 'C#5', 'Bb2'. Numbers pass through."""
    if not isinstance(note, str):
        return float(note)
    m = re.fullmatch(r'([A-G])([#b]?)(-?\d)', note)
    if not m:
        raise ValueError(f'bad note {note}')
    semi = _NOTE[m.group(1)] + {'#': 1, 'b': -1, '': 0}[m.group(2)]
    midi = 12 * (int(m.group(3)) + 1) + semi
    return 440.0 * 2 ** ((midi - 69) / 12)


# ───────────────────────── oscillators ─────────────────────────

def _freq_array(freq, n: int) -> np.ndarray:
    if np.isscalar(freq):
        return np.full(n, float(freq))
    f = np.asarray(freq, dtype=float)
    if len(f) < n:
        f = np.concatenate([f, np.full(n - len(f), f[-1])])
    return f[:n]


def glide(f0: float, f1: float, seconds: float, curve: str = 'exp') -> np.ndarray:
    n = n_of(seconds)
    x = np.linspace(0, 1, n)
    if curve == 'exp':
        return f0 * (f1 / f0) ** x
    return f0 + (f1 - f0) * x


def sine(freq, seconds: float, phase0: float = 0.0) -> np.ndarray:
    n = n_of(seconds)
    f = _freq_array(freq, n)
    return np.sin(2 * np.pi * (phase0 + np.cumsum(f) / SR))


def saw(freq, seconds: float, phase0: float = 0.0) -> np.ndarray:
    """Band-limited sawtooth (polyBLEP)."""
    n = n_of(seconds)
    f = _freq_array(freq, n)
    ph = (phase0 + np.cumsum(f) / SR) % 1.0
    dt = np.clip(f / SR, 1e-9, 0.5)
    y = 2.0 * ph - 1.0
    m = ph < dt
    t = ph[m] / dt[m]
    y[m] -= t + t - t * t - 1.0
    m = ph > 1.0 - dt
    t = (ph[m] - 1.0) / dt[m]
    y[m] -= t * t + t + t + 1.0
    return y


def square(freq, seconds: float, pw: float = 0.5, phase0: float = 0.0) -> np.ndarray:
    """Band-limited pulse as the difference of two saws."""
    return 0.5 * (saw(freq, seconds, phase0) - saw(freq, seconds, phase0 + pw))


def supersaw(freq, seconds: float, voices: int = 7, detune_cents: float = 16.0, seed: int | str = 1) -> np.ndarray:
    """Detuned saw stack spread across the stereo field. Returns stereo."""
    r = rng(seed)
    n = n_of(seconds)
    out = np.zeros((2, n))
    cents = np.linspace(-1, 1, voices) * detune_cents
    pans = np.linspace(-0.85, 0.85, voices)
    f = _freq_array(freq, n)
    for c, p in zip(cents, pans):
        v = saw(f * 2 ** (c / 1200), seconds, phase0=r.random())
        out += pan(v, p)
    return out / np.sqrt(voices)


def fm_bell(freq: float, seconds: float, ratio: float = 3.5, index: float = 3.0, decay: float = 0.9) -> np.ndarray:
    """Two-operator FM bell: bright attack that mellows as it rings."""
    n = n_of(seconds)
    t = time(n)
    idx = index * np.exp(-t / (decay * 0.35))
    mod = np.sin(2 * np.pi * freq * ratio * t) * idx
    car = np.sin(2 * np.pi * freq * t + mod)
    return car * np.exp(-t / decay)


def noise(seconds: float, seed: int | str = 0, color: str = 'white') -> np.ndarray:
    n = n_of(seconds)
    x = rng(seed).standard_normal(n)
    if color == 'pink':
        spec = np.fft.rfft(x)
        f = np.fft.rfftfreq(n, 1 / SR)
        spec[1:] /= np.sqrt(f[1:])
        spec[0] = 0
        x = np.fft.irfft(spec, n)
        x /= np.std(x) + 1e-12
    return x


# ───────────────────────── envelopes ─────────────────────────

def env_exp(n: int, tau: float) -> np.ndarray:
    return np.exp(-time(n) / tau)


def env_ar(n: int, attack: float, tau: float, curve: float = 1.0) -> np.ndarray:
    """Attack (to 1) then exponential decay."""
    a = min(n, n_of(attack))
    e = np.empty(n)
    e[:a] = np.linspace(0, 1, a) ** curve
    e[a:] = np.exp(-time(n - a) / tau)
    return e


def env_adsr(n: int, a: float, d: float, s: float, r: float) -> np.ndarray:
    """ADSR where the release occupies the last `r` seconds of the sound."""
    an, dn, rn = n_of(a), n_of(d), n_of(r)
    hold = max(0, n - an - dn - rn)
    e = np.concatenate([
        np.linspace(0, 1, an, endpoint=False),
        np.linspace(1, s, dn, endpoint=False),
        np.full(hold, s),
        np.linspace(s, 0, rn),
    ])
    return np.pad(e, (0, max(0, n - len(e))))[:n]


def env_swell(n: int, peak_at: float = 0.6, power: float = 2.0) -> np.ndarray:
    """Rises to a peak at `peak_at` (0–1 of the length), then falls to zero."""
    x = np.linspace(0, 1, n)
    up = (x / peak_at) ** power
    down = ((1 - x) / (1 - peak_at)) ** 1.2
    return np.where(x < peak_at, up, down)


def fades(x: np.ndarray, fade_in: float = 0.002, fade_out: float = 0.01) -> np.ndarray:
    """Short cosine fades at both ends so nothing clicks."""
    x = x.copy()
    n = x.shape[-1]
    fi, fo = min(n, n_of(fade_in)), min(n, n_of(fade_out))
    if fi > 1:
        x[..., :fi] *= 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, fi))
    if fo > 1:
        x[..., n - fo:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, fo))
    return x


# ───────────────────────── filters ─────────────────────────

def _sos(kind: str, f, order: int):
    nyq = SR / 2
    if kind in ('lowpass', 'highpass'):
        f = float(np.clip(f, 15, nyq * 0.95))
    else:
        lo, hi = f
        lo = float(np.clip(lo, 15, nyq * 0.9))
        hi = float(np.clip(hi, lo * 1.05, nyq * 0.95))
        f = [lo, hi]
    return signal.butter(order, f, btype=kind, fs=SR, output='sos')


def lowpass(x: np.ndarray, f: float, order: int = 2) -> np.ndarray:
    return signal.sosfilt(_sos('lowpass', f, order), x, axis=-1)


def highpass(x: np.ndarray, f: float, order: int = 2) -> np.ndarray:
    return signal.sosfilt(_sos('highpass', f, order), x, axis=-1)


def bandpass(x: np.ndarray, lo: float, hi: float, order: int = 2) -> np.ndarray:
    return signal.sosfilt(_sos('bandpass', (lo, hi), order), x, axis=-1)


def sweep(x: np.ndarray, kind: str, freqs, width_oct: float = 1.0, order: int = 2, block: int = 64) -> np.ndarray:
    """Time-varying Butterworth filter: `freqs` is a cutoff (or band centre) per sample."""
    x = np.asarray(x, dtype=float)
    stereo = x.ndim == 2
    chans = x if stereo else x[None, :]
    n = chans.shape[-1]
    f = _freq_array(freqs, n)
    out = np.zeros_like(chans)
    for c in range(chans.shape[0]):
        zi = None
        for s in range(0, n, block):
            fc = f[s]
            if kind == 'bandpass':
                k = 2 ** (width_oct / 2)
                sos = _sos('bandpass', (fc / k, fc * k), order)
            else:
                sos = _sos(kind, fc, order)
            if zi is None:
                zi = np.zeros((sos.shape[0], 2))
            out[c, s:s + block], zi = signal.sosfilt(sos, chans[c, s:s + block], zi=zi)
    return out if stereo else out[0]


# ───────────────────────── space ─────────────────────────

def pan(mono: np.ndarray, p) -> np.ndarray:
    """Constant-power pan. `p` is a scalar or a per-sample array in [-1, 1]."""
    p = np.clip(p, -1, 1)
    theta = (p + 1) * np.pi / 4
    return np.stack([mono * np.cos(theta), mono * np.sin(theta)]) * np.sqrt(2)


def stereo(x: np.ndarray) -> np.ndarray:
    return x if x.ndim == 2 else np.stack([x, x])


def widen(x: np.ndarray, amount: float = 0.3) -> np.ndarray:
    """Mid/side widening."""
    x = stereo(x)
    mid = (x[0] + x[1]) / 2
    side = (x[0] - x[1]) / 2 * (1 + amount)
    return np.stack([mid + side, mid - side])


_IR_CACHE: dict[tuple, np.ndarray] = {}


def hall_ir(decay: float = 2.2, predelay: float = 0.018, damp: float = 6000.0, seed: int = 7) -> np.ndarray:
    """Synthetic stereo hall impulse response: decorrelated noise with an RT60 of `decay` seconds."""
    key = (decay, predelay, damp, seed)
    if key in _IR_CACHE:
        return _IR_CACHE[key]
    n = n_of(predelay + decay * 1.1)
    t = time(n)
    r = rng(seed)
    ir = r.standard_normal((2, n)) * np.exp(-6.91 * t / decay)
    # Darker as it decays: blend a low-passed copy in over time.
    dark = lowpass(ir, damp * 0.35, 1)
    mix = np.clip(t / (decay * 0.6), 0, 1)
    ir = ir * (1 - mix) + dark * mix
    ir = highpass(lowpass(ir, damp, 1), 160, 1)
    ir[:, : n_of(predelay)] = 0
    # A few early reflections.
    for k, (dt, g) in enumerate([(0.011, 0.5), (0.019, 0.35), (0.027, 0.3), (0.041, 0.22)]):
        i = n_of(predelay + dt)
        ir[k % 2, i] += g * 3
    ir /= np.sqrt(np.sum(ir ** 2) / 2)
    _IR_CACHE[key] = ir
    return ir


def reverb(x: np.ndarray, mix: float = 0.25, decay: float = 2.2, predelay: float = 0.018, damp: float = 6000.0, keep_tail: bool = True) -> np.ndarray:
    """Convolution reverb send: returns dry + wet * mix (length grows by the tail when keep_tail)."""
    x = stereo(x)
    ir = hall_ir(decay, predelay, damp)
    wet = np.stack([signal.fftconvolve(x[0], ir[0]), signal.fftconvolve(x[1], ir[1])])
    n = wet.shape[-1] if keep_tail else x.shape[-1]
    out = np.zeros((2, n))
    out[:, : x.shape[-1]] += x[:, :n]
    out += wet[:, :n] * mix
    return out


def delay(x: np.ndarray, seconds: float, feedback: float = 0.4, mix: float = 0.3, repeats: int = 5, pingpong: bool = True, damp: float = 5000.0) -> np.ndarray:
    """Tempo delay with darker repeats; ping-pong alternates the sides."""
    x = stereo(x)
    d = n_of(seconds)
    out = np.zeros((2, x.shape[-1] + d * repeats))
    out[:, : x.shape[-1]] += x
    echo = lowpass(x, damp, 1)
    for k in range(1, repeats + 1):
        g = mix * feedback ** (k - 1)
        e = echo[::-1] if (pingpong and k % 2) else echo
        out[:, k * d: k * d + x.shape[-1]] += e * g
        echo = lowpass(echo, damp, 1)
    return out


# ───────────────────────── dynamics & mixing ─────────────────────────

def drive(x: np.ndarray, amount: float = 1.0) -> np.ndarray:
    """tanh saturation, level-compensated."""
    return np.tanh(x * amount) / np.tanh(amount)


def db(gain: float) -> float:
    return 20 * np.log10(max(gain, 1e-12))


def from_db(d: float) -> float:
    return 10 ** (d / 20)


def pump(n: int, hits_s: list[float], depth: float = 0.5, attack: float = 0.004, release: float = 0.17) -> np.ndarray:
    """Sidechain gain curve: dips by `depth` on every hit and recovers over `release`."""
    duck = np.zeros(n)
    t = time(n)
    for h in hits_s:
        i = n_of(h) if h > 0 else 0
        if i >= n:
            continue
        seg = t[i:] - h
        shape = np.where(seg < attack, seg / attack, np.exp(-(seg - attack) / (release / 3)))
        duck[i:] = np.maximum(duck[i:], shape)
    return 1 - depth * duck


class Track:
    """A stereo bus that sounds are dropped onto at times in seconds."""

    def __init__(self, seconds: float):
        self.buf = np.zeros((2, n_of(seconds)))

    def add(self, sound: np.ndarray, at_s: float, gain: float = 1.0, preroll_s: float = 0.0) -> None:
        sound = stereo(sound)
        start = int(round((at_s - preroll_s) * SR))
        src0 = max(0, -start)
        dst0 = max(0, start)
        length = min(sound.shape[-1] - src0, self.buf.shape[-1] - dst0)
        if length > 0:
            self.buf[:, dst0: dst0 + length] += sound[:, src0: src0 + length] * gain


def limit(x: np.ndarray, ceiling_db: float = -1.2, lookahead: float = 0.005, release: float = 0.08) -> np.ndarray:
    """Transparent lookahead true-peak limiter (no makeup gain): peaks never exceed the ceiling."""
    from scipy.ndimage import minimum_filter1d, uniform_filter1d

    x = stereo(x)
    ceiling = 10 ** (ceiling_db / 20)
    # True-peak detection: look at a 4x oversampled copy so inter-sample peaks are caught too.
    up = signal.resample_poly(x, 4, 1, axis=-1)
    n = x.shape[-1]
    peak = np.max(np.abs(up[:, : n * 4]).reshape(2, n, 4), axis=(0, 2))
    need = np.minimum(1.0, ceiling / np.maximum(peak, 1e-12))
    la = max(1, n_of(lookahead))
    # Every value inside the averaging window already includes the peak, so smoothing never overshoots.
    floor = minimum_filter1d(need, size=2 * la + 1, mode='nearest')
    smooth = uniform_filter1d(floor, size=la, mode='nearest')
    coef = 1 - np.exp(-1 / (release * SR))
    gain = np.empty_like(smooth)
    g = 1.0
    for i, target in enumerate(smooth):
        g = target if target < g else g + (target - g) * coef
        gain[i] = g
    return x * gain


def shelf(x: np.ndarray, f0: float, gain_db: float, kind: str = 'low', slope: float = 0.8) -> np.ndarray:
    """RBJ-cookbook low/high shelf."""
    a = 10 ** (gain_db / 40)
    w0 = 2 * np.pi * f0 / SR
    cos, sin = np.cos(w0), np.sin(w0)
    alpha = sin / 2 * np.sqrt((a + 1 / a) * (1 / slope - 1) + 2)
    sq = 2 * np.sqrt(a) * alpha
    if kind == 'low':
        b = [a * ((a + 1) - (a - 1) * cos + sq), 2 * a * ((a - 1) - (a + 1) * cos), a * ((a + 1) - (a - 1) * cos - sq)]
        den = [(a + 1) + (a - 1) * cos + sq, -2 * ((a - 1) + (a + 1) * cos), (a + 1) + (a - 1) * cos - sq]
    else:
        b = [a * ((a + 1) + (a - 1) * cos + sq), -2 * a * ((a - 1) + (a + 1) * cos), a * ((a + 1) + (a - 1) * cos - sq)]
        den = [(a + 1) - (a - 1) * cos + sq, 2 * ((a - 1) - (a + 1) * cos), (a + 1) - (a - 1) * cos - sq]
    b = np.array(b) / den[0]
    den = np.array(den) / den[0]
    return signal.lfilter(b, den, x, axis=-1)

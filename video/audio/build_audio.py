"""Builds the soundtrack: score + cue-synced sound effects, mixed and mastered to -14 LUFS.

Usage (from video/):  npm run audio
Reads   audio/build/cues.json            (exported from src/audio/cues.ts)
Writes  public/audio/soundtrack.wav      (used by the Remotion composition)
        out/stems/music.wav, out/stems/sfx.wav  (pre-master stems at mix level, for editors)
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import pyloudnorm
import soundfile as sf
from pedalboard import Compressor, Pedalboard

sys.path.insert(0, str(Path(__file__).parent))
from dsp import SR, Track, highpass, limit, n_of, pump, shelf  # noqa: E402
from music import Score  # noqa: E402
from sfx import SOUNDS  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
TARGET_LUFS = -14.0
# True-peak ceiling (oversampled detection), a little under the usual -1 dBTP delivery spec.
CEILING_DB = -1.2
MUSIC_GAIN = 1.6
SFX_GAIN = 1.0
# Sounds that carry a big impact; the music ducks briefly under them.
IMPACTS = {'brandHit', 'dropHit', 'logoHit'}
# Mixing console: per-sound trims in dB, set from measuring each cue against the music under it.
TRIM_DB = {
    'notify': -4, 'tickAccel': -3, 'stressRumble': -4, 'panelIn': -4, 'whooshUp': -4, 'whooshOut': -5,
    'windowDrop': -3, 'tileClack': -3, 'penStrike': -10, 'clockSpin': -5, 'ctaClick': -3, 'textSwish': -2,
    'glint': -2, 'hudType': -2, 'dataBlip': -2, 'continueChime': -4, 'badge': -2,
    'stretchRiser': 5, 'barGrow': 4, 'slotRoll': 13, 'tick': 4, 'typing': 4, 'zip': 2, 'airyRise': 2,
    'check': 4, 'stepUp': 6, 'stepUpBig': 4, 'sweepShimmer': 2, 'pop': 2, 'flipLand': 3,
}


def main() -> None:
    data = json.loads((ROOT / 'audio' / 'build' / 'cues.json').read_text())
    fps = data['fps']
    total_s = data['durationInFrames'] / fps
    n_total = n_of(total_s)

    music = Score(data['music'], total_s).render()[:, :n_total]

    sfx = Track(total_s + 4)
    impact_times = []
    for cue in data['cues']:
        sound, preroll = SOUNDS[cue['sound']](cue)
        at = cue['frame'] / fps
        trim = 10 ** (TRIM_DB.get(cue['sound'], 0) / 20)
        sfx.add(sound, at, gain=cue.get('gain', 1.0) * trim, preroll_s=preroll)
        if cue['sound'] in IMPACTS:
            impact_times.append(at)
    sfx_buf = sfx.buf[:, :n_total]

    duck = pump(n_total, impact_times, depth=0.3, attack=0.01, release=0.5)
    music_bus = music * duck * MUSIC_GAIN
    sfx_bus = sfx_buf * SFX_GAIN
    # Master EQ: clear the sub-rumble phones can't play, tame the lows, a touch of air on top.
    mix = highpass(music_bus + sfx_bus, 32, 4)
    mix = shelf(mix, 110, -4.0, 'low')
    mix = shelf(mix, 8000, 1.5, 'high')

    glue = Pedalboard([Compressor(threshold_db=-18, ratio=2.0, attack_ms=12, release_ms=150)])
    mix = glue(mix.astype(np.float32), SR).astype(float)

    # Loudness-normalize, limit, and correct once more for what the limiter shaved off.
    meter = pyloudnorm.Meter(SR)
    gain = 10 ** ((TARGET_LUFS - meter.integrated_loudness(mix.T)) / 20)
    for _ in range(2):
        limited = limit(mix * gain, CEILING_DB)
        gain *= 10 ** ((TARGET_LUFS - meter.integrated_loudness(limited.T)) / 20)
    mix = limit(mix * gain, CEILING_DB)

    # Gentle fade on the last 0.35s so the reverb tail ends cleanly on the final frame.
    fade = n_of(0.35)
    mix[:, -fade:] *= np.cos(np.linspace(0, np.pi / 2, fade)) ** 2
    mix[:, : n_of(0.004)] *= np.linspace(0, 1, n_of(0.004))

    out = ROOT / 'public' / 'audio' / 'soundtrack.wav'
    out.parent.mkdir(parents=True, exist_ok=True)
    sf.write(out, mix.T, SR, subtype='PCM_16')

    stems = ROOT / 'out' / 'stems'
    stems.mkdir(parents=True, exist_ok=True)
    for name, bus in (('music', music_bus), ('sfx', sfx_bus)):
        sf.write(stems / f'{name}.wav', np.clip(bus * gain, -1, 1).T, SR, subtype='PCM_16')

    final = meter.integrated_loudness(mix.T)
    peak = 20 * np.log10(np.max(np.abs(mix)) + 1e-12)
    print(f'soundtrack: {total_s:.2f}s, {final:.1f} LUFS integrated, sample peak {peak:.2f} dBFS -> {out.relative_to(ROOT)}')
    print('section loudness (LUFS, 3s windows):')
    for start in np.arange(0, total_s - 0.01, 2.0):
        seg = mix[:, n_of(start): n_of(min(total_s, start + 3.0))]
        if seg.shape[-1] > n_of(0.5):
            print(f'  {start:4.1f}s  music {meter.integrated_loudness((music_bus * gain)[:, n_of(start): n_of(min(total_s, start + 3.0))].T):6.1f}'
                  f'  sfx {meter.integrated_loudness((sfx_bus * gain)[:, n_of(start): n_of(min(total_s, start + 3.0))].T):6.1f}'
                  f'  mix {meter.integrated_loudness(seg.T):6.1f}')


if __name__ == '__main__':
    main()

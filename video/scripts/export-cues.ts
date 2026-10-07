import {mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {CUES, MUSIC, TIMELINE} from '../src/audio/cues';

// Writes the cue sheet for the Python soundtrack builder (audio/build_audio.py).
const out = path.join(__dirname, '..', 'audio', 'build', 'cues.json');
mkdirSync(path.dirname(out), {recursive: true});
writeFileSync(out, JSON.stringify({...TIMELINE, music: MUSIC, cues: [...CUES].sort((a, b) => a.frame - b.frame)}, null, 2));
console.log(`Wrote ${CUES.length} cues to ${path.relative(process.cwd(), out)}`);

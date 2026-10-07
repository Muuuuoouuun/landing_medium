import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fonts are self-hosted so renders never depend on a font CDN being reachable.

// Variable font so kinetic shots can morph weight (45–920) frame by frame.
loadFont({
  family: 'Pretendard',
  url: staticFile('fonts/PretendardVariable.woff2'),
  weight: '45 920',
});

loadFont({family: 'JetBrains Mono', url: staticFile('fonts/jetbrains-mono-latin-400-normal.woff2'), weight: '400'});
loadFont({family: 'JetBrains Mono', url: staticFile('fonts/jetbrains-mono-latin-700-normal.woff2'), weight: '700'});

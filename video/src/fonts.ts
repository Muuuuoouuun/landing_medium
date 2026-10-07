import {loadFont} from '@remotion/fonts';
import {getStaticFiles, staticFile} from 'remotion';

// Fonts are self-hosted so renders never depend on a font CDN being reachable.

// Variable font so kinetic shots can morph weight (45–920) frame by frame.
loadFont({
  family: 'Pretendard',
  url: staticFile('fonts/PretendardVariable.woff2'),
  weight: '45 920',
});

loadFont({family: 'JetBrains Mono', url: staticFile('fonts/jetbrains-mono-latin-400-normal.woff2'), weight: '400'});
loadFont({family: 'JetBrains Mono', url: staticFile('fonts/jetbrains-mono-latin-700-normal.woff2'), weight: '700'});

// End-card wordmark. Gilroy is a commercial font, so it isn't bundled: drop a licensed file whose
// name contains "Gilroy" (e.g. public/fonts/Gilroy-ExtraBold.otf) and it is picked up automatically.
// Until then the free Plus Jakarta Sans ExtraBold stands in.
loadFont({family: 'Plus Jakarta Sans', url: staticFile('fonts/plus-jakarta-sans-latin-800-normal.woff2'), weight: '800'});

const gilroyFiles = getStaticFiles().filter((f) => /gilroy/i.test(f.name) && /\.(woff2?|otf|ttf)$/i.test(f.name));
const gilroy = [/extra-?bold/i, /black|heavy/i, /bold/i].map((re) => gilroyFiles.find((f) => re.test(f.name))).find(Boolean) ?? gilroyFiles[0];
if (gilroy) {
  loadFont({family: 'Gilroy', url: staticFile(gilroy.name), weight: '100 900'});
}

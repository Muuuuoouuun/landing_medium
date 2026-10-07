import {Config} from '@remotion/cli/config';
import fs from 'node:fs';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(16);

// Cloud containers ship a pre-installed headless shell; local machines let Remotion download its own.
const preinstalledShell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (fs.existsSync(preinstalledShell)) {
  Config.setBrowserExecutable(preinstalledShell);
}

import './fonts';
import {Composition} from 'remotion';
import {ClassIn20s} from './ClassIn20s';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => {
  return <Composition id="ClassIn20s" component={ClassIn20s} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />;
};

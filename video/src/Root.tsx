import './fonts';
import {Composition} from 'remotion';
import {ClassIn15s} from './ClassIn15s';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => {
  return <Composition id="ClassIn15s" component={ClassIn15s} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />;
};

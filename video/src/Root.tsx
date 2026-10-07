import './fonts';
import {Composition} from 'remotion';
import {Animatic} from './Animatic';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Animatic"
      component={Animatic}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};

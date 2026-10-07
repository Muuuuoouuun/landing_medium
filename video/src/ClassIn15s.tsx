import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Backdrop, FilmFinish, Flash} from './components/Atmosphere';
import {SHOTS, getShot} from './script';
import {AIEval} from './shots/AIEval';
import {AIManage} from './shots/AIManage';
import {Chores} from './shots/Chores';
import {EduTool} from './shots/EduTool';
import {AutoRecord, Makeup, Records} from './shots/Features';
import {Finale} from './shots/Finale';
import {MeetingTool} from './shots/MeetingTool';
import {MoreKids} from './shots/MoreKids';
import {Night} from './shots/Night';
import {Upgrade} from './shots/Upgrade';

const SHOT_COMPONENTS: Record<string, React.FC> = {
  S01: Night,
  S02: Chores,
  S03: MeetingTool,
  S04: EduTool,
  S05: AutoRecord,
  S06: Makeup,
  S07: Records,
  S08: MoreKids,
  S09: AIEval,
  S10: AIManage,
  S11: Upgrade,
  // S12 and S13 play as one continuous shot.
  S12: Finale,
};

export const ClassIn15s: React.FC = () => {
  const s04 = getShot('S04');
  const s09 = getShot('S09');
  const s13 = getShot('S13');

  return (
    <AbsoluteFill>
      <Backdrop />
      {SHOTS.map((shot) => {
        const Component = SHOT_COMPONENTS[shot.id];
        if (!Component) return null;
        const duration = shot.id === 'S12' ? shot.durationInFrames + s13.durationInFrames : shot.durationInFrames;
        return (
          <Sequence key={shot.id} from={shot.from} durationInFrames={duration} name={`${shot.id} ${shot.label ?? ''}`}>
            <Component />
          </Sequence>
        );
      })}
      <Flash at={s04.from + 13} peak={0.55} />
      <Flash at={s09.from} peak={0.92} hold={1} />
      <FilmFinish />
    </AbsoluteFill>
  );
};

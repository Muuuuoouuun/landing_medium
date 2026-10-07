import {BEAT} from './theme';

/**
 * Single source of truth for the 20s spot. SCRIPT.md is the human-readable version of this table;
 * every shot component reads its copy and timing from here, so copy edits happen in this file only.
 */
export type Act = 'BEFORE' | 'TURN' | 'AFTER' | 'AI' | 'ENDING';

export type Tone = 'ink' | 'red' | 'green' | 'ai' | 'brand';
/** Kinetic effect played on a segment after it is revealed; each one acts out the word's meaning. */
export type Fx = 'stretch' | 'float' | 'level';

export type Seg = {
  t: string;
  tone?: Tone;
  fx?: Fx;
  /** Slot-machine roll: the segment starts as `from` and rolls into `t`. */
  from?: string;
};

export type Shot = {
  id: string;
  act: Act;
  from: number;
  durationInFrames: number;
  /** Feature chip, e.g. "자동 녹화". */
  label?: string;
  index?: string;
  /** Clock shown in the shot, HH:MM. */
  clock?: string;
  /** Local frame of the shot's big impact (slot landing, drop). Flashes, backdrop and sound sync to it. */
  hit?: number;
  /** Named local frames that picture and sound both sync to (e.g. upgrade steps). */
  marks?: Record<string, number>;
  lines: Seg[][];
  sub?: string;
  cta?: string;
  visual: string;
  sfx: string;
};

/** Shot lengths in beats (90 BPM, 20 frames per beat). They add up to 30 beats = 20s. */
const PLAN: [string, number][] = [
  ['S01', 3],
  ['S02', 3],
  ['S03', 2],
  ['S04', 2],
  ['S05', 2],
  ['S06', 2],
  ['S07', 2],
  ['S08', 2],
  ['S09', 3],
  ['S10', 2],
  ['S11', 3],
  ['S12', 2],
  ['S13', 2],
];

const timing = (id: string) => {
  const index = PLAN.findIndex(([shotId]) => shotId === id);
  const beatsBefore = PLAN.slice(0, index).reduce((sum, [, beats]) => sum + beats, 0);
  return {from: beatsBefore * BEAT, durationInFrames: PLAN[index][1] * BEAT};
};

export const SHOTS: Shot[] = [
  {
    id: 'S01',
    act: 'BEFORE',
    ...timing('S01'),
    clock: '23:40',
    lines: [[{t: '수업은 끝났는데,'}], [{t: '하루가 '}, {t: '끝나지 않으시죠?', tone: 'red'}]],
    visual:
      '시계 23:40이 롤링 인. 두 번째 줄이 뜨는 순간 잡무 알림 카드(보강 일정, 녹화 업로드, 숙제 확인, 학부모 문자…)가 사방에서 쌓이고 시계 분 단위가 빨라짐. 카메라 푸시 인 + 셰이크 증가.',
    sfx: '초침 틱 → 알림음이 겹겹이 쌓임',
  },
  {
    id: 'S02',
    act: 'BEFORE',
    ...timing('S02'),
    lines: [[{t: '가르치는 시간보다,'}], [{t: '챙기는 시간이 '}, {t: '더 길죠?', tone: 'red', fx: 'stretch'}]],
    visual:
      '"가르치는 시간" 초록 막대는 짧게 멈추고, "챙기는 시간" 빨간 막대는 화면 밖까지 뻗어 나감. 카메라가 막대를 따라 패닝. "더 길죠?"는 글자가 옆으로 늘어남.',
    sfx: '막대가 늘어나는 상승음',
  },
  {
    id: 'S03',
    act: 'TURN',
    ...timing('S03'),
    lines: [[{t: '아직 '}, {t: '회의용', tone: 'red'}, {t: ' 툴로 수업하시나요?'}]],
    visual: '화상회의 창(3×3 타일, 음소거 아이콘, 나가기 버튼)이 질문과 함께 떠오른 뒤, 타일이 도미노처럼 쓰러지고 창 전체가 아래로 떨어짐.',
    sfx: '휘시 + 타일이 넘어가는 클릭음',
  },
  {
    id: 'S04',
    act: 'TURN',
    ...timing('S04'),
    // Lands exactly on beat 9 (6.0s), where the music turns bright.
    hit: 20,
    lines: [[{t: '교육', tone: 'green', from: '회의'}, {t: '용 툴, '}, {t: 'ClassIn', tone: 'brand'}, {t: '.'}]],
    visual: '"회의"에 취소선 → 슬롯머신처럼 회의·화상·채팅을 지나 "교육"에 착지. 초록 링이 퍼지며 화면 전체가 밝고 따뜻한 톤으로 전환. ClassIn 워드마크가 빛을 받으며 와이프 인.',
    sfx: '슬롯 회전 → 베이스 히트 ①',
  },
  {
    id: 'S05',
    act: 'AFTER',
    ...timing('S05'),
    label: '자동 녹화',
    index: '01',
    lines: [[{t: '녹화는'}], [{t: '저절로', tone: 'green'}, {t: ' 남고,'}]],
    visual: 'REC 점 맥동, 칠판에 판서가 그려지고 타이머 00:59:58 → 01:00:00. "수업 종료"와 동시에 "녹화 완료 · 바로 다시보기" 토스트.',
    sfx: '셔터 + 체크',
  },
  {
    id: 'S06',
    act: 'AFTER',
    ...timing('S06'),
    label: '보강 관리',
    index: '02',
    lines: [[{t: '보강은'}], [{t: '알아서', tone: 'green'}, {t: ' 챙겨지고,'}]],
    visual: '출석부에서 민준이만 "결석". 오늘 수업 영상 카드가 점선 경로를 따라 날아가 꽂히고, 태그가 "보강 완료"로 뒤집힘.',
    sfx: '휙 + 팝',
  },
  {
    id: 'S07',
    act: 'AFTER',
    ...timing('S07'),
    label: '상세한 관리',
    index: '03',
    lines: [[{t: '아이마다'}], [{t: '기록', tone: 'green'}, {t: '이 쌓이니까,'}]],
    visual: '학생별 출석·과제·참여·이해도 표가 줄줄이 쏟아지고 막대와 숫자가 채워짐.',
    sfx: '데이터 틱 연타',
  },
  {
    id: 'S08',
    act: 'AFTER',
    ...timing('S08'),
    label: '더 많은 아이들',
    index: '04',
    lines: [[{t: '더 많은 아이들', tone: 'green'}, {t: '을'}], [{t: '만나세요.'}]],
    visual: '학생 한 명의 타일에서 카메라가 끝없이 뒤로 빠지며 수백 명의 그리드가 됨. 마지막에 화이트로 번쩍.',
    sfx: '라이저 정점 → 순간 무음',
  },
  {
    id: 'S09',
    act: 'AI',
    ...timing('S09'),
    hit: 0,
    label: 'AI 강의평가',
    lines: [[{t: 'AI', tone: 'ai'}, {t: '가 내 수업을 평가하고,'}]],
    visual:
      '"AI" 두 글자가 화면을 채우며 슬램(색 분리 + 방사형 섬광). 이어 수업 음성 파형을 스캔 라인이 훑고 레이더 차트가 그려지며 지표 태그가 팝: 발화 비율 · 질문 · 학생 참여 · 집중 구간.',
    sfx: '드롭 (장르 전환) → 데이터 처리음',
  },
  {
    id: 'S10',
    act: 'AI',
    ...timing('S10'),
    label: 'AI 관리',
    lines: [[{t: '관리는 '}, {t: '가벼워지고,', tone: 'ai', fx: 'float'}]],
    visual: '흩어진 할 일 카드가 AI 스윕 한 번에 정렬되고 차례로 체크. AI 요약 말풍선이 타이핑됨. "가벼워지고"는 글자가 얇아지며 떠오름.',
    sfx: '정렬 슉슉 + 체크 틱',
  },
  {
    id: 'S11',
    act: 'AI',
    ...timing('S11'),
    label: '강의 업그레이드',
    // v2.0 and v3.0 land on beats 24 and 25.
    marks: {v1: 4, v2: 20, v3: 40},
    lines: [[{t: '내 강의는 계속 '}, {t: '업그레이드', tone: 'ai', fx: 'level'}, {t: '됩니다.'}]],
    visual:
      '계단처럼 오르는 성장 라인 위로 강의 카드가 v1.0 → v2.0 → v3.0 순서로 한 칸씩 올라섬. AI 피드백 칩("질문 타이밍", "예시 추가")이 날아와 꽂힐 때마다 카드가 업그레이드되고 점수 링이 차오름, 아래 막대가 솟고 "+14", "+11"이 튀어 오름. 마지막 v3.0 카드는 글로우와 함께 커지고, 점선이 다음 버전(v4.0)으로 이어짐. "업그레이드" 글자도 단계마다 더 굵어짐.',
    sfx: '피드백 칩 휙 → 업 스텝 2연타(음정 상승) → 반짝임',
  },
  {
    id: 'S12',
    act: 'ENDING',
    ...timing('S12'),
    clock: '22:00',
    lines: [[{t: '수업이 끝나면,'}], [{t: '하루도 끝납니다.', tone: 'green'}]],
    visual: '오프닝의 시계가 23:58에서 22:00으로 되감김. 오프닝 질문("하루가 끝나지 않으시죠?")에 대한 대답.',
    sfx: '리와인드 → 정적',
  },
  {
    id: 'S13',
    act: 'ENDING',
    ...timing('S13'),
    lines: [[{t: 'ClassIn', tone: 'brand'}]],
    sub: '1인 원장을 위한 교육용 수업 플랫폼',
    cta: '지금 무료 체험하기',
    visual: '문장이 위로 올라가고 ClassIn 워드마크가 빛 스윕과 함께 등장, 라이트 리크, CTA 버튼 팝.',
    sfx: '마지막 히트 ② + 잔향',
  },
];

export const getShot = (id: string): Shot => {
  const shot = SHOTS.find((s) => s.id === id);
  if (!shot) throw new Error(`Unknown shot ${id}`);
  return shot;
};

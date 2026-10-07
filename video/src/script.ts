import {BEAT} from './theme';

/**
 * Single source of truth for the 15s spot. SCRIPT.md is the human-readable version of this table;
 * the animatic and the final composition both read their timing from here.
 */
export type Act = 'PROBLEM' | 'REFRAME' | 'PROOF' | 'AI' | 'RESOLVE';

export type Shot = {
  id: string;
  act: Act;
  from: number;
  durationInFrames: number;
  /** Feature index shown as a large outline numeral (01–04). */
  index?: string;
  main: string;
  /** Words inside `main` rendered in the accent color. */
  accent?: string[];
  sub?: string;
  /** Background words for the task-storm shot. */
  storm?: string[];
  visual: string;
  motion: string;
  sfx: string;
};

const b = (beats: number) => beats * BEAT;

export const SHOTS: Shot[] = [
  {
    id: 'S01',
    act: 'PROBLEM',
    from: b(0),
    durationInFrames: b(2),
    main: '원장님의 하루,',
    visual: '완전한 블랙. 머리카락 굵기의 초침 한 줄이 화면 중앙을 360° 회전.',
    motion: '글자별 블러→선명 스태거 리빌, 자간이 넓게 시작해 조여듦.',
    sfx: '초침 틱. 저역 드론 페이드 인.',
  },
  {
    id: 'S02',
    act: 'PROBLEM',
    from: b(2),
    durationInFrames: b(1),
    main: '',
    storm: ['보강 일정', '녹화 업로드', '출결 체크', '숙제 확인', '상담 기록', '카톡 답장', '진도 정리', '학부모 문자'],
    visual: '잡무 단어들이 사방에서 2~3프레임 간격으로 꽂히며 겹겹이 쌓임. 코너의 디지털 시계 09:00 → 23:47 고속 롤링.',
    motion: '방향 랜덤 슬램 인 + 모션 블러, 노이즈 기반 카메라 셰이크가 점점 강해짐.',
    sfx: '틱 소리가 가속되며 라이저로 이어짐.',
  },
  {
    id: 'S03',
    act: 'PROBLEM',
    from: b(3),
    durationInFrames: b(2),
    main: '비효율로 새는 시간.',
    accent: ['비효율'],
    visual: '단어 더미가 중앙으로 빨려 들어가 "비효율"(레드) 한 단어로 압축. 이어 "로 새는 시간."이 타이핑.',
    motion: '"비효율" RGB 분리 글리치. 마지막 박자에 "시간" 글자가 모래처럼 아래로 흘러내려(새는 시간) 화면 밖으로 빠짐.',
    sfx: '글리치 버스트 → 서브 드롭.',
  },
  {
    id: 'S04',
    act: 'REFRAME',
    from: b(5),
    durationInFrames: b(2),
    main: '수업은 회의가 아닙니다.',
    accent: ['회의'],
    visual: '3×3 화상회의 타일 그리드(회색 아바타, 음소거 아이콘, "회의 나가기" 툴바)가 원근감 있게 떠 있음. 특정 서비스 로고는 쓰지 않음.',
    motion: '타일이 도미노처럼 순서대로 뒤로 넘어가며 사라지고 문장만 남음.',
    sfx: '휘시 + 타일이 넘어가는 클릭음 연타.',
  },
  {
    id: 'S05',
    act: 'REFRAME',
    from: b(7),
    durationInFrames: b(2),
    main: '교육용 툴, ClassIn.',
    accent: ['교육용', 'ClassIn'],
    visual: '"회의용"에 레드 취소선이 그어지고, 슬롯머신처럼 세로로 굴러 "교육용"(그린)에 착지. ClassIn 워드마크가 라이트 스윕과 함께 등장.',
    motion: '슬롯 롤 플립(오버슛 스프링), 그린 플래시 프레임 1장, 워드마크 마스크 와이프.',
    sfx: '슬롯 회전음 → 베이스 히트(첫 번째 큰 임팩트).',
  },
  {
    id: 'S06',
    act: 'PROOF',
    from: b(9),
    durationInFrames: b(2),
    index: '01',
    main: '자동 녹화',
    sub: '수업 끝, 녹화도 끝.',
    visual: '빨간 REC 점이 맥동, 타임코드 00:59:58 → 01:00:00. "녹화 완료 ✓" 칩이 튀어나오고 영상 카드가 라이브러리로 슬라이드.',
    motion: '좌측 아웃라인 숫자 01 마스크 리빌, 키워드 가변폰트 굵기 100→900 모프. 다음 카드로 휩팬(가로 모션 블러).',
    sfx: '셔터 클릭 + 체크 사운드.',
  },
  {
    id: 'S07',
    act: 'PROOF',
    from: b(11),
    durationInFrames: b(2),
    index: '02',
    main: '보강 관리',
    sub: '결석해도, 공백 없이.',
    visual: '학생 칩에 빨간 "결석" 태그. 녹화본 재생 카드가 곡선 경로를 따라 날아와 꽂히고 태그가 그린 "보강 완료"로 뒤집힘.',
    motion: '베지어 패스 이동(트레일 잔상), 태그 3D 플립. 휩팬 아웃.',
    sfx: '휙 + 팝.',
  },
  {
    id: 'S08',
    act: 'PROOF',
    from: b(13),
    durationInFrames: b(2),
    index: '03',
    main: '상세한 관리',
    sub: '한 명 한 명, 기록으로.',
    visual: '학생 행이 폭포처럼 쏟아지고 출석·과제·참여·이해도 바가 채워짐. 숫자 카운터 롤링.',
    motion: '행 스태거 캐스케이드, 바 이징 필, 숫자 롤러. 휩팬 아웃.',
    sfx: '데이터 틱 연타(하이햇과 싱크).',
  },
  {
    id: 'S09',
    act: 'PROOF',
    from: b(15),
    durationInFrames: b(2),
    index: '04',
    main: '더 많은 아이들',
    sub: '혼자서도, 충분히.',
    visual: '학생 타일 1개 → 4 → 16 → 64개. 카메라가 끝없이 뒤로 빠지며 그리드가 화면을 가득 메움.',
    motion: '무한 줌아웃(스케일 체인) + 그리드 셀 팝 인. 마지막 프레임에서 화이트로 번쩍.',
    sfx: '상승 라이저 정점 → 순간 무음(드롭 직전 숨 고르기).',
  },
  {
    id: 'S10',
    act: 'AI',
    from: b(17),
    durationInFrames: b(1),
    main: 'AI',
    accent: ['AI'],
    visual: '하드 컷 블랙. 화면을 꽉 채우는 "AI" 두 글자가 슬램.',
    motion: '크로매틱 애버레이션 + 스타버스트 섬광 1회, 강한 카메라 펀치 인.',
    sfx: '드롭. 비트 전환(하이브리드 트레일러 → 일렉트로닉).',
  },
  {
    id: 'S11',
    act: 'AI',
    from: b(18),
    durationInFrames: b(3),
    main: 'AI 강의평가',
    accent: ['AI'],
    sub: '내 수업을, 데이터로 본다.',
    visual: '수업 음성 파형이 흐르고 스캔 라인이 지나가며 HUD 태그가 팝: 발화 비율 · 질문 수 · 학생 참여 · 집중 구간. 레이더 차트가 그려짐.',
    motion: 'SVG 패스 드로잉(레이더/파형), HUD 태그 타이핑, 스캔 라인 글로우(그린→시안 그라디언트).',
    sfx: '데이터 처리음 + 스캔 스윕.',
  },
  {
    id: 'S12',
    act: 'AI',
    from: b(21),
    durationInFrames: b(2),
    main: 'AI 관리',
    accent: ['AI'],
    sub: '관리는 가볍게, 더 정확하게.',
    visual: '학생 카드들이 AI에 의해 자동 정렬되고, 카드마다 요약 리포트 문장이 자동으로 타이핑. 체크리스트가 스스로 체크됨.',
    motion: '레이아웃 셔플(FLIP 애니메이션), 하이라이트 스윕, 체크 스태거.',
    sfx: '정렬 슉슉 + 체크 틱.',
  },
  {
    id: 'S13',
    act: 'AI',
    from: b(23),
    durationInFrames: b(2),
    main: '내 강의, 계속 업그레이드.',
    accent: ['업그레이드'],
    visual: '버전 카운터 v1.0 → v2.0 → v3.0이 8분음표마다 갈아끼워지고, 뒤로 성장 곡선이 치솟음.',
    motion: '숫자 슬롯 롤, 버전이 오를 때마다 글자 굵기·크기 업. 곡선 패스 드로잉 + 끝점 글로우.',
    sfx: '업 스텝 3연타(음정 상승).',
  },
  {
    id: 'S14',
    act: 'RESOLVE',
    from: b(25),
    durationInFrames: b(2),
    main: '혼자 가르쳐도, 혼자 관리하지 않는다.',
    accent: ['혼자 관리하지 않는다'],
    visual: '앞서 나온 키워드(자동 녹화·보강 관리·상세한 관리·AI 강의평가·업그레이드)가 초고속 몽타주로 중앙에 수렴한 뒤 태그라인으로 정리.',
    motion: '스피드 램프 + 카메라 모션 블러, 단어 단위 리빌.',
    sfx: '리버스 심벌 → 정지.',
  },
  {
    id: 'S15',
    act: 'RESOLVE',
    from: b(27),
    durationInFrames: b(3),
    main: 'ClassIn',
    sub: '1인 원장을 위한 교육용 수업 플랫폼',
    visual: '태그라인이 위로 작아지며 올라가고 ClassIn 로고가 라이트 리크와 함께 등장. 하단 CTA 버튼 "지금 무료 체험하기".',
    motion: '로고 라이트 스윕, 라이트 리크 오버레이, CTA 스프링 팝.',
    sfx: '마지막 히트 + 잔향, 0.5초 무음으로 끝.',
  },
];

export const ACT_LABEL: Record<Act, string> = {
  PROBLEM: 'ACT 1 · 문제',
  REFRAME: 'ACT 2 · 전환',
  PROOF: 'ACT 3 · 증명',
  AI: 'ACT 4 · AI',
  RESOLVE: 'ACT 5 · 해답',
};

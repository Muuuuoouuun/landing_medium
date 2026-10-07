/** Chore notifications that pile up in S01. Shared by the shot and the soundtrack (pings are panned by x). */
export const CHORES: {text: string; x: number; y: number; r: number; urgent?: boolean}[] = [
  {text: '결석생 보강 일정', x: 230, y: 150, r: -5, urgent: true},
  {text: '녹화 파일 업로드', x: 1690, y: 170, r: 4},
  {text: '숙제 32건 확인', x: 190, y: 560, r: 3},
  {text: '학부모 문자 5통', x: 1730, y: 520, r: -4, urgent: true},
  {text: '출결 정리', x: 330, y: 930, r: -3},
  {text: '진도표 수정', x: 1610, y: 920, r: 5},
  {text: '상담 기록 작성', x: 760, y: 105, r: 2},
  {text: '카톡 답장 12건', x: 1180, y: 975, r: -2, urgent: true},
  {text: '보강 영상 링크 전송', x: 1210, y: 95, r: -3},
  {text: '시험지 채점', x: 700, y: 985, r: 3},
];

/** Local frame of the first chip, and frames between chips. */
export const CHORE_START = 26;
export const CHORE_GAP = 2.6;

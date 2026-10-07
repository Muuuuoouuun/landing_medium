# ClassIn 20s — 1인 원장 편 (Remotion)

대본: [SCRIPT.md](./SCRIPT.md) · 카피/타이밍 원본: `src/script.ts`

```bash
cd video
npm install
npm run studio     # 브라우저에서 미리보기, 타임라인 스크럽
npm run render     # out/classin-20s.mp4 (public/audio/soundtrack.wav 포함)
npm run typecheck

# 사운드를 다시 만들 때 (샷 타이밍을 바꿨다면 필수)
npm run audio:setup   # 처음 한 번: Python 가상환경 + numpy/scipy/pedalboard
npm run audio         # 큐 시트 내보내기 → BGM·효과음 합성 → -14 LUFS 마스터링
```

## 구조

```
src/
  script.ts          샷별 카피·타이밍 (카피 수정은 여기서)
  theme.ts           BPM(90), 컬러, 폰트, 카드 스타일
  ClassIn20s.tsx     메인 컴포지션: 배경 → 샷 시퀀스 → 플래시 → 그레인
  components/        KineticLine(글자 리빌·의미 이펙트), Roll(시계·슬롯), DirBlur(방향 모션블러), Atmosphere(배경·그레인)
  shots/             S01~S13 샷 컴포넌트
  audio/cues.ts      효과음 큐 시트: 화면 이벤트 프레임 + 음악 마커 (script.ts 타이밍에서 계산)
scripts/export-cues.ts  큐 시트 → audio/build/cues.json
audio/
  music.py           BGM 작곡 (90 BPM, 음악 마커 기준)
  sfx.py             효과음 47종 합성
  dsp.py             오실레이터·필터·리버브·리미터
  build_audio.py     믹스·마스터링 → public/audio/soundtrack.wav, out/stems/
```

- 폰트는 `public/fonts`에 포함되어 있어 렌더 시 외부 폰트 CDN에 의존하지 않습니다.
- 엔딩 ClassIn 워드마크는 Gilroy입니다. 유료 폰트라 포함하지 않았으니, 라이선스 파일(예: `Gilroy-ExtraBold.otf`)을 `public/fonts/`에 넣고 `npm run render`만 다시 하면 적용됩니다. 파일이 없으면 Plus Jakarta Sans ExtraBold로 대체됩니다.
- Remotion은 직원 4인 이상 회사가 상업적으로 쓰면 컴퍼니 라이선스가 필요합니다: https://remotion.dev/license

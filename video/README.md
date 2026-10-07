# ClassIn 20s — 1인 원장 편 (Remotion)

대본: [SCRIPT.md](./SCRIPT.md) · 카피/타이밍 원본: `src/script.ts`

```bash
cd video
npm install
npm run studio     # 브라우저에서 미리보기, 타임라인 스크럽
npm run render     # out/classin-20s.mp4
npm run typecheck
```

## 구조

```
src/
  script.ts          샷별 카피·타이밍 (카피 수정은 여기서)
  theme.ts           BPM(90), 컬러, 폰트, 카드 스타일
  ClassIn20s.tsx     메인 컴포지션: 배경 → 샷 시퀀스 → 플래시 → 그레인
  components/        KineticLine(글자 리빌·의미 이펙트), Roll(시계·슬롯), DirBlur(방향 모션블러), Atmosphere(배경·그레인)
  shots/             S01~S13 샷 컴포넌트
```

- 폰트는 `public/fonts`에 포함되어 있어 렌더 시 외부 폰트 CDN에 의존하지 않습니다.
- Remotion은 직원 4인 이상 회사가 상업적으로 쓰면 컴퍼니 라이선스가 필요합니다: https://remotion.dev/license

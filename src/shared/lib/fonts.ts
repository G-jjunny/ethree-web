import localFont from "next/font/local";

/**
 * Pretendard(가변 폰트) 로컬 폰트 — 디스플레이·본문 공용.
 * `next/font/local`이 self-host·최적화하며 `--font-pretendard` CSS 변수를 주입한다.
 * globals.css `@theme`의 `--font-display`/`--font-body`/`--font-sans`가 이 변수를 참조한다.
 * (docs/design.md 폰트 토큰 SSOT)
 *
 * src는 이 파일(shared/lib) 기준 상대경로다 — 폰트 파일은 shared/assets/fonts에 둔다.
 * 가변 폰트라 개별 weight 지정 없이 45~920 범위를 한 파일로 커버한다.
 */
export const pretendard = localFont({
  src: "../assets/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

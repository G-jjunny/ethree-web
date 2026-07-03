---
name: design-system
description: 이 프로젝트의 디자인 토큰 규칙. 마크업/className 작업 시 자동 로드. Bootstrap 모드 완료 후 실제 토큰으로 채워진다.
---

# ⚠️ 초기화 필요

이 파일은 design 에이전트의 **Bootstrap 모드** 실행 후 실제 토큰으로 채워진다.

Claude Design으로 메인 페이지 디자인을 확정한 뒤 orchestrator에게 아래와 같이 요청한다.

```
"Claude Design 결과물을 바탕으로 디자인 토큰을 추출해줘"
```

Bootstrap 모드가 완료되면 이 파일이 아래 내용으로 교체된다.

---

## 교체 후 구조 (Bootstrap 완료 시 자동 작성)

```markdown
# 디자인 토큰 규칙

## 색상 토큰

| 토큰 클래스 | 용도                  |
| ----------- | --------------------- |
| bg-brand    | 브랜드 주요 색상 배경 |
| ...         | ...                   |

## 타이포그래피 토큰

...

## 스페이싱 토큰

...

## 하드코딩 금지 목록

❌ bg-[#...] text-[#...] p-[...] rounded-[...]

## content-container 규칙

❌ max-w-[1200px] mx-auto px-5
✅ content-container
```

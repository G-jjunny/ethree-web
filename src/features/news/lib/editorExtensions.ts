import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import type { Extensions } from "@tiptap/react";

/**
 * News 본문 에디터 확장 세트(SSOT).
 *
 * 이 배열은 두 곳에서 **동일하게** 소비된다:
 *   1. 클라이언트 에디터(NewsEditor의 useEditor) — 저장 시 doc JSON 생성.
 *   2. 서버 렌더(renderNewsBody의 generateHTML) — 저장된 doc을 HTML로 변환.
 * 저장/렌더의 스키마가 일치해야 노드가 유실되지 않으므로 단일 배열로 공유한다.
 *
 * next/headers·"use client"에 의존하지 않는 순수 모듈이라 서버·클라 양쪽에서 안전하다.
 *
 * TipTap v3 StarterKit은 Link를 기본 포함하므로 `link: false`로 끄고,
 * 링크 옵션 제어를 위해 standalone Link를 명시적으로 추가한다(확장 중복 방지).
 */
export const newsEditorExtensions: Extensions = [
  StarterKit.configure({ link: false }),
  Image,
  Link.configure({
    openOnClick: false,
    autolink: true,
    HTMLAttributes: {
      rel: "noopener noreferrer nofollow",
      target: "_blank",
    },
  }),
];

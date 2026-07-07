import { generateHTML } from "@tiptap/html";
import DOMPurify from "isomorphic-dompurify";
import type { JSONContent } from "@tiptap/react";
import { newsEditorExtensions } from "./editorExtensions";
import { EMPTY_DOC } from "../model/schema";

/**
 * 저장된 TipTap doc JSON을 **서버에서** 안전한 HTML로 변환한다.
 *
 * 파이프라인:
 *   1. body가 유효한 doc이 아니면 빈 문단으로 폴백(손상/누락 방어).
 *   2. `@tiptap/html` generateHTML로 저장 시와 동일한 확장 세트를 사용해 HTML 생성.
 *   3. `isomorphic-dompurify`로 **반드시 새니타이즈**(XSS 방지) 후 반환.
 *
 * 클라이언트 저장값은 신뢰하지 않는다. 반환 문자열은 상세 페이지에서
 * prose 영역에 dangerouslySetInnerHTML로 주입된다(새니타이즈 완료된 값).
 *
 * next/headers에 의존하지 않지만, DOMPurify/tiptap-html은 서버에서 실행하는 것을
 * 전제로 한다 — 이 유틸은 서버 컴포넌트(상세 page)에서만 호출한다.
 */
function isTiptapDoc(value: unknown): value is JSONContent {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { type?: unknown }).type === "doc"
  );
}

export function renderNewsBody(body: JSONContent | undefined): string {
  const doc = isTiptapDoc(body) ? body : EMPTY_DOC;

  let html: string;
  try {
    html = generateHTML(doc, newsEditorExtensions);
  } catch {
    // 예기치 못한 doc 구조에서도 렌더가 깨지지 않도록 빈 본문으로 폴백.
    html = generateHTML(EMPTY_DOC, newsEditorExtensions);
  }

  return DOMPurify.sanitize(html, {
    // 링크/이미지 속성은 허용하되 스크립트·이벤트 핸들러는 차단(DOMPurify 기본).
    ADD_ATTR: ["target", "rel"],
  });
}

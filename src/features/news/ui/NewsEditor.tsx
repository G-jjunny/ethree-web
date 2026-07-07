"use client";

import { useCallback, useRef, useState, type ChangeEvent } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import type { Editor, JSONContent } from "@tiptap/react";
// 배럴 서버유출 방지: 이 클라이언트 컴포넌트는 features/news의 index.ts 배럴을
// import하지 않는다. 배럴은 서버 전용 getter(unstable_cache·next/headers)를 함께
// 노출하므로, 배럴에서 무엇이든 import하면 서버 전용 코드가 클라 번들에 유입된다.
// 필요한 것만 하위 파일에서 직접 import한다.
// - editorExtensions: 순수 모듈(서버·클라 공유) → 클라 안전
// - uploadNewsImage: 'use server' Server Action → 클라에서 RPC 참조만 됨
import { newsEditorExtensions } from "../lib/editorExtensions";
import { EMPTY_DOC } from "../model/schema";
import { uploadNewsImage } from "../api/uploadNewsImage";

export interface NewsEditorProps {
  /** 초기 본문 doc JSON(수정 모드). 없으면 빈 문단. */
  initialContent?: JSONContent;
  /** 본문 변경 시 최신 doc JSON을 상위 폼에 전달. */
  onChange: (doc: JSONContent) => void;
}

const TOOLBAR_BUTTON_CLASS =
  "rounded-card border border-hairline px-2.5 py-1.5 text-detail font-medium text-ink-soft transition-colors duration-fast ease-out hover:border-brand disabled:opacity-40";
const TOOLBAR_BUTTON_ACTIVE_CLASS =
  "border-brand bg-tint text-olive-label";

/** 툴바 버튼 활성 상태에 따라 클래스 조합. */
function toolbarClass(active: boolean): string {
  return active
    ? `${TOOLBAR_BUTTON_CLASS} ${TOOLBAR_BUTTON_ACTIVE_CLASS}`
    : TOOLBAR_BUTTON_CLASS;
}

/**
 * News 본문 리치텍스트 에디터("use client").
 * TipTap(StarterKit + Image + Link)로 편집하고, 변경 시 doc JSON을 상위로 전달한다.
 * 저장값(JSON)은 서버에서 새니타이즈 후 렌더되므로 여기서는 편집 UX만 담당한다.
 */
export function NewsEditor({ initialContent, onChange }: NewsEditorProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: newsEditorExtensions,
    content: initialContent ?? EMPTY_DOC,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose max-w-none min-h-64 rounded-card border border-hairline bg-surface px-4 py-3 outline-none focus:border-brand",
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getJSON());
    },
  });

  const insertImageFromFile = useCallback(
    async (currentEditor: Editor, file: File) => {
      setUploadError(null);
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadNewsImage(formData);
        if (!result.ok) {
          setUploadError(result.message);
          return;
        }
        currentEditor.chain().focus().setImage({ src: result.url }).run();
      } catch {
        setUploadError("이미지 업로드 중 오류가 발생했습니다.");
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!editor || !file) return;
    void insertImageFromFile(editor, file);
  };

  const handleSetLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 URL을 입력하세요", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  if (!editor) {
    return (
      <div className="min-h-64 rounded-card border border-hairline bg-surface px-4 py-3 text-sm text-muted">
        에디터를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 rounded-card border border-hairline bg-surface-white p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toolbarClass(editor.isActive("bold"))}
        >
          굵게
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={toolbarClass(editor.isActive("heading", { level: 2 }))}
        >
          제목 H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={toolbarClass(editor.isActive("heading", { level: 3 }))}
        >
          제목 H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolbarClass(editor.isActive("bulletList"))}
        >
          • 목록
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toolbarClass(editor.isActive("orderedList"))}
        >
          1. 목록
        </button>
        <button
          type="button"
          onClick={handleSetLink}
          className={toolbarClass(editor.isActive("link"))}
        >
          링크
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={toolbarClass(false)}
        >
          {isUploading ? "업로드 중..." : "이미지"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {uploadError && (
        <p role="alert" className="text-detail text-danger">
          {uploadError}
        </p>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}

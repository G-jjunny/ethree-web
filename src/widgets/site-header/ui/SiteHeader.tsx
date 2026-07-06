"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/shared/ui";
import { NAV_GROUPS } from "@/shared/constants";
// "use client" 컴포넌트 — 서버 getter(getCompanyInfo)를 직접 호출할 수 없다.
// 회사정보는 부모 서버 컴포넌트((marketing) layout)가 주입한다. 타입만 필요하므로
// `import type`로 가져와 런타임 의존(서버 전용 모듈 유입)을 만들지 않는다.
import type { CompanyInfo } from "@/features/company-info";

export interface SiteHeaderProps {
  /** 부모 서버 컴포넌트가 getCompanyInfo()로 주입하는 현재 회사정보. */
  company: CompanyInfo;
}

/**
 * 뷰포트 고정 오버레이 네비게이션.
 * - 최상단: 배경 투명 / 스크롤(>24px): 다크 배경 + blur + hairline 페이드인.
 * - lg 미만: 데스크톱 내비/전화 숨김, 햄버거 패널 노출.
 * 다크 배경 위에 놓이므로 흰색 계열 텍스트를 사용한다.
 *
 * 상호작용(모바일 메뉴/스크롤 감지) 때문에 "use client"이므로 회사정보 값은
 * props로 주입받는다(서버 getter 직접 호출 불가).
 */
export function SiteHeader({ company }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // 스크롤 상태 감지 (passive + cleanup). 마운트 시 현재 위치 즉시 반영.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 열림 상태에서 esc / 외부 영역 클릭 시 닫기.
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const handlePointer = (event: PointerEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    document.addEventListener("pointerdown", handlePointer);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.removeEventListener("pointerdown", handlePointer);
    };
  }, [menuOpen]);

  const isSolid = scrolled || menuOpen;

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-fast ease-out ${
        isSolid
          ? "border-b border-white/10 bg-ink/90 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="content-container flex items-center justify-between py-5 lg:py-7">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="font-display text-logo font-extrabold text-white">
            {company.nameEn}
          </span>
          <span className="text-eyebrow text-white/60">{company.name}</span>
        </Link>

        {/* 데스크톱 내비 (lg+) */}
        <nav className="hidden items-center gap-11 lg:flex">
          {NAV_GROUPS.map((group) => (
            <Link
              key={group.href}
              href={group.defaultHref ?? group.href}
              className="text-sm font-medium text-white/80 transition-colors duration-fast ease-out hover:text-white"
            >
              {group.label}
            </Link>
          ))}
        </nav>

        {/* 데스크톱 전화/CTA (lg+) */}
        <div className="hidden items-center gap-3.5 lg:flex">
          <a
            href={`tel:${company.contact.tel}`}
            className="text-eyebrow text-white/55"
          >
            {company.contact.tel}
          </a>
          <Button variant="primary" size="sm">
            문의하기
          </Button>
        </div>

        {/* 햄버거 (lg 미만) */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          className="flex h-10 w-10 items-center justify-center text-white lg:hidden"
        >
          <span className="relative block h-4 w-6" aria-hidden>
            <span
              className={`absolute left-0 block h-0.5 w-full bg-white transition-all duration-fast ease-out ${
                menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-0.5 w-full -translate-y-1/2 bg-white transition-opacity duration-fast ease-out ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-full bg-white transition-all duration-fast ease-out ${
                menuOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </div>

      {/* 모바일 패널 (lg 미만) */}
      {menuOpen && (
        <nav className="border-t border-white/10 lg:hidden">
          <div className="content-container flex flex-col gap-1 py-4">
            {NAV_GROUPS.map((group) => (
              <Link
                key={group.href}
                href={group.defaultHref ?? group.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm font-medium text-white/80 transition-colors duration-fast ease-out hover:text-white"
              >
                {group.label}
              </Link>
            ))}
            <a
              href={`tel:${company.contact.tel}`}
              onClick={() => setMenuOpen(false)}
              className="py-2 text-eyebrow text-white/55"
            >
              {company.contact.tel}
            </a>
            <Button
              variant="primary"
              size="sm"
              className="mt-2 self-start"
              onClick={() => setMenuOpen(false)}
            >
              문의하기
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}

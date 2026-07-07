-- 뉴스 seed (레거시 ethree.co.kr list.do?BrdGroup=01 수집: 제목+작성일 21건, brdNum 6 결번)
-- 본문은 최소 유효 TipTap 문서(제목 문단) — 관리자 편집 대상. 재실행 안전(on conflict do nothing).
-- 기존 placeholder seed 3건은 이 전량 seed로 대체하므로 먼저 제거.
delete from public.news where slug in ('chemical-safety-mou','8th-climate-seminar-completed','8th-climate-seminar-notice');

insert into public.news (slug, title, excerpt, body, published, published_at) values
  ('news-1', '티엘엔지니어링, 이쓰리와 실내 공기질 개선 위한 MOU', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "티엘엔지니어링, 이쓰리와 실내 공기질 개선 위한 MOU"}]}]}$json$::jsonb, true, '2022-07-28'::timestamptz),
  ('news-2', '[모집 공고] AI 학습용 데이터 크라우드 워커 모집 공고문', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[모집 공고] AI 학습용 데이터 크라우드 워커 모집 공고문"}]}]}$json$::jsonb, true, '2022-08-18'::timestamptz),
  ('news-3', '이쓰리 기술 확장을 위한 기술세미나 개최', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "이쓰리 기술 확장을 위한 기술세미나 개최"}]}]}$json$::jsonb, true, '2023-04-26'::timestamptz),
  ('news-4', '[뉴스] 이쓰리 그린소사이어티 기후환경 플랫폼 사업화 수행', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[뉴스] 이쓰리 그린소사이어티 기후환경 플랫폼 사업화 수행"}]}]}$json$::jsonb, true, '2023-11-21'::timestamptz),
  ('news-5', '[뉴스] (주)이쓰리·고려대오정리질리언스, 제1회 기후세미나 고려대학교서 진행', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[뉴스] (주)이쓰리·고려대오정리질리언스, 제1회 기후세미나 고려대학교서 진행"}]}]}$json$::jsonb, true, '2025-02-20'::timestamptz),
  ('news-7', '[뉴스] "지속가능한 기후위기 극복·탄소중립"...''제2회 기후세미나'' 성료', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[뉴스] \"지속가능한 기후위기 극복·탄소중립\"...'제2회 기후세미나' 성료"}]}]}$json$::jsonb, true, '2025-03-21'::timestamptz),
  ('news-8', '[공지] 2025.04.23 3회 기후세미나 진행 공지', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[공지] 2025.04.23 3회 기후세미나 진행 공지"}]}]}$json$::jsonb, true, '2025-03-21'::timestamptz),
  ('news-9', '[완료] 이쓰리 3차 기후세미나 완료', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[완료] 이쓰리 3차 기후세미나 완료"}]}]}$json$::jsonb, true, '2025-04-29'::timestamptz),
  ('news-10', '[완료] 이쓰리 4차 기후세미나 완료', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[완료] 이쓰리 4차 기후세미나 완료"}]}]}$json$::jsonb, true, '2025-05-21'::timestamptz),
  ('news-11', '[공지] 2025.06.25 5회 기후세미나 진행 공지', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[공지] 2025.06.25 5회 기후세미나 진행 공지"}]}]}$json$::jsonb, true, '2025-06-04'::timestamptz),
  ('news-12', '[공지] 2025.07.03 여름 기후재난 국회세미나 안내', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[공지] 2025.07.03 여름 기후재난 국회세미나 안내"}]}]}$json$::jsonb, true, '2025-06-19'::timestamptz),
  ('news-13', '[완료] 이쓰리 5차 기후세미나 완료', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[완료] 이쓰리 5차 기후세미나 완료"}]}]}$json$::jsonb, true, '2025-06-27'::timestamptz),
  ('news-14', '[완료] 2025.07.03 여름 기후재난 국회세미나 완료', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[완료] 2025.07.03 여름 기후재난 국회세미나 완료"}]}]}$json$::jsonb, true, '2025-07-07'::timestamptz),
  ('news-15', '[공지] 2025.07.29(화) 6차 기후세미나 진행 공지', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[공지] 2025.07.29(화) 6차 기후세미나 진행 공지"}]}]}$json$::jsonb, true, '2025-07-22'::timestamptz),
  ('news-16', '공지 [오믹스 데이터 기반 개인 맞춤형 환경성질환 예측/예방기술 개발] 착수보고회 개최', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "공지 [오믹스 데이터 기반 개인 맞춤형 환경성질환 예측/예방기술 개발] 착수보고회 개최"}]}]}$json$::jsonb, true, '2025-07-24'::timestamptz),
  ('news-17', '[완료] 이쓰리 6차 기후세미나 완료', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[완료] 이쓰리 6차 기후세미나 완료"}]}]}$json$::jsonb, true, '2025-07-30'::timestamptz),
  ('news-18', '[공지] 2025.08.27(수) 7차 기후세미나 진행 공지', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[공지] 2025.08.27(수) 7차 기후세미나 진행 공지"}]}]}$json$::jsonb, true, '2025-08-08'::timestamptz),
  ('news-19', '[완료] 이쓰리 7차 기후세미나 완료', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[완료] 이쓰리 7차 기후세미나 완료"}]}]}$json$::jsonb, true, '2025-08-27'::timestamptz),
  ('news-20', '[공지] 2025.09.30(화) 8차 기후세미나 진행 공지', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[공지] 2025.09.30(화) 8차 기후세미나 진행 공지"}]}]}$json$::jsonb, true, '2025-09-18'::timestamptz),
  ('news-21', '[완료] 이쓰리 8차 기후세미나 완료', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "[완료] 이쓰리 8차 기후세미나 완료"}]}]}$json$::jsonb, true, '2025-10-01'::timestamptz),
  ('news-22', '서울대학교 보건대학원 이쓰리「화학물질 안전관리 특성화대학원 산학협력 MOU 체결식」체결', null, $json${"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "서울대학교 보건대학원 이쓰리「화학물질 안전관리 특성화대학원 산학협력 MOU 체결식」체결"}]}]}$json$::jsonb, true, '2026-06-10'::timestamptz)
on conflict (slug) do nothing;

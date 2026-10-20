# AI 수업 렌즈

AIEDAP 마스터교원 연수 · 우수사례 탐험. 17·18회, 2025, 20회 연구대회 사례를 여섯 가지 렌즈와 세 번의 의사결정 지점으로 살펴보는 정적 웹페이지입니다. 빌드 없이 HTML·CSS·JS만 씁니다.

- `index.html`: 앱 전체
- `img/`: 발표 자료(PPT)에서 가져온 수업 사진 (학생 얼굴은 흐리게 처리)
- `apps-script/Code.gs`: 연수 중 선택(A~D)과 공유에 동의한 이유를 구글 시트에 모으는 구글 앱스 스크립트
- `apps-script/AI수업렌즈_연수응답집계.xlsx`: 응답·집계 시트 (구글 드라이브에 올려 스프레드시트로 열기)

## 주소
- https://aiedap-lens-site.vercel.app (GitHub `main`에 올리면 자동 배포)

## 화면
- 홈 → 1장 사례 탐색 → 한눈 비교 → 2장 의사결정 → 3장 내 카드
- 강사용 실시간 결과 화면: `/#live` (선택 막대와 이유 목록, 10초마다 갱신)

## 의견 모아 보기
- 저장소: Supabase 프로젝트 `aiedap-lens` (서울 리전)의 `votes` 표
- 웹페이지는 공개 키로 `submit_vote`(선택 저장)와 `vote_summary`(집계 읽기) 두 함수만 부를 수 있고, 표를 직접 읽거나 고칠 수는 없음
- 결과 보기: Supabase 대시보드 → Table Editor → `votes` (CSV로 내려받기 가능)
- 강의 화면에 띄우고 싶지 않은 이유: 그 줄의 `hidden`을 `true`로 (인원 집계에는 포함)
- 연수 전에 비우기: Table Editor에서 `votes`의 행을 모두 삭제

`apps-script/` 폴더는 구글 시트로 모으려 했던 이전 방식이며, 지금은 쓰지 않습니다.

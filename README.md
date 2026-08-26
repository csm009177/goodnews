# GOODNEWS MISSION ONE 프로젝트

- 목적 : 선교회 특화 통합된 원앱
- mvp : 성경, 찬송가, 내영의노래 + 합창단을 위한 기능

## 스택 및 구조

- Framework & Server: Next.js (App Router, Node.js Server), Capacitor
- Realtime & Infrastructure: Pusher (WebSockets), Cloudflare R2 (Audio Storage)
- Graphics & UI: HTML5 Canvas, Tailwind CSS
- Deployment: Vercel(Hobby plan)

## 공통

- 권한 체계 : 1.비가입자  2.유저, 합창단  3.합창파트장, 지휘자  4.목사님, 개별 기관장, 관리자
- 스마트 로컬 캐싱 전략 (Capacitor FileSystem / IndexedDB)
  - 1단계 : 캐시 허용 물어보기 (웹/앱 최초 방문 1회)
  - 2단계 : 음원/악보/성경 데이터 호출 시 IndexedDB 우선 조회
  - 3단계 : 데이터 부재 시 백그라운드 다운로드 후 암묵적 Caching
- UI/UX 공통 규칙
  - 다크모드 지원
  - 모든 화면 커서 기본 유지 (`cursor: default`)
  - Hover/Click 시 Pointer 커서 대신 백라이트(Backlight / Highlight) 효과 적용
  - 대용량 데이터 로딩 시 Suspense 스트리밍 + ISR/SSR 적용
- 기기별 반응형 UI/UX 대응
  1. 데스크톱: 슬림 햄버거 / 마우스 Hover / 단축키 (F11, Esc, M)
  2. 태블릿: 화면 Tap 토글 / 플로팅 햄버거
  3. 모바일: 반투명 플로팅 햄버거 (엄지손가락 하단 동선 고려)

## 성경책 페이지

- 기본 성경은 개역한글 FIX
- 영문 성경은 KJV FIX
- 토글 : 한글 / 영문 / 같이보기
- 성서, 장, 구절 찾기 기능
- 모바일 대응 : 터치로 마킹, 길게 눌러 복사
- 장 단위 렌더링( 현재 장 기준 이전/다음 장을 백그라운드 로딩 )
    1. 좌->우 길게 스크롤 하면 이전 장으로 이동
    2. 우->좌 길게 스크롤 하면 다음 장으로 이동
    3. 메모리 관리 : 범위(이전장/현재장/다음 장)에서 벗어난 장은 DOM에서 제거

## 찬송/내영의노래 페이지

- 통합/찬송/내영의노래 검색기능
- 찬송/내영의노래 모드 토글
- 찬송/내영의노래 검색 스크롤러

## 일정/공지 페이지

- 바디 최상단에 공지섹션 ( 기관장 등록가능 )
    1. 디폴트값 : 접기 지원 / 스위퍼(Swiper) 형태
    2. 기관장 권한만 공지등록/상단고정(Pin) 가능
- 달력 / 스트림 모드 토글
    1. 디폴트값 : 달력
    2. 일정 생성/수정/삭제 기능

## 합창 페이지

- 합창단 출석 (합창모드 출석/접속시간 활용하여 로그/실시간 집계)
- 합창모드에 접속한 모든 사용자에게 지휘자 화면 미러링
- 리소스 최적화 : 합창모드 진입시에만 pusher 웹소켓 연결 / 이탈시 연결해제
- 합창모드에서 지휘자/파트장 권한 악보에 필기/그림/녹음 가능 -> r2에 저장

## 프로젝트 구조

src/
├── app/                        # 라우터 및 SSR 레이아웃 주체
│   ├── (main)/                 # [일반 모드] GNB 및 상하단 네비게이션 포함
│   │   ├── layout.tsx
│   │   ├── page.tsx            # 메인
│   │   ├── bible/page.tsx      # 성경 (ISR 및 좌/우 스와이프 적용)
│   │   ├── hymn/page.tsx       # 찬송가 / 내영의노래 (ISR 적용)
│   │   └── schedule/page.tsx   # 일정 / 공지
│   │
│   ├── (fullscreen)/           # [전체화면 모드] GNB 완전히 제거 (100vh)
│   │   ├── layout.tsx          # Fullscreen 래퍼, F11 제어, 반투명 플로팅 햄버거 메뉴
│   │   ├── sheet/page.tsx      # 악보 (전체화면)
│   │   └── choir/page.tsx      # 합창/지휘자 미러링, 출석, 녹음 (전체화면)
│   │
│   └── layout.tsx              # 루트 레이아웃 (전역 폰트, Provider 설정)
│
├── features/                   # 도메인별 독립 비즈니스 모듈
│   ├── bible/                  # 성경 뷰어, 좌/우 스와이프, 앞/뒤 3개 장 슬라이딩 윈도우
│   ├── hymn/                   # 찬송가/내영의노래 검색 및 스크롤러
│   ├── schedule/               # 공지사항, 달력/스트림 일정 관리
│   ├── sheet/                  # 악보 렌더링 및 캐시 로더
│   └── choir/                  # 합창단 전용 독립 모듈
│       ├── components/         # 지휘자 미러링, Canvas 필기, 출석 UI, 녹음 컨트롤러
│       ├── hooks/              # useChoirSocket(Pusher), useCanvasDrawing, useRecorder
│       └── services/           # 지휘자 권한, 출석 API, R2 오디오 업로드 API
│
├── components/                 # 공통 UI 부품 (Button, Modal, FloatingMenu, Skeleton 등)
└── lib/                        # 전역 인프라 & SDK
    ├── pusher/                 # Pusher 인스턴스 (client.ts / server.ts)
    ├── r2/                     # Cloudflare R2 S3 Client 및 Presigned URL 생성기
    ├── db/                     # IndexedDB 오프라인 캐시 제어
    └── utils/                  # 공통 유틸리티 함수

-----------------------------------------------------------------

                          작업 현황판

-----------------------------------------------------------------

0. 프로젝트 초기화 및 기반 설정
 [x] Next.js(App Router) 프로젝트 생성 및 기본 설정
 [x] TypeScript, ESLint, PostCSS 설정
 [x] 폴더 구조 (app, features, components, lib) 생성
 [x] 루트 레이아웃 (layout.tsx) : 전역 폰트, Provider 설정
 [x] globals.css : 다크모드 지원, 커서/백라이트 효과 공통 스타일
1. 공통 인프라 (lib/)
 [x] Pusher SDK : 클라이언트/서버 인스턴스 (pusher)
 [x] Cloudflare R2 : S3 클라이언트, Presigned URL 생성기 (r2)
 [x] IndexedDB : 오프라인 캐시 제어 (db)
 [x] 스마트 로컬 캐싱 전략 : 1단계(허락 질문) → 2단계(IndexedDB 조회) → 3단계(백그라운드 다운로드)
 [x] 공통 유틸리티 (utils)
2. 공통 UI 컴포넌트 (components/)
 [x] Button, Modal, Skeleton 등 기본 UI 부품
 [x] FloatingMenu (반투명 플로팅 햄버거 메뉴)
 [x] 기기별 반응형 UI/UX 대응 (데스크톱/태블릿/모바일)
 [x] 단축키 핸들러 (F11, Esc, M)
3. 일반 모드 레이아웃 (app/(main)/layout.tsx)
 [x] GNB(글로벌 네비게이션 바)
 [x] 상단/하단 네비게이션
 [x] 메인 페이지 (app/(main)/page.tsx)
4. 성경 기능 (bible, bible)
 [x] 개역한글(KOREAN) / KJV(영문) 데이터 연동
 [x] 한글 / 영문 / 같이보기 토글
 [ ] 성서, 장, 구절 찾기 기능
 [ ] 장 단위 렌더링 (3개 장 슬라이딩 윈도우)
 [ ] 좌→우 / 우→좌 길게 스크롤로 이전/다음 장 이동
 [ ] 모바일 대응 : 터치 마킹, 길게 눌러 복사
 [ ] 메모리 관리 : 범위 벗어난 장 DOM 제거
5. 찬송가 / 내영의노래 기능 (hymn, hymn)
 [x] 찬송가 / 내영의노래 데이터 연동
 [x] 통합/찬송/내영의노래 검색 기능
 [x] 찬송/내영의노래 모드 토글
 [x] 검색 스크롤러 UI
6. 일정 / 공지 기능 (schedule, schedule)
 [x] 공지 섹션 (Swiper 형태, 접기 지원)
 [ ] 기관장 권한 : 공지 등록/상단 고정(Pin)
 [x] 달력 모드 UI
 [x] 스트림 모드 UI
 [x] 달력/스트림 토글
 [ ] 일정 생성/수정/삭제 기능
7. 전체화면 모드 레이아웃 (app/(fullscreen)/layout.tsx)
 [x] GNB 제거, 100vh 전체화면 래퍼
 [x] F11 전체화면 제어
 [x] 반투명 플로팅 햄버거 메뉴
8. 악보 기능 (sheet, sheet)
 [x] 악보 렌더링
 [x] 악보 캐시 로더
9. 합창 기능 (choir, choir)
 [ ] Pusher WebSocket 연결/해제 (합창모드 진입/이탈 시)
 [ ] 지휘자 화면 미러링 (실시간 동기화)
 [ ] 합창단 출석 로그/실시간 집계
 [ ] Canvas 필기 : 지휘자/파트장 권한 악보 필기/그림
 [ ] 녹음 기능 : 녹음 컨트롤러
 [ ] 필기/녹음 데이터 R2 저장
10. 권한 체계
 [ ] 인증/인가 시스템 (비가입자 → 유저 → 파트장/지휘자 → 목사님/기관장/관리자)
 [ ] 역할 기반 접근 제어 (RBAC)
11. 배포 및 모바일 빌드
 [ ] Vercel(Hobby) 배포 설정
 [ ] Capacitor 설정 (iOS/Android 빌드)
 [ ] 오프라인 동작 테스트

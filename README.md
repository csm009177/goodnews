# GOODNEWS MISSION ONE 프로젝트

- 목적 : 선교회 특화 통합된 원앱
- mvp : 성경, 찬송가, 내영의노래 + 합창단을 위한 기능

## 스택 및 구조

- Next.js(App Router, Node.js Server), WebSockets, HTML5 Canvas, Capacitor, Vercel(Hobby)

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

# GOODNEWS MISSION ONE 프로젝트

- 목적 : 선교회 특화 통합된 원앱
- mvp : 성경, 찬송가, 내영의노래 + 합창단을 위한 기능

## 공통

- 권한 : 비가입자, 유저, 합창단, 기관장
- 스마트 로컬 캐싱 전략 (Capacitor FileSystem/IndexedDB)
    1단계 : 캐시 허용 물어보기(웹 방문 최초 1회)
    2단계 : 음원/악보/성경 데이터 호출 시 브라우저 저장소(IndexedDB)에 보유여부 검사
    3단계 : 없으면 사용자 기기에 암묵적 캐싱
- 모든 화면에서 커서 변경 금지 (cursor: default 유지)
- 호버/클릭 시 Pointer 커서 대신 백라이트(Backlight / Highlight) UI 효과로 대체

## 성경책 페이지

- 기본 성경은 개역한글 FIX
- 영문 성경은 KJV FIX
- 토글 : 한글 / 영문 / 같이보기
- 성서, 장, 구절 찾기 기능
- 모바일 대응 : 터치로 마킹, 길게 눌러 복사

## 찬송/내영의노래 페이지

- 찬송/내영의노래 모드 토글
- 찬송/내영의노래 검색 스크롤러

## 일정/공지 페이지

- 바디 최상단에 공지섹션 ( 기관장 등록가능 )
    1. 디폴트값 : 접기 지원 / 스위퍼(Swiper) 형태
    2. 기관장 권한 사용자만 공지 등록 상단 고정(Pin) 가능
- 달력 / 스트림 모드 토글
    1. 디폴트값 : 달력
    2. 일정 생성/수정/삭제 기능

## 합창 페이지

- 합창단 출석 (합창모드 출석/접속시간 로그)
- 합창모드에 접속한 모든 사용자에게 지휘자 화면 미러링
- 합창모드에서 악보에 그림 및 필기 가능

## 스택 및 구조

- Next.js(App Router, Node.js Server), WebSockets, HTML5 Canvas, Capacitor, Vercel (Hobby)

src/
├── app/                        # 라우터 및 SSR 레이아웃 주체
│   ├── (main)/                 # [일반 모드] GNB 및 상하단 네비게이션 포함
│   │   ├── layout.tsx
│   │   ├── page.tsx            # 메인
│   │   ├── bible/page.tsx      # 성경 (SSR/ISR 적용)
│   │   ├── hymn/page.tsx       # 찬송가 / 내영의노래
│   │   └── schedule/page.tsx   # 일정 / 공지
│   │
│   ├── (fullscreen)/           # [전체화면 모드] GNB/헤더 완전히 제거 (100vh)
│   │   ├── layout.tsx          # Fullscreen 래퍼 및 F11 제어 API
│   │   ├── sheet/page.tsx      # 악보 (전체화면)
│   │   └── choir/page.tsx      # 합창/지휘자 미러링 & 출석 (전체화면)
│   │
│   └── layout.tsx              # 루트 레이아웃 (전역 폰트, Provider 설정)
│
├── features/                   # 도메인별 독립 비즈니스 모듈
│   ├── bible/                  # 성경 뷰어, 절 선택, KJV/개역한글 토글
│   ├── hymn/                   # 찬송가/내영의노래 검색 및 스크롤러
│   ├── schedule/               # 공지사항, 달력/스트림 일정 관리
│   ├── sheet/                  # 악보 렌더링 및 캐시 로더
│   └── choir/                  # 지휘자 화면 미러링, Canvas 필기, 출석 체크
│
├── components/                 # 공통 UI 부품 (Button, Modal, Skeleton 등)
└── lib/                        # Web API, IndexedDB, WebSocket(Pusher) SDK

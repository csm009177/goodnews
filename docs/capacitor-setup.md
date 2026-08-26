# Capacitor 모바일 빌드 가이드

## 사전 요구사항

### Android
- Android Studio (최신 버전)
- JDK 17 이상
- Android SDK 34 이상

### iOS
- macOS (최신 버전)
- Xcode 15 이상
- CocoaPods (`sudo gem install cocoapods`)

## 설정 방법

### 1. 모바일 플랫폼 추가

```bash
# Android 플랫폼 추가
npm run cap:add:android

# iOS 플랫폼 추가 (macOS에서만 가능)
npm run cap:add:ios
```

### 2. 빌드 및 동기화

```bash
# Next.js 빌드
npm run build

# Capacitor 동기화
npm run cap:sync
```

### 3. IDE에서 열기

```bash
# Android Studio에서 열기
npm run cap:open:android

# Xcode에서 열기 (macOS에서만 가능)
npm run cap:open:ios
```

### 4. 앱 빌드 및 실행

```bash
# Android 에뮬레이터/디바이스에서 실행
npm run cap:run:android

# iOS 시뮬레이터/디바이스에서 실행 (macOS에서만 가능)
npm run cap:run:ios
```

## 개발 모드

```bash
# 1. Next.js 개발 서버 시작
npm run dev

# 2. 별도 터미널에서 Capacitor 동기화
npm run cap:sync

# 3. 모바일 디바이스에서 실행
npm run cap:run:android  # 또는 cap:run:ios
```

## 앱 설정

### 앱 아이콘
`res/mipmap-*` 폴더에 아이콘을 배치하거나 `npx cap icon` 명령어로 생성

### 스플래시 화면
`res/drawable-*` 폴더에 스플래시 화면을 배치하거나 `npx cap splash` 명령어로 생성

## 배포

### Android
1. `npm run build && npm run cap:sync`
2. Android Studio에서 `Build > Generate Signed Bundle / APK`
3. App Bundle (.aab) 생성하여 Google Play Console에 업로드

### iOS
1. `npm run build && npm run cap:sync`
2. Xcode에서 `Product > Archive`
3. App Store Connect에 업로드

## 참고

- Capacitor 공식 문서: https://capacitorjs.com/docs
- Next.js + Capacitor 가이드: https://capacitorjs.com/docs/guides/nextjs
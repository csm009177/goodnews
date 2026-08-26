import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

// Capacitor 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 앱 생명주기 이벤트
  App.addListener('appStateChange', (state) => {
    if (state.isActive) {
      console.log('App is in foreground');
    } else {
      console.log('App is in background');
    }
  });

  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });

  // 상태 바 설정
  StatusBar.setStyle({ style: Style.Dark });
  StatusBar.setBackgroundColor({ color: '#1e3a5f' });
});
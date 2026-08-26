import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'kr.goodnews.missionone',
  appName: 'GOODNEWS MISSION ONE',
  webDir: '.next',
  server: {
    // 개발 시 로컬 서버 연결
    url: 'http://localhost:3000',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e3a5f',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1e3a5f',
    },
  },
};

export default config;

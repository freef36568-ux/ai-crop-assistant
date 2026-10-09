import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aicropassistant.app',
  appName: 'AI Crop Assistant',
  webDir: 'dist',
  server: {
    // While developing, Capacitor loads your built web app from webDir above.
    // If you'd rather live-reload against `npm run dev` on your machine,
    // uncomment and point this at your computer's LAN IP (not localhost —
    // localhost on a phone means the phone itself):
    // url: 'http://192.168.x.x:5173',
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: '#2874f0',
      androidSplashResourceName: 'splash',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK', // dark icons/text, since our header is a light-ish blue
      backgroundColor: '#2874f0',
      overlaysWebView: false,
    },
  },
};

export default config;

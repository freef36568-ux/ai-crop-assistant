import { Capacitor } from '@capacitor/core';

/**
 * All functions here are safe to call on web too — they check
 * Capacitor.isNativePlatform() first and no-op in the browser/PWA,
 * where none of this applies.
 */

export const isNativeApp = () => Capacitor.isNativePlatform();

/**
 * Hides the native splash screen (shown instantly on launch, per
 * capacitor.config.ts) once the React app has actually mounted and
 * rendered its first frame, and sets the Android status bar style to
 * match the app's blue header instead of the OS default.
 */
export async function finishNativeStartup(): Promise<void> {
  if (!isNativeApp()) return;

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setBackgroundColor({ color: '#2874f0' });
    await StatusBar.setStyle({ style: Style.Dark });
  } catch (err) {
    // Status bar plugin can fail on some OEM Android skins — never block startup on it.
    console.warn('StatusBar setup failed (non-fatal):', err);
  }

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch (err) {
    console.warn('SplashScreen hide failed (non-fatal):', err);
  }
}

/**
 * Wires the Android hardware/gesture back button to a caller-supplied
 * handler. The handler returns `true` if it navigated back within the
 * app (so Android should NOT exit), or `false` if there's nowhere left
 * to go (so Android should perform its normal "exit app" behavior).
 *
 * Returns a cleanup function to remove the listener.
 */
export async function registerBackButtonHandler(
  handler: () => boolean
): Promise<() => void> {
  if (!isNativeApp()) return () => {};

  const { App } = await import('@capacitor/app');

  const listener = await App.addListener('backButton', () => {
    const handledInApp = handler();
    if (!handledInApp) {
      App.exitApp();
    }
  });

  return () => {
    listener.remove();
  };
}

export type Platform = 'Android' | 'IOS' | 'Web';

/**
 * Detects the current platform based on the user agent.
 */
export function getPlatform(): Platform {
    if (typeof window === 'undefined') return 'Web';

    const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;

    // Check for iOS
    // @ts-ignore
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'IOS';
    }

    // Check for Android
    if (/android/i.test(userAgent)) {
        return 'Android';
    }

    return 'Web';
}

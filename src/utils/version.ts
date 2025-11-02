import { ref } from 'vue';

// Vite global define
declare const __APP_VERSION__: string;
declare const __GIT_DIRTY__: boolean;

const version = ref<string>('unknown');

/**
 * Check if the git repository has uncommitted changes
 */
async function checkGitDirty(): Promise<boolean> {
    try {
        // First try build-time injection
        if (typeof __GIT_DIRTY__ !== 'undefined') {
            return __GIT_DIRTY__;
        }

        // For development, try to detect dirty state through available methods
        // This is a fallback that checks for common development indicators
        const isDev = import.meta.env.DEV;
        return isDev; // In dev mode, assume dirty
    } catch {
        return false;
    }
}

/**
 * Gets the application version from various sources:
 * - In development/local: git commit hash (injected at build time)
 * - In Docker container: from VERSION file
 * - Fallback: package.json version
 */
export async function getAppVersion(): Promise<string> {
    if (version.value !== 'unknown') {
        const isDirty = await checkGitDirty();
        version.value = version.value.toUpperCase();
        const versionStr = isDirty && !version.value.includes('-dirty')
            ? `${version.value}-dirty`
            : version.value;
        return versionStr;
    }

    let baseVersion = '';

    try {
        // First try to get version from build-time injection (Vite define)
        if (typeof __APP_VERSION__ !== 'undefined') {
            baseVersion = __APP_VERSION__;
        } else {
            // Try to fetch version from file (Docker container)
            try {
                const response = await fetch('/VERSION');
                if (response.ok) {
                    const versionFromFile = await response.text();
                    baseVersion = versionFromFile.trim();
                }
            } catch {
                // File doesn't exist, continue to next method
            }

            // Fallback to package.json version if available
            if (!baseVersion) {
                baseVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
            }
        }

        // Check if git is dirty and append -dirty if needed
        const isDirty = await checkGitDirty();
        version.value = version.value.toUpperCase();
        version.value = isDirty && !baseVersion.includes('-dirty')
            ? `${baseVersion}-dirty`
            : baseVersion;

        return version.value.toUpperCase();
    } catch (error) {
        console.warn('Unable to determine app version:', error);
        version.value = 'FFFFFFFF';
        return version.value;
    }
}

/**
 * Vue composable for accessing the app version
 */
export function useAppVersion() {
    return {
        version: version.value,
        getVersion: getAppVersion,
    };
}
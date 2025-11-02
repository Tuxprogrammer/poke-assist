import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { execSync } from 'child_process';

function getGitHash(): string {
  try {
    // Try to get git commit hash
    const hash = execSync('git rev-parse --short=8 HEAD', { encoding: 'utf8' }).trim();

    // Check if there are untracked changes (modified, added, deleted files)
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    const isDirty = status.length > 0;

    return isDirty ? `${hash}-dirty` : hash;
  } catch {
    // Fallback if not in git repo or git not available
    return 'dev-build';
  }
}

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
  },
  define: {
    __APP_VERSION__: JSON.stringify(getGitHash()),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});

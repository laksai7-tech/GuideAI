import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Cast process to any to avoid TypeScript errors if node types are missing
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // This ensures process.env.API_KEY is replaced with the actual string during build
      // We add || '' to ensure it doesn't crash with "process is not defined" if the key is missing
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});
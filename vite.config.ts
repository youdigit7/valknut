import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://urwhkkrozmlpadjmiqpc.supabase.co';
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyd2hra3Jvem1scGFkam1pcXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NTk2MzYsImV4cCI6MjEwNjUzNTYzNn0.xtHrfPum9Fwnaok_NMVN_PJ9txywuTiqUa__KziXZTc';

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey)
    },
    build: {
      target: 'esnext',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 800
    }
  };
});

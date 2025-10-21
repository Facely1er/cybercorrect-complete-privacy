// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import { sentryVitePlugin } from "file:///home/project/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Sentry plugin for source maps and release tracking
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: "./dist/**"
      },
      release: {
        name: process.env.SENTRY_RELEASE || "cybercorrect@1.0.0"
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    // Disable source maps in production to reduce bundle size and avoid exposing sources
    sourcemap: mode !== "production",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["lucide-react"],
          charts: ["chart.js", "react-chartjs-2", "recharts"]
        }
      }
    },
    chunkSizeWarningLimit: 1e3
  },
  server: {
    port: 5173,
    host: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    }
  },
  preview: {
    port: 4173,
    host: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IHNlbnRyeVZpdGVQbHVnaW4gfSBmcm9tICdAc2VudHJ5L3ZpdGUtcGx1Z2luJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgLy8gU2VudHJ5IHBsdWdpbiBmb3Igc291cmNlIG1hcHMgYW5kIHJlbGVhc2UgdHJhY2tpbmdcbiAgICBzZW50cnlWaXRlUGx1Z2luKHtcbiAgICAgIG9yZzogcHJvY2Vzcy5lbnYuU0VOVFJZX09SRyxcbiAgICAgIHByb2plY3Q6IHByb2Nlc3MuZW52LlNFTlRSWV9QUk9KRUNULFxuICAgICAgYXV0aFRva2VuOiBwcm9jZXNzLmVudi5TRU5UUllfQVVUSF9UT0tFTixcbiAgICAgIHNvdXJjZW1hcHM6IHtcbiAgICAgICAgYXNzZXRzOiAnLi9kaXN0LyoqJyxcbiAgICAgIH0sXG4gICAgICByZWxlYXNlOiB7XG4gICAgICAgIG5hbWU6IHByb2Nlc3MuZW52LlNFTlRSWV9SRUxFQVNFIHx8ICdjeWJlcmNvcnJlY3RAMS4wLjAnLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gRGlzYWJsZSBzb3VyY2UgbWFwcyBpbiBwcm9kdWN0aW9uIHRvIHJlZHVjZSBidW5kbGUgc2l6ZSBhbmQgYXZvaWQgZXhwb3Npbmcgc291cmNlc1xuICAgIHNvdXJjZW1hcDogbW9kZSAhPT0gJ3Byb2R1Y3Rpb24nLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXG4gICAgICAgICAgcm91dGVyOiBbJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICB1aTogWydsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgICBjaGFydHM6IFsnY2hhcnQuanMnLCAncmVhY3QtY2hhcnRqcy0yJywgJ3JlY2hhcnRzJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsXG4gICAgaG9zdDogdHJ1ZSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQ3Jvc3MtT3JpZ2luLU9wZW5lci1Qb2xpY3knOiAnc2FtZS1vcmlnaW4nLFxuICAgICAgJ1gtRnJhbWUtT3B0aW9ucyc6ICdERU5ZJyxcbiAgICAgICdYLUNvbnRlbnQtVHlwZS1PcHRpb25zJzogJ25vc25pZmYnLFxuICAgICAgJ1gtWFNTLVByb3RlY3Rpb24nOiAnMTsgbW9kZT1ibG9jaycsXG4gICAgICAnUmVmZXJyZXItUG9saWN5JzogJ3N0cmljdC1vcmlnaW4td2hlbi1jcm9zcy1vcmlnaW4nXG4gICAgfVxuICB9LFxuICBwcmV2aWV3OiB7XG4gICAgcG9ydDogNDE3MyxcbiAgICBob3N0OiB0cnVlLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDcm9zcy1PcmlnaW4tT3BlbmVyLVBvbGljeSc6ICdzYW1lLW9yaWdpbicsXG4gICAgICAnWC1GcmFtZS1PcHRpb25zJzogJ0RFTlknLFxuICAgICAgJ1gtQ29udGVudC1UeXBlLU9wdGlvbnMnOiAnbm9zbmlmZicsXG4gICAgICAnWC1YU1MtUHJvdGVjdGlvbic6ICcxOyBtb2RlPWJsb2NrJyxcbiAgICAgICdSZWZlcnJlci1Qb2xpY3knOiAnc3RyaWN0LW9yaWdpbi13aGVuLWNyb3NzLW9yaWdpbidcbiAgICB9XG4gIH1cbn0pKSJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHdCQUF3QjtBQUhqQyxJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQTtBQUFBLElBRU4saUJBQWlCO0FBQUEsTUFDZixLQUFLLFFBQVEsSUFBSTtBQUFBLE1BQ2pCLFNBQVMsUUFBUSxJQUFJO0FBQUEsTUFDckIsV0FBVyxRQUFRLElBQUk7QUFBQSxNQUN2QixZQUFZO0FBQUEsUUFDVixRQUFRO0FBQUEsTUFDVjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsTUFBTSxRQUFRLElBQUksa0JBQWtCO0FBQUEsTUFDdEM7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVMLFdBQVcsU0FBUztBQUFBLElBQ3BCLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUM3QixRQUFRLENBQUMsa0JBQWtCO0FBQUEsVUFDM0IsSUFBSSxDQUFDLGNBQWM7QUFBQSxVQUNuQixRQUFRLENBQUMsWUFBWSxtQkFBbUIsVUFBVTtBQUFBLFFBQ3BEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLHVCQUF1QjtBQUFBLEVBQ3pCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUCw4QkFBOEI7QUFBQSxNQUM5QixtQkFBbUI7QUFBQSxNQUNuQiwwQkFBMEI7QUFBQSxNQUMxQixvQkFBb0I7QUFBQSxNQUNwQixtQkFBbUI7QUFBQSxJQUNyQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxNQUNQLDhCQUE4QjtBQUFBLE1BQzlCLG1CQUFtQjtBQUFBLE1BQ25CLDBCQUEwQjtBQUFBLE1BQzFCLG9CQUFvQjtBQUFBLE1BQ3BCLG1CQUFtQjtBQUFBLElBQ3JCO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==

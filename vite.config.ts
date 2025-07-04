import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 设置 @ 指向 src 目录
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      // 将 /api 开头的请求代理到 http://localhost:3000
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true, // 支持虚拟托管站点
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

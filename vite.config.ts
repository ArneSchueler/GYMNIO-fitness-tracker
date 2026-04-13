import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  // 'spa' sorgt dafür, dass Vite die index.html als Einstiegspunkt festschreibt
  appType: "spa",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    // Verhindert, dass der Vercel-Proxy auf die falsche IP zugreift
    host: "localhost",
  },
});

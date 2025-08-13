import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base:"/BECYCURE/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  plugins: [
    react(),
    glsl({
      include: [ "**/*.glsl", "**/*.vert", "**/*.frag" ], // support GLSL imports
    }),
  ],
});
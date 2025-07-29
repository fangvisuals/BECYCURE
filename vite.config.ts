import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  base:"/BECYCURE/",
  plugins: [
    react(),
    glsl({
      include: [ "**/*.glsl", "**/*.vert", "**/*.frag" ], // support GLSL imports
    }),
  ],
});
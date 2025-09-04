import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import { fileURLToPath, URL } from "node:url";

const isCI = process.env.CI === 'true'
const isGhPages = process.env.DEPLOY_TARGET === 'gh-pages'

export default defineConfig({
  base: isCI && isGhPages ? "/BECYCURE/" : "/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    glsl({
      include: ["**/*.glsl", '**/*.wgsl', '**/*.vert', "**/*.frag"], // tes shaders
      warnDuplicatedImports: false,
    }),
    react(),
  ],
  build: {
    target: "es2022",
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        // met three + r3f + loaders dans un chunk séparé (chargé seulement pour le Canvas)
        manualChunks: {
          "three-vendor": [
            "three",
            "@react-three/fiber",
            "@react-three/drei",
            "three/examples/jsm/loaders/GLTFLoader.js",
            "three/examples/jsm/loaders/DRACOLoader.js",
            "three/examples/jsm/math/MeshSurfaceSampler.js",
            "three/examples/jsm/utils/BufferGeometryUtils.js",
          ],
        },
      },
    },
  },
});

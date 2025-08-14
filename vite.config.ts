import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "/BECYCURE/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    react(),
    glsl({
      include: ["**/*.glsl", "**/*.vert", "**/*.frag"], // tes shaders
      exclude: [/node_modules/],
      warnDuplicatedImports: false,
    }),
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

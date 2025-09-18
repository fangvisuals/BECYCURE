import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import { fileURLToPath, URL } from "node:url";

// Nom du dépôt GitHub Pages (chemin de base)
const repoName = "BECYCURE";

// Détection si on est en déploiement GitHub Pages
const isGhPages =
  process.env.GITHUB_PAGES === "true" ||
  process.env.DEPLOY_TARGET === "gh-pages";

export default defineConfig(({ mode }) => {
  const shouldUseRepoBase = isGhPages || mode === "production";

  return {
    base: shouldUseRepoBase ? `/${repoName}/` : "/",
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
  };
});

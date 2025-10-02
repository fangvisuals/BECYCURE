import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import { fileURLToPath, URL } from "node:url";

const repoName = "BECYCURE";

const isGhPages =
  process.env.GITHUB_PAGES === "true" ||
  process.env.DEPLOY_TARGET === "gh-pages";

const inlineCriticalCssPlugin = () => ({
  name: "inline-critical-css",
  enforce: "post",
  apply: "build",
  generateBundle(_options, bundle) {
    const htmlEntries = Object.entries(bundle).filter(
      ([fileName, asset]) => asset.type === "asset" && fileName.endsWith(".html"),
    );

    const cssAssets = Object.entries(bundle)
      .filter(
        ([fileName, asset]) => asset.type === "asset" && fileName.endsWith(".css"),
      )
      .map(([fileName, asset]) => ({
        fileName,
        source:
          typeof asset.source === "string"
            ? asset.source
            : Buffer.from(asset.source).toString("utf-8"),
      }));

    if (htmlEntries.length === 0 || cssAssets.length === 0) {
      return;
    }

    for (const [htmlFileName, htmlAsset] of htmlEntries) {
      let htmlSource =
        typeof htmlAsset.source === "string"
          ? htmlAsset.source
          : Buffer.from(htmlAsset.source).toString("utf-8");

      for (const { fileName, source } of cssAssets) {
        const escapedFileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pattern = new RegExp(
          `<link[^>]+href="[^"]*${escapedFileName}"[^>]*>\s*`,
          "i",
        );

        if (pattern.test(htmlSource)) {
          htmlSource = htmlSource.replace(pattern, `<style>${source}</style>`);
          delete bundle[fileName];
        }
      }

      bundle[htmlFileName] = { ...htmlAsset, source: htmlSource };
    }
  },
});

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
        include: ["**/*.glsl", "**/*.wgsl", "**/*.vert", "**/*.frag"],
        warnDuplicatedImports: false,
      }),
      react(),
      inlineCriticalCssPlugin(),
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

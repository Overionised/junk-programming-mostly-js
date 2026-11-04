import { defineConfig } from "vite";

export default defineConfig({
    base: "/junk-programming-mostly-js/cv4/",
    build: {
        emptyOutDir: true,
        outDir: "../docs/cv4",
        target: "esnext",
    },
    optimizeDeps: {
        exclude: ["@babylonjs/havok"],
    },
});

import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";

export default defineConfig({
  base: "/gimagosik.github.io/",
  build: {
    outDir: "docs",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "page-1": resolve(__dirname, "page-1/index.html"),
        "page-2": resolve(__dirname, "page-2/index.html"),
        "page-3": resolve(__dirname, "page-3/index.html"),
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "partials"),
    }),
  ],
});

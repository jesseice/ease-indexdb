import { defineConfig } from "vite";
export default defineConfig({
  build: {
    lib: {
      entry: {
        eIndexdb: "./src/main.ts",
      },
      name: "eIndexdb",
      fileName: (ModuleFormat, entryName) => {
        return entryName + "." + ModuleFormat + ".js";
      },
      formats: ["es", "cjs", "umd"],
    },
  },
});

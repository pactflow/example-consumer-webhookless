import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { checkProviderPlugin } from "./vite-plugin-check-provider.ts";

// biome-ignore lint/style/noDefaultExport: Vite requires the config to be the module's default export
export default defineConfig({
  plugins: [react(), checkProviderPlugin()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
  envPrefix: ["VITE_", "PACT_", "PROVIDER_"],
});

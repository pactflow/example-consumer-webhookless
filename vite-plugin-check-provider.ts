// biome-ignore-all lint/suspicious/noConsole: Dev plugin needs console output for user guidance
// biome-ignore-all lint/correctness/noProcessGlobal: Vite plugins need access to process.env
// biome-ignore-all lint/style/noProcessEnv: Vite plugins read configuration from process.env
import type { Plugin, ViteDevServer } from "vite";

const PROVIDER_REPO = "https://github.com/pactflow/example-provider";
const DEFAULT_PROVIDER_URL = "http://localhost:8080";
const REQUEST_TIMEOUT_MS = 2000;

async function checkProviderAvailability(
  url: string,
): Promise<{ available: boolean; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(`${url}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    return { available: response.ok };
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      available: false,
      error: errorMessage,
    };
  }
}

function printProviderInstructions(providerUrl: string): void {
  console.log("\n");
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  ⚠️  Provider Not Running                                  ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("\n📋 This example requires a running provider service.\n");
  console.log(`Expected provider at: ${providerUrl}\n`);
  console.log("Quick Start:\n");
  console.log("   1. Clone the provider in a new terminal:");
  console.log(`      git clone ${PROVIDER_REPO}`);
  console.log("      cd example-provider\n");
  console.log("   2. Install and start:");
  console.log("      npm install");
  console.log("      npm run dev\n");
  console.log(
    "   3. Refresh this page once the provider is running at port 8080\n",
  );
}

export function checkProviderPlugin(): Plugin {
  let server: ViteDevServer;
  let hasChecked = false;

  return {
    name: "check-provider",
    configureServer(devServer) {
      server = devServer;

      // Check on server start
      server.httpServer?.once("listening", async () => {
        if (hasChecked) {
          return;
        }
        hasChecked = true;

        const providerUrl =
          process.env.VITE_API_BASE_URL || DEFAULT_PROVIDER_URL;

        // Only check if a provider URL is configured
        if (!providerUrl) {
          console.log(
            "\n⚠️  No VITE_API_BASE_URL configured. API calls will fail.\n",
          );
          printProviderInstructions(DEFAULT_PROVIDER_URL);
          return;
        }

        const result = await checkProviderAvailability(providerUrl);

        if (result.available) {
          console.log(`\n✅ Provider available at ${providerUrl}\n`);
        } else {
          printProviderInstructions(providerUrl);
        }
      });
    },
  };
}

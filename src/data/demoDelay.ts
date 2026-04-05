/** Имитация задержки сети для демо (без реального API). */
export const DEMO_NETWORK_DELAY_MS = 300;

export function demoDelay(ms: number = DEMO_NETWORK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

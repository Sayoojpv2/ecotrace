import path from "node:path";
import type { NextConfig } from "next";

// Pin the project root. Without this, Next.js picks up a stray
// package-lock.json in the user's home folder and guesses the wrong
// workspace root (observed during the 2026-11 recovery build).
const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  turbopack: { root: projectRoot },
};

export default nextConfig;

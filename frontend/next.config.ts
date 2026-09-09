import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextIntlPlugin = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextIntlPlugin(nextConfig);

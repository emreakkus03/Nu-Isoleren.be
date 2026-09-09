import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextIntlPlugin = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
};

export default nextIntlPlugin(nextConfig);

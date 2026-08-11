import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
 
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add empty turbopack config to silence the webpack conflict error
  turbopack: {},
};

export default withPWA(nextConfig);
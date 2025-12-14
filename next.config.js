const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    // Note: headers() doesn't work with static export during development
    // These headers will be applied when deployed to Cloudflare Pages
    const scriptSrc = isDev
      ? "'self' 'unsafe-inline' 'unsafe-eval'" // Dev needs unsafe-eval for HMR
      : "'self' 'unsafe-inline'"; // Production is more restrictive

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; frame-src blob:; connect-src 'self' ws://localhost:* ws://127.0.0.1:*;`
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          }
        ]
      }
    ]
  }
}

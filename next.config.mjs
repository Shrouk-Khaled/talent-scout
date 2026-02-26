import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'mawhebty-files.s3.us-east-1.amazonaws.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'mawhebty-files.s3.amazonaws.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
};

export default withNextIntl(nextConfig);
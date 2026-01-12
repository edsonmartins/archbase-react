import createMDX from '@next/mdx';
import path from 'path';
import { fileURLToPath } from 'url';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Polyfill for Promise.withResolvers (Node.js < 20.10.0)
if (typeof Promise.withResolvers === 'undefined') {
  Promise.withResolvers = function() {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkSlug],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/docs' : undefined,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
  // Set workspace root to avoid warning about multiple lockfiles
  outputFileTracingRoot: path.resolve(__dirname, '..'),
  transpilePackages: [
    '@archbase/core',
    '@archbase/components',
    '@archbase/data',
    '@archbase/layout',
    '@archbase/admin',
    '@archbase/security',
    '@archbase/template',
    '@archbase/advanced',
    '@archbase/ssr',
    '@archbase/feature-flags',
    '@mantine/core',
    '@mantine/hooks',
    '@mantinex/mantine-header',
    'suneditor',
    'suneditor-react',
  ],
  webpack: (config, { isServer }) => {
    // Prevent next/document from being bundled outside of _document
    config.externals = config.externals || [];
    config.externals.push({
      'next/document': 'next/document',
    });

    // Resolve workspace packages to source directory
    const packagesPath = path.resolve(__dirname, '../packages');

    config.resolve.alias = {
      ...config.resolve.alias,
      '@archbase/core': path.join(packagesPath, 'core/src'),
      '@archbase/components': path.join(packagesPath, 'components/src'),
      '@archbase/data': path.join(packagesPath, 'data/src'),
      '@archbase/layout': path.join(packagesPath, 'layout/src'),
      '@archbase/admin': path.join(packagesPath, 'admin/src'),
      '@archbase/security': path.join(packagesPath, 'security/src'),
      '@archbase/template': path.join(packagesPath, 'template/src'),
      '@archbase/advanced': path.join(packagesPath, 'advanced/src'),
      '@archbase/ssr': path.join(packagesPath, 'ssr/src'),
    };

    // Add raw-loader for demo code imports
    config.module.rules.push({
      test: /\.tsx?$/,
      resourceQuery: /raw/,
      type: 'asset/source',
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
};

export default withMDX(nextConfig);

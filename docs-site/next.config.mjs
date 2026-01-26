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
  // basePath removido para deploy em subdomínio dedicado (react.archbase.dev)
  // Se precisar usar subpath, descomente a linha abaixo:
  // basePath: process.env.NODE_ENV === 'production' ? '/docs' : undefined,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
  // Otimizações para build estático
  images: {
    unoptimized: true,
  },
  // Transpilar apenas pacotes ESM que não podem ser usados diretamente
  transpilePackages: [
    '@archbase/feature-flags',
    'suneditor',
    'suneditor-react',
  ],
  webpack: (config, { isServer }) => {
    // Prevent next/document from being bundled outside of _document
    config.externals = config.externals || [];
    config.externals.push({
      'next/document': 'next/document',
    });

    // Resolve workspace packages to dist directory (já buildados pelo Vite)
    const packagesPath = path.resolve(__dirname, '../packages');

    config.resolve.alias = {
      ...config.resolve.alias,
      '@archbase/core': path.join(packagesPath, 'core/dist'),
      '@archbase/components': path.join(packagesPath, 'components/dist'),
      '@archbase/data': path.join(packagesPath, 'data/dist'),
      '@archbase/layout': path.join(packagesPath, 'layout/dist'),
      '@archbase/admin': path.join(packagesPath, 'admin/dist'),
      '@archbase/security': path.join(packagesPath, 'security/dist'),
      '@archbase/template': path.join(packagesPath, 'template/dist'),
      '@archbase/advanced': path.join(packagesPath, 'advanced/dist'),
      '@archbase/security-ui': path.join(packagesPath, 'security-ui/dist'),
      '@archbase/tools': path.join(packagesPath, 'tools/dist'),
      '@archbase/ssr': path.join(packagesPath, 'ssr/src'),
      '@archbase/feature-flags': path.join(packagesPath, 'feature-flags/src'),
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

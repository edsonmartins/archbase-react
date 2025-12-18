import type { MDXComponents } from 'mdx/types';
import { useMDXComponents as getMdxComponents } from './components/MdxElements';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return getMdxComponents(components);
}

import { createViteConfig } from '../../vite.config.shared.mjs';
import pkg from './package.json';

export default createViteConfig(__dirname, pkg);

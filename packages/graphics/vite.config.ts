import { createViteConfig } from '../../vite.config.shared';
import pkg from './package.json';

export default createViteConfig(__dirname, pkg);

// Fundos
export {
  ArchbaseDotGridBackground,
  type ArchbaseDotGridBackgroundProps,
} from './backgrounds/ArchbaseDotGridBackground';
export {
  ArchbaseCosmicDust,
  type ArchbaseCosmicDustProps,
} from './backgrounds/ArchbaseCosmicDust';
export {
  ArchbaseNebulaFlow,
  type ArchbaseNebulaFlowProps,
} from './backgrounds/ArchbaseNebulaFlow';

// Indicadores
export { ArchbaseMagicLoader, type ArchbaseMagicLoaderProps } from './loaders/ArchbaseMagicLoader';

// Base para efeitos proprios
export {
  useArchbaseCanvasAnimation,
  type CanvasSize,
  type FrameState,
  type UseArchbaseCanvasAnimationOptions,
  type UseArchbaseCanvasAnimationResult,
} from './hooks/useArchbaseCanvasAnimation';
export {
  parseColor,
  readColorScheme,
  readCssColor,
  readCssVariable,
  toShaderColor,
  type RgbColor,
} from './theme/resolveColors';

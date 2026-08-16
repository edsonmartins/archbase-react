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
export { ArchbaseVectorFlow, type ArchbaseVectorFlowProps } from './backgrounds/ArchbaseVectorFlow';
export { ArchbaseBeamGrid, type ArchbaseBeamGridProps } from './backgrounds/ArchbaseBeamGrid';
export { ArchbaseAsciiWave, type ArchbaseAsciiWaveProps } from './backgrounds/ArchbaseAsciiWave';
export { ArchbaseNeuralLink, type ArchbaseNeuralLinkProps } from './backgrounds/ArchbaseNeuralLink';
export {
  ArchbaseWaveBackground,
  type ArchbaseWaveBackgroundProps,
} from './backgrounds/ArchbaseWaveBackground';

// Efeitos de elemento
export {
  ArchbaseStardustButton,
  type ArchbaseStardustButtonProps,
} from './elements/ArchbaseStardustButton';
export {
  ArchbaseElectroBorder,
  type ArchbaseElectroBorderProps,
} from './elements/ArchbaseElectroBorder';

// Indicadores
export { ArchbaseMagicLoader, type ArchbaseMagicLoaderProps } from './loaders/ArchbaseMagicLoader';

// Base para efeitos proprios
export {
  useArchbaseShader,
  type UseArchbaseShaderOptions,
  type UseArchbaseShaderResult,
  type ValorUniforme,
} from './hooks/useArchbaseShader';
export {
  useArchbaseCanvasAnimation,
  type CanvasSize,
  type FrameState,
  type UseArchbaseCanvasAnimationOptions,
  type UseArchbaseCanvasAnimationResult,
} from './hooks/useArchbaseCanvasAnimation';
export { criarRuidoPerlin, type RuidoPerlin } from './math/perlin';
export {
  parseColor,
  readColorScheme,
  readCssColor,
  readCssVariable,
  toShaderColor,
  type RgbColor,
} from './theme/resolveColors';

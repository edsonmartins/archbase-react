/**
 * Linha do tempo por recurso.
 *
 * <p>Fork de mantine-resource-timeline 8.1.2 (MIT, Jan Vollmer) — ver README.md e LICENSE.upstream.
 * A API pública é a mesma do original, para que trocar o import baste; os aliases com prefixo
 * Archbase existem para código novo, que segue a convenção da casa.
 */
export {
  determineDisplayUnit,
  useSchedulerController,
} from "./controller/controller";
export type {
  DetermineSubMomentCountsFn,
  SchedulerController,
  SchedulerControllerParams,
  SchedulerDisplayUnit,
} from "./controller/controller";

export type { OnSelectFn } from "./controller/selectControls";
export { Scheduler } from "./Scheduler/Scheduler";
export type { SchedulerProps } from "./Scheduler/Scheduler";
export { DefaultNowMarker } from "./SchedulerBody/NowMarker";
export type { NowMarkerProps } from "./SchedulerBody/NowMarker";
export { DefaultResourceLabel } from "./SchedulerBody/ResourceLabel";
export type { ResourceLabelProps } from "./SchedulerBody/ResourceLabel";
export { SchedulerBody } from "./SchedulerBody/SchedulerBody";
export type { SchedulerBodyProps } from "./SchedulerBody/SchedulerBody";
export { DefaultSchedulerEntry } from "./SchedulerBody/SchedulerEntry/SchedulerEntry";
export type { SchedulerEntryProps } from "./SchedulerBody/SchedulerEntry/SchedulerEntry";
export type { MomentStyleFn } from "./SchedulerBody/SchedulerMoment/momentStyling";
export { DefaultMomentLabel } from "./SchedulerHeader/DefaultMomentLabel";
export type { MomentLabelProps } from "./SchedulerHeader/DefaultMomentLabel";
export type {
  SchedulerHeaderOnClickFn,
  SchedulerHeaderOnClickProp,
} from "./SchedulerHeader/SchedulerHeader";

// Aliases da casa. Mantidos ao lado dos nomes originais de propósito: renomear tudo obrigaria quem
// migra a reescrever a tela inteira, e o ganho seria só cosmético.
export { Scheduler as ArchbaseScheduler } from './Scheduler/Scheduler';
export { useSchedulerController as useArchbaseSchedulerController } from './controller/controller';
export { SchedulerBody as ArchbaseSchedulerBody } from './SchedulerBody/SchedulerBody';
export type { SchedulerProps as ArchbaseSchedulerProps } from './Scheduler/Scheduler';
export type { SchedulerController as ArchbaseSchedulerController } from './controller/controller';

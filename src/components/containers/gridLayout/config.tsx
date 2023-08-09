import { ArchbaseScreenClass } from "./utils";

export interface Configuration {
  breakpoints: number[];
  containerWidths: number[];
  gutterWidth: number;
  gridColumns: number;
  defaultScreenClass: ArchbaseScreenClass;
  maxScreenClass: ArchbaseScreenClass;
}

let configuration: Configuration = {
  breakpoints: [576, 768, 992, 1200, 1600, 1920],
  containerWidths: [540, 750, 960, 1140, 1540, 1810],
  gutterWidth: 30,
  gridColumns: 12,
  defaultScreenClass: 'xxl',
  maxScreenClass: 'xxl',
};

export const getConfiguration = (): Configuration => configuration;

export const setConfiguration = (newConfiguration: Partial<Configuration>): void => {
  configuration = { ...configuration, ...newConfiguration };
};

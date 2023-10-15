import { IPage } from '@emaileditor/core/index';

export interface IEmailTemplate {
  content: IPage;
  subject: string;
  subTitle: string;
}

declare global {
  function t(key: string): string;
  function t(key: string, placeholder: React.ReactNode): JSX.Element;

  interface Window {
    // translation

    t: (key: string, placeholder?: React.ReactNode) => JSX.Element;
  }
}

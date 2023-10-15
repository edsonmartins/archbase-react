declare module 'mjml-browser' {
  export const transform: (
    vml: string,
    options?: {
      beautify?: boolean;
      minify?: boolean;
      keepComments?: boolean;
      validationLevel: 'strict' | 'soft' | 'skip';
    }
  ) => {
    json: MjmlBlockItem;
    html: string;
    errors: string[];
  };
}

interface MjmlBlockItem {
  file: string;
  absoluteFilePath: string;
  line: number;
  includedIn: any[];
  tagName: string;
  children: IChildrenItem[];
  content?: string;
  attributes: {
    [key: string]: any;
  };
}

interface IChildrenItem {
  file?: string;
  absoluteFilePath?: string;
  line: number;
  includedIn: any[];
  tagName: string;
  children?: IChildrenItem[];
  attributes: {
    [key: string]: any;
  };
  content?: string;
  inline?: 'inline';
}


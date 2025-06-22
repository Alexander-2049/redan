/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "vdf" {
  const VDF: {
    parse: (input: string) => any;
    stringify?: (input: any) => string;
  };
  export = VDF;
}

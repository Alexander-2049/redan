interface IProcessEnv {
  NODE_ENV?: string;
}

export const IS_DEV = (process.env as IProcessEnv).NODE_ENV === "development";

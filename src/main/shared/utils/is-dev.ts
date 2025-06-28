interface IProcessEnv {
  NODE_ENV?: string;
}

export const isDev = () => (process.env as IProcessEnv).NODE_ENV === 'development';

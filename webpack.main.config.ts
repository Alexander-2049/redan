import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import path from 'path';

export const mainConfig: Configuration = {
  /**
   * Multiple entry points: main app + steam worker
   */
  entry: {
    index: './src/main/app/index.ts', // your existing main entry
    'steam-worker': './src/main/steam/steam-worker.ts', // new worker entry
  },
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    filename: '[name].js', // ensures index.js and steam-worker.js are emitted separately
    path: path.resolve(__dirname, '.webpack/main'),
  },
  devtool: 'source-map',
};

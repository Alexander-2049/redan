import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import path from 'path';
import fsp from 'fs/promises';
import { HTTP_SERVER_PORT } from './src/main/shared/constants';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: 'public/logo.ico',
  },
  hooks: {
    async postPackage(config, results) {
      const baseDir = results.outputPaths[0]; // Correct way to get the output path

      const destPath = path.join(
        baseDir,
        'resources',
        'app.asar.unpacked',
        '.webpack',
        'main',
        'native_modules',
        'dist',
        'win64',
      );

      await fsp.mkdir(destPath, { recursive: true });

      const filesToCopy = ['steam_api64.dll', 'steam_api64.lib'];

      for (const file of filesToCopy) {
        const src = path.resolve(`node_modules/steamworks.js/dist/win64/${file}`);
        const dest = path.join(destPath, file);
        await fsp.copyFile(src, dest);
        console.log(`✔ Copied ${file} → ${dest}`);
      }
    },
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy: `connect-src 'self' ws://localhost:${HTTP_SERVER_PORT} http://localhost:${HTTP_SERVER_PORT} 'unsafe-eval'`,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/renderer/index.html',
            js: './src/renderer/index.tsx',
            name: 'main_window',
            preload: {
              js: './src/main/entities/main-window/preload.ts',
            },
          },
          {
            name: 'overlay_window',
            preload: {
              js: './src/preload/overlay-preload.ts',
            },
          },
        ],
      },
    }),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;

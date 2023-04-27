import fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as esbuild from 'esbuild';
import path from 'node:path';
import legacy from '@vitejs/plugin-legacy';
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import requireTransform from 'vite-plugin-require-transform';

import { nodeModulesPolyfillPlugin } from 'esbuild-plugins-node-modules-polyfill';
import externals from 'rollup-plugin-node-externals';

import { nodePolyfills } from 'vite-plugin-node-polyfills';

const sourceJSPattern = /\/src\/.*\.js$/;
const rollupPlugin = (matchers) => ({
  name: 'js-in-jsx',
  load(id) {
    if (matchers.some((matcher) => matcher.test(id))) {
      const file = fs.readFileSync(id, { encoding: 'utf-8' });
      return esbuild.transformSync(file, { loader: 'jsx' });
    }
  },
});

function esbuildMakerJsPlugin() {
  return {
    name: 'esbuild-makerjs',
    setup(build) {
      build.onLoad({ filter: /makerjs$/ }, async (args) => {
        const contents = await fs.promises.readFile(args.path, 'utf8');
        const replacedContents = contents.replace(
          "var clone = require('clone');",
          "import clone from 'clone';"
        );
        const transformed = await esbuild.transform(replacedContents, {
          loader: 'js',
          format: 'esm',
          target: 'esnext',
        });

        return {
          contents: transformed.code,
          loader: 'js',
        };
      });
    },
  };
}

function fixReactCsvPlugin(command) {
  const esbuildPlugin = {
    name: 'esbuild:resolve-fixes',
    setup: (build) => {
      build.onResolve({ filter: /react-csv$/ }, (args) => {
        return Promise.resolve({
          path: path.join(process.cwd(), './node_modules/react-csv/index.js'),
        });
      });
    },
  };

  return {
    name: 'resolve-fixes',
    config() {
      // only use the esbuild plugin during dev ("serve" command)
      if (command === 'serve') {
        return {
          optimizeDeps: {
            // development fixes
            esbuildOptions: {
              plugins: [esbuildPlugin],
            },
          },
        };
      }

      // build
      return {
        resolve: {
          // production fixes
          alias: [
            {
              find: 'react-csv',
              replacement: './node_modules/react-csv/index.js',
            },
          ],
        },
      };
    },
  };
}

export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(),
      fixReactCsvPlugin(command),
      esbuildMakerJsPlugin(),

      requireTransform({}),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      nodeModulesPolyfillPlugin(),
      nodePolyfills({
        protocolImports: true,
      }),
      esbuildCommonjs(),
    ],
    build: {
      rollupOptions: {
        plugins: [rollupPlugin([sourceJSPattern])],
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
        plugins: [esbuildCommonjs(['makerjs'])],
      },
      include: ['pdfmake/build/pdfmake', 'pdfmake/build/vfs_fonts', 'makerjs'],
    },
    esbuild: {
      loader: 'jsx',
      include: [sourceJSPattern],
      exclude: [],
    },
    server: {
      open: false, // This will open the app in a new browser tab
      base: '/public/',
    },
  };
});

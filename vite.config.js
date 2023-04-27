import fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as esbuild from 'esbuild';
import path from 'node:path';

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
    plugins: [react(), fixReactCsvPlugin(command)],
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
      },
      include: ['pdfmake/build/pdfmake', 'pdfmake/build/vfs_fonts'],
    },
    esbuild: {
      loader: 'jsx',
      include: [sourceJSPattern],
      exclude: [],
    },
    server: {
      open: true, // This will open the app in a new browser tab
      base: '/public/',
    },
  };
});

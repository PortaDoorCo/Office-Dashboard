// jsxLoaderPlugin.js
export function jsxLoaderPlugin() {
  return {
    name: 'jsx-loader',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('.js') && code.includes('<') && code.includes('>')) {
        return {
          loader: 'jsx',
          code,
        };
      }
    },
  };
}

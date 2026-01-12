const postcssSimpleVars = require('postcss-simple-vars');

module.exports = (opts) => {
  const simpleVars = postcssSimpleVars(opts);

  return {
    postcssPlugin: 'simple-vars-skip-node-modules',
    Once(root, { result }) {
      const filePath = result.root.source?.input?.file;
      // Skip processing for node_modules
      if (!filePath || !filePath.includes('node_modules')) {
        simpleVars.Once(root, result);
      }
    },
  };
};

module.exports.postcss = true;

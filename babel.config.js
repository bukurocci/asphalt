const { NODE_ENV } = process.env;

module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        modules: false,
        loose: true
      }
    ]
  ];
  const plugins = [NODE_ENV === 'test' && '@babel/transform-modules-commonjs'].filter(Boolean);

  return {
    presets,
    plugins
  };
};

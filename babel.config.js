module.exports = {
  presets: ['@babel/env', '@babel/react', '@babel/flow'],
  plugins: [],
  env: {
    esm: {
      presets: [['@babel/env', {modules: false}]],
    },
  },
};

module.exports = {
  webpackFinal: async config => {
    const movIndex = config.module.rules.findIndex(({ test }) => `${test}` == /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/);
    config.module.rules[movIndex].test = /\.(mp4|webm|wav|mp3|m4a|aac|oga|mov)(\?.*)?$/;
    return config
  },
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ]
}

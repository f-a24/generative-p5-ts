module.exports = {
  webpackFinal: async config => {
    const movIndex = config.module.rules.findIndex(({ test }) => `${test}` == /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/);
    config.module.rules[movIndex].test = /\.(mp4|webm|wav|mp3|m4a|aac|oga|mov|ogg)(\?.*)?$/;
    const fileIndex = config.module.rules.findIndex(({ test }) => `${test}` == /\.(svg|ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/);
    config.module.rules[fileIndex].test = /\.(svg|ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf|txt)(\?.*)?$/;
    config.node = { fs: 'empty' };
    return config
  },
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ]
}

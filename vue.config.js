let TARGET
if (process.env.NODE_ENV === 'development') {
  // https://beta.zwyknit.com
  TARGET = 'https://yarn_beta.zwyknit.com'
} else {
  // 正式环境
  TARGET = 'http://yarn.zwyknit.com/'
}
module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 9966,
    https: false,
    proxy: {
      '/api': {
        target: TARGET, // 对应自己的接口
        changeOrigin: true,
        ws: true
      }
    }
  }
}

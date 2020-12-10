module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: {
      '/core': {
        target: 'http://127.0.0.1:8787/api/v1',
        pathRewrite: {
          '/core' : ''
        }
      }
    }
  }
}
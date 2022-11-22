const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    webpack: (config, env) => {

      config.plugins.push(new CompressionPlugin());
      if(process.env.REACT_APP_INTERACTIVE_ANALYZE){
        config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server' }))
      }

      return config;
    }
}
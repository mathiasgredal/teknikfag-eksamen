const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { ESBuildMinifyPlugin } = require('esbuild-loader');

function useEsbuildMinify(config, options) {
	const terserIndex = config.optimization.minimizer.findIndex(minimizer => (minimizer.constructor.name === 'TerserPlugin'));
	if (terserIndex > -1) {
		config.optimization.minimizer.splice(
			terserIndex,
			1,
			new ESBuildMinifyPlugin(options),
		);
	}
}

function useEsbuildLoader(config, options) {
	const jsLoader = config.module.rules.find(rule => rule.test && rule.test.test('.ts'));

	if (jsLoader) {
		jsLoader.use.loader = 'esbuild-loader';
		jsLoader.use.options = options;
	}
}

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      )
    }

    config.plugins.push(
      new webpack.ProvidePlugin({
        React: 'react',
        }),
    );
    useEsbuildMinify(config);
    useEsbuildLoader(config, {
      loader: 'tsx',
      target: 'es2020',
    });

    return config
  },
  future: {
    webpack5: true,
  },
  productionBrowserSourceMaps: true
}


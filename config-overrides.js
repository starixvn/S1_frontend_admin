const {
	override,
	fixBabelImports,
	setWebpackOptimizationSplitChunks,
} = require('customize-cra')

module.exports = override(
	fixBabelImports('lodash', {
		libraryDirectory: '',
		camel2DashComponentName: false,
	}),
	setWebpackOptimizationSplitChunks({
		cacheGroups: {
			vendor: {
				test: /[\\/]node_modules[\\/]/,
				name: 'vendor',
			},
		},
	})
)

const { override, fixBabelImports } = require('customize-cra')

module.exports = override(
	fixBabelImports('lodash', {
		libraryDirectory: '',
		camel2DashComponentName: false,
	})
)

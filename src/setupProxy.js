const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = app => {
	app.use(
		["/api", "/apiV2"],
		createProxyMiddleware({
			target: "http://admin.n88dev.com",
			changeOrigin: true
		})
	);
};

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = app => {
	app.use(
		[
			"/api",
			"/apiV2",
			"/ApiV2",
			"/lib",
			"/js",
			"/css",
			"/common",
			"/Home",
			"/CustManage",
			"/Message",
			"/Marketing",
			"/Finance",
			"/Report",
			"/BankFinancial",
			"/Admin",
			"/resource",
			"/images"
		],
		createProxyMiddleware({
			target: "http://ecs.nova88dev.com:5070",
			changeOrigin: true
		})
	);
};

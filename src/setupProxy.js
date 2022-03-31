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
			"/Admin"
		],
		createProxyMiddleware({
			target: "http://admin.n88dev.com",
			changeOrigin: true
		})
	);
};

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
			// * 開放給 辦公室 IP 與公司 VPN 直連 LoadBalance 的 Domain
			target: " http://adminsiteservice.nova88dev.com",
			changeOrigin: true
		})
	);
};

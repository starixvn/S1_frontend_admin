import { defineConfig, ProxyOptions } from 'vite'
import styleImport from 'vite-plugin-style-import'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/

// 底下這些路徑需要 proxy
const proxyPaths = [
	'/api',
	'/apiV2',
	'/ApiV2',
	'/lib',
	'/js',
	'/css',
	'/common',
	'/Home',
	'/CustManage',
	'/Message',
	'/Marketing',
	'/Finance',
	'/Report',
	'/BankFinancial',
	'/Admin',
	'/resource',
	'/images',
]

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			app: path.resolve(__dirname, 'src/app'),
			assets: path.resolve(__dirname, 'src/assets'),
			common: path.resolve(__dirname, 'src/common'),
			components: path.resolve(__dirname, 'src/components'),
			features: path.resolve(__dirname, 'src/features'),
			type: path.resolve(__dirname, 'src/type'),
			typings: path.resolve(__dirname, 'src/typings'),
		},
	},
	server: {
		// 啟動後自動打開瀏覽器
		open: true,
		// dev proxy
		proxy: proxyPaths.reduce((acc, proxyPath) => {
			acc[proxyPath] = {
				target: 'http://adminsiteservice.nova88dev.com',
				changeOrigin: true,
			}
			return acc
		}, {} as Record<string, ProxyOptions>),
	},
})

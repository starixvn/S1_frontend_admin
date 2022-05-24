import axios from 'axios'

export const baseUrl = '/apiV2/'

export const ApiV1 = axios.create({
	withCredentials: true,
	baseURL: '/api/',
})

export const ApiV2 = axios.create({
	withCredentials: true,
	baseURL: baseUrl,
})

export default class BoApi {
	static get = (url: string, data: Object | null = null) =>
		ApiV2.get(url, { params: data })

	static post = (url: string, data: Object | null = null) =>
		ApiV2.post(url, data)

	static onInternalCheckSignIn = async () => {
		const response = await ApiV1.post('/Home/CheckSignIn')

		if (response?.data?.errorCode !== 0) {
			throw new Error(response?.data?.message)
		}

		return {
			user: response?.data.data,
			isLogin: true,
		}
	}

	static onInternalSignIn = async (
		userName: string,
		userPassword: string,
		redirectUrl: string
	) => {
		const response = await ApiV1.post('/Home/Signin', {
			txtID: userName,
			txtPW: userPassword,
			redirectUrl,
		})

		if (response?.data.errorCode !== 0) {
			switch (response?.data?.errorCode) {
				case 1004:
					throw new Error('System.Label_WrongPassword')

				default:
					throw new Error('System.Label_LoginFailed')
			}
		}

		return {
			user: response?.data.data,
			isLogin: true,
		}
	}

	static onInternalSignOut = async () => ApiV1.post('/Home/SignOut')

	static onCheckSignIn = async () => {
		const response = await BoApi.post('/Home/CheckSignIn')

		if (response?.data?.errorCode !== 0) {
			throw new Error(response?.data?.message)
		}

		return {
			user: response?.data.data,
			isLogin: true,
		}
	}

	static onSignOut = async () => BoApi.post('/Home/SignOut')

	static onSignIn = async (userName: string, userPassword: string) => {
		const response = await BoApi.post('/Home/Signin', {
			userName,
			userPwd: userPassword,
		})

		if (response?.data.errorCode !== 0) {
			switch (response?.data?.errorCode) {
				case 1004:
					throw new Error('System.Label_WrongPassword')

				default:
					throw new Error('System.Label_LoginFailed')
			}
		}

		return {
			user: response?.data.data,
			isLogin: true,
		}
	}

	static onChangePassword = async ({
		oldPassword,
		newPassword,
	}: {
		oldPassword: string
		newPassword: string
	}) => {
		const response = await BoApi.post('/home/ChangePwd', {
			OldPwd: oldPassword,
			NewPwd: newPassword,
		})

		if (response?.data.errorCode !== 0) {
			throw new Error(response?.data?.message ?? '')
		}
	}

	static getUserMenu = async ({
		lang,
		siteId,
	}: {
		lang: string
		siteId: number
	}) => {
		const response = await BoApi.post('/Permission/GetUserMenu', {
			lang,
			siteId,
		})

		const userMenuList = response?.data?.data ?? []

		return userMenuList
	}

	static getAllMenu = async (lang: string) => {
		const response = await BoApi.post('/Permission/GetAllMenu', { lang })

		return response?.data?.data ?? []
	}
}

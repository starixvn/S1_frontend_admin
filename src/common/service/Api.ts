import axios from 'axios'

const rootURL = ''

export const ApiV2 = axios.create({
	withCredentials: true,
	baseURL: `${rootURL}/apiV2`,
})

export default class BoApi {
	static get = (url: string, data: Object | null = null) =>
		ApiV2.get(url, { params: data })

	static post = (url: string, data: Object | null = null) =>
		ApiV2.post(url, data)

	static onCheckSignIn = async () => {
		const response = await BoApi.post('/home/CheckSignIn')

		if (response?.data?.errorCode !== 0) {
			throw new Error(response?.data?.message)
		}

		return {
			user: response?.data.data,
			isLogin: true,
		}
	}

	static onSignIn = async (userName: string, userPassword: string) => {
		const response = await BoApi.post('/home/Signin', {
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

	static onSignOut = async () => BoApi.post('/home/SignOut')

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

	static getUserMenu = async (lang: string | null) => {
		const response = await BoApi.post('/Permission/GetUserMenu', { lang })

		const userMenuList = response?.data?.data ?? []

		return userMenuList
	}

	static getAllMenu = async (lang: string) => {
		const response = await BoApi.post('/Permission/GetAllMenu', { lang })

		return response?.data?.data ?? []
	}
}

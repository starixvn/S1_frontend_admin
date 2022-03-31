import axios from "axios";

const rootURL = "";

export const ApiV2 = axios.create({
	withCredentials: true,
	baseURL: `${rootURL}/apiV2`,
	headers: { "Content-Type": "application/json" },
	timeout: 20000
});

export default class BoApi {
	static get = (url: string, data = null) => ApiV2.get(url, { params: data });
	static post = (url: string, data = null) => ApiV2.post(url, data);

	static onCheckSignIn = async () => {
		const response = await ApiV2.post("/home/CheckSignIn");

		if (response?.data?.errorCode !== 0) {
			throw new Error(response?.data?.message);
		}

		return {
			user: response?.data.data,
			isLogin: true
		};
	};

	static onSignIn = async (userName: string, userPassword: string) => {
		const response = await ApiV2.post("/home/Signin", {
			userName: userName,
			userPwd: userPassword
		});

		if (response?.data.errorCode !== 0) {
			switch (response?.data?.errorCode) {
				case 1004:
					throw new Error("System.Label_WrongPassword");

				default:
					throw new Error("System.Label_LoginFailed");
			}
		}

		return {
			user: response?.data.data,
			isLogin: true
		};
	};

	static onSignOut = async () => ApiV2.post("/home/SignOut");

	static onChangePassword = async ({
		oldPassword,
		newPassword
	}: {
		oldPassword: string;
		newPassword: string;
	}) => {
		await ApiV2.post("/home/ChangePwd", {
			OldPwd: oldPassword,
			NewPwd: newPassword
		});
	};

	static getUserMenu = async () => {
		const response = await ApiV2.post("/Permission/GetUserMenu");

		const menuList = response?.data?.data ?? [];

		return menuList;
	};
}

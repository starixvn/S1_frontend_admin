import axios from "axios";

export const ApiV1 = axios.create({
	withCredentials: true,
	baseURL: `/api`,
	headers: { "Content-Type": "application/json" },
	timeout: 20000
});

export const ApiV2 = axios.create({
	withCredentials: true,
	baseURL: `/apiV2`,
	headers: { "Content-Type": "application/json" },
	timeout: 20000
});

export default class BoApi {
	static onCheckSignIn = async () => {
		const response = await ApiV2.post("/home/CheckSignIn");

		const isLogin = response?.data?.errorCode === 0;

		if (!isLogin) {
			throw new Error(response?.data?.message);
		}

		return isLogin;
	};

	static onSignIn = async (userName: string, userPassword: string) => {
		const response = await ApiV2.post("/home/Signin", {
			userName: userName,
			userPwd: userPassword
		});

		if (response?.data.errorCode !== 0) {
			switch (response?.data?.errorCode) {
				case 1004:
					throw new Error("System.Label_LoginFailed");

				default:
					throw new Error("System.Label_NotExpectedServerError");
			}
		}

		return response?.data.errorCode === 0;
	};

	static onSignOut = async () => {
		const response = await ApiV2.post("/home/SignOut");

		return response?.data.errorCode === 0;
	};
}

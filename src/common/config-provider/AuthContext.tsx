import { message } from "antd";
import BoApi from "common/service/Api";
import { LocationState } from "features/login";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export interface AuthContextType {
	isLogin: boolean | undefined;
	onSignIn: (userName: string, userPassword: string) => void;
	onSignOut: () => void;
	onCheckSignIn: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const { t } = useTranslation();
	const [isLogin, setIsLogin] = useState<boolean | undefined>();
	const navigate = useNavigate();
	let location = useLocation();

	let from = (location as LocationState)?.state?.from?.pathname || "/dashboard";

	let onCheckSignIn = async () => {
		let isLogin = false;

		try {
			isLogin = await BoApi.onCheckSignIn();
		} catch (error) {
			isLogin = false;
		}

		setIsLogin(isLogin);
	};

	let onSignIn = async (userName: string, userPassword: string) => {
		try {
			const isLogin = await BoApi.onSignIn(userName, userPassword);

			if (isLogin) {
				setIsLogin(true);
				navigate(from, { replace: true });
				message.success(t("System.Label_LoginSuccess"));
			}
		} catch (error) {
			message.error(t((error as Error).message));
		}
	};

	let onSignOut = async () => {
		try {
			const isLogout = await BoApi.onSignOut();

			if (isLogout) {
				setIsLogin(false);
			}
			message.success(t("System.Label_LogoutSuccess"));
		} catch (error) {
			message.error(t((error as Error).message));
		}
	};

	useEffect(() => {
		if (isLogin === undefined) {
			onCheckSignIn();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let value = { isLogin, onSignIn, onSignOut, onCheckSignIn };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };

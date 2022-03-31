import BoApi from "common/service/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { createContext, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { LocationState, UserAllowedRole, UserMenuState } from "type";
import { message } from "antd";
import path from "app/constants/paths";

export interface AuthContextType {
	auth: AuthState;
	userAllowedRoles: UserAllowedRole[] | undefined;
	onSignIn: (userName: string, userPassword: string) => void;
	onSignOut: () => void;
	onCheckSignIn: () => void;
	onChangePassword: ({
		oldPassword,
		newPassword
	}: {
		oldPassword: string;
		newPassword: string;
	}) => void;
	onFetchUserAllowedRoles: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export interface AuthState {
	user: string;
	isLogin: boolean | undefined;
}

const initialAuth = {
	user: "",
	isLogin: undefined
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	let location = useLocation();

	const [auth, setAuth] = useState<AuthState>(initialAuth);
	const [userAllowedRoles, setUserAllowedRoles] = useState<
		UserAllowedRole[] | undefined
	>(undefined);

	let from = (location as LocationState)?.state?.from?.pathname || "/";

	let onCheckSignIn = async () => {
		try {
			let _auth: AuthState = await BoApi.onCheckSignIn();

			setAuth(_auth);
		} catch (error) {
			setAuth({ user: "", isLogin: false });
			message.warn(t("System.Label_Unauthorized"));
		}
	};

	let onSignIn = async (userName: string, userPassword: string) => {
		try {
			const _auth = await BoApi.onSignIn(userName, userPassword);

			setAuth(_auth);
			navigate(from, { replace: true });
			message.success(t("System.Label_LoginSuccess"));
		} catch (error) {
			message.error(t((error as Error).message));
		}
	};

	let onSignOut = async () => {
		try {
			await BoApi.onSignOut();

			setAuth(initialAuth);
			navigate(`/${path.login.root}`);
			message.success(t("System.Label_LogoutSuccess"));
		} catch (error) {
			message.error(t((error as Error).message));
		}
	};

	let onChangePassword = async ({
		oldPassword,
		newPassword
	}: {
		oldPassword: string;
		newPassword: string;
	}) => {
		try {
			await BoApi.onChangePassword({
				oldPassword,
				newPassword
			});

			setAuth(initialAuth);
			navigate(`/${path.login.root}`);
			message.success(t("System.Label_ChangePasswordSuccess"));
		} catch (error) {
			message.error(t((error as Error).message));
		}
	};

	let onFetchUserAllowedRoles = async () => {
		const menuList = await BoApi.getUserMenu();

		let _userAllowedRoles: UserAllowedRole[] = [];

		const mapping = (_menuList: UserMenuState[]) => {
			_menuList.forEach(({ funcKey, childs }) => {
				if (funcKey) {
					_userAllowedRoles.push({
						funcKey,
						isView: true,
						isEdit: true
					});
				}

				if (childs?.length) {
					mapping(childs);
				}
			});

			return _menuList;
		};

		if (menuList.length > 0) {
			mapping(menuList);
		}

		setUserAllowedRoles(_userAllowedRoles);
	};

	let value = {
		auth,
		userAllowedRoles,
		onSignIn,
		onSignOut,
		onCheckSignIn,
		onChangePassword,
		onFetchUserAllowedRoles
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };

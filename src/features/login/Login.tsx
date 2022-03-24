import { Button, Card, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useAuth } from "hooks";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Wrapper = styled.div`
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #f5f5f5;
`;

export interface LocationState {
	state: {
		from: {
			pathname: string;
		};
	};
}

const Login = () => {
	const { t } = useTranslation();

	const { onSignIn } = useAuth();

	const [userName, setUserName] = useState<string>("");
	const [userPassword, setUserPassword] = useState<string>("");

	const handleLogin = () => {
		onSignIn(userName, userPassword);
	};

	return (
		<Wrapper>
			<Card
				title={t("Login.Label_WelcomeBack")}
				style={{ width: "400px", margin: "4px" }}>
				<Form
					layout="vertical"
					className="login-form"
					initialValues={{ remember: true }}
					onFinish={handleLogin}>
					<Form.Item
						label={t("Login.Label_UserName")}
						name="username"
						rules={[
							{ required: true, message: "Please input your Username!" }
						]}>
						<Input
							value={userName}
							onChange={event => setUserName(event.target.value)}
							prefix={<UserOutlined className="site-form-item-icon" />}
							placeholder="Username"
						/>
					</Form.Item>
					<Form.Item
						label={t("Login.Label_Password")}
						name="password"
						rules={[
							{ required: true, message: "Please input your Password!" }
						]}>
						<Input
							value={userPassword}
							onChange={event => setUserPassword(event.target.value)}
							prefix={<LockOutlined className="site-form-item-icon" />}
							type="password"
							placeholder="Password"
						/>
					</Form.Item>

					<Form.Item>
						<Button
							block
							type="primary"
							htmlType="submit"
							className="login-form-button">
							{t("Login.Label_SignIn")}
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</Wrapper>
	);
};

export { Login };

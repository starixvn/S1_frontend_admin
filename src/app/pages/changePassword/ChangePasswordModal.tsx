import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, Modal } from "antd";
import { ModalState, useAuth } from "hooks";
import { LockOutlined } from "@ant-design/icons";

const ChangePasswordModal: FC<ModalState> = modal => {
	const { t } = useTranslation();
	const auth = useAuth();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean | undefined>();

	const handleChangePassword = async () => {
		setLoading(true);

		form.validateFields().then(() => {
			const { oldPassword, newPassword } = form.getFieldsValue();

			auth.onChangePassword({ oldPassword, newPassword });
		});

		setLoading(false);
	};

	useEffect(() => {
		if (!modal.visible) {
			form.resetFields();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modal.visible]);

	return (
		<Modal
			title={t("ChangePassword.Label_ChangePassword")}
			visible={modal.visible}
			onOk={handleChangePassword}
			confirmLoading={loading}
			onCancel={modal.onCancel}>
			<Form form={form} noValidate layout="vertical" className="login-form">
				<Form.Item
					label={t("ChangePassword.Label_OldPassword")}
					name="oldPassword"
					rules={[
						{
							required: true,
							message: t("ChangePassword.Label_ErrorMessage_3")
						}
					]}>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder="Old Password"
					/>
				</Form.Item>
				<Form.Item
					label={t("ChangePassword.Label_NewPassword")}
					name="newPassword"
					rules={[
						{
							required: true,
							message: t("ChangePassword.Label_ErrorMessage_4")
						},
						{
							validator: () => {
								const { oldPassword, newPassword } = form.getFieldsValue();

								return oldPassword !== newPassword
									? Promise.resolve()
									: Promise.reject(
											new Error(t("ChangePassword.Label_ErrorMessage_1"))
									  );
							}
						}
					]}>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder="New Password"
					/>
				</Form.Item>
				<Form.Item
					label={t("ChangePassword.Label_ConfirmNewPassword")}
					name="confirmNewPassword"
					rules={[
						{
							required: true,
							message: t("ChangePassword.Label_ErrorMessage_5")
						},
						{
							validator: () => {
								const { newPassword, confirmNewPassword } =
									form.getFieldsValue();

								return newPassword === confirmNewPassword
									? Promise.resolve()
									: Promise.reject(
											new Error(t("ChangePassword.Label_ErrorMessage_2"))
									  );
							}
						}
					]}>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder="New Password"
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ChangePasswordModal;

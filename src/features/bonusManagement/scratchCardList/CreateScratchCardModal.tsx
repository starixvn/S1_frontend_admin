import React, { FC } from 'react'
import { Col, Form, FormInstance, InputNumber, Modal, Row } from 'antd'
import { useTranslation } from 'react-i18next'

interface ICreateScratchCardModalProps {
	loading: boolean
	visible: boolean
	onFinish: () => void
	onCancel: () => void
	form: FormInstance
}

const CreateScratchCardModal: FC<ICreateScratchCardModalProps> = ({
	loading,
	visible,
	onCancel,
	onFinish,
	form,
}) => {
	const { t } = useTranslation()
	return (
		<Modal
			visible={visible}
			okText={t('Label_Save')}
			cancelText={t('Label_Cancel')}
			title={
				<div style={{ textAlign: 'center' }}>
					{`${t('Label_Generate')} ${t('Label_ScratchCard')}`}
				</div>
			}
			onCancel={onCancel}
			onOk={onFinish}
			confirmLoading={loading}
		>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					num: 1,
				}}
			>
				<Row>
					<Col lg={12} md={12} xs={24}>
						<Form.Item
							name='num'
							label={t('Label_Number')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Number'),
									}),
								},
								{
									// 必須是大於零的整數
									pattern: /^\+?[1-9]\d*$/,
									message: t('Label_GreaterThanZero'),
								},
							]}
						>
							<InputNumber style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

export { CreateScratchCardModal }

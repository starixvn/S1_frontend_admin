import { Col, Form, FormInstance, Input, Modal, Row, Select } from 'antd'
import { IGetFuncKeysListData } from 'features/reasonManagement/type'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface ICreateReasonModalProps {
	loading: boolean
	visible: boolean
	onFinish: () => void
	onCancel: () => void
	form: FormInstance
	funcKeysList: IGetFuncKeysListData[]
}

const { Option } = Select

const CreateReasonModal = ({
	loading,
	visible,
	onFinish,
	onCancel,
	form,
	funcKeysList,
}: ICreateReasonModalProps) => {
	const { t } = useTranslation()
	return (
		<Modal
			open={visible}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_AddNewReason')}</div>
			}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={onFinish}
		>
			<Form layout='vertical' size='middle' form={form}>
				<Row>
					<Col span={24}>
						<Form.Item
							name='funcKey'
							label={t('Label_FuncKey')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_FuncKey'),
									}),
								},
							]}
						>
							<Select placeholder={t('Label_Select')}>
								{funcKeysList?.map(key => (
									<Option key={key.funcKey} value={key.funcKey}>
										{key.funcKey}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Form.Item
							name='description'
							label={t('Label_Description')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Description'),
									}),
								},
							]}
						>
							<Input />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

export { CreateReasonModal }

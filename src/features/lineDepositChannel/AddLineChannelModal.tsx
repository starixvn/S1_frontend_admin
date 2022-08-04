import React, { FC, useEffect } from 'react'
import {
	Col,
	Form,
	FormInstance,
	Input,
	Modal,
	Row,
	Select,
	Switch,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { Currency } from 'common/enum/type'
import { head } from 'lodash'

interface IAddLineChannelModalProps {
	loading: boolean
	visible: boolean
	success: boolean
	onFinish: () => void
	onCancel: () => void
	form: FormInstance
	currencyListBySite: Currency[]
	setAddLineChannelSuccess: React.Dispatch<React.SetStateAction<boolean>>
}

const { Option } = Select

const AddLineChannelModal: FC<IAddLineChannelModalProps> = ({
	loading,
	visible,
	onFinish,
	onCancel,
	form,
	success,
	currencyListBySite,
	setAddLineChannelSuccess,
}) => {
	const { t } = useTranslation()

	useEffect(() => {
		if (!visible || success) {
			form.resetFields()
			setAddLineChannelSuccess(false)
		}
	}, [visible, success])
	return (
		<Modal
			visible={visible}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_AddLineChannel')}</div>
			}
			okText={t('Label_Save')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={onFinish}
		>
			<Form
				layout='vertical'
				size='middle'
				form={form}
				initialValues={{
					currencyId: head(currencyListBySite)?.currencyId,
					link: '',
					status: false,
				}}
			>
				<Row gutter={16}>
					<Col lg={3} md={4}>
						<Form.Item
							name='status'
							label={t('Label_Status')}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					</Col>
					<Col lg={21} md={20}>
						<Form.Item
							name='currencyId'
							label={t('Label_Currency')}
							rules={[
								{
									required: true,
									message: t('Label_Required', { key: t('Label_Currency') }),
								},
							]}
						>
							<Select placeholder={t('Label_Currency')}>
								{currencyListBySite?.map(({ currencyId, isoCode }) => (
									<Option key={currencyId} value={currencyId}>
										{isoCode}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					name='link'
					label={t('Label_Link')}
					rules={[
						{
							required: true,
							message: t('Label_Required', { key: t('Label_Link') }),
						},
					]}
				>
					<Input placeholder={t('Label_Link')} />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export { AddLineChannelModal }

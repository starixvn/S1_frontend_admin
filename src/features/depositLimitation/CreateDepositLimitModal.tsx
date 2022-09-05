import React, { FC, useEffect } from 'react'
import { Form, FormInstance, InputNumber, Modal, Switch } from 'antd'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'

interface ICreateDepositLimitProps {
	form: FormInstance
	loading: boolean
	visible: boolean
	onFinish: () => void
	onCancel: () => void
}

const CreateDepositLimitModal: FC<ICreateDepositLimitProps> = ({
	form,
	loading,
	visible,
	onFinish,
	onCancel,
}) => {
	const { t } = useTranslation()
	const initData = [
		{
			vipLevel: 0,
		},
	]

	const columns = [
		{
			title: '',
			children: [
				{
					title: t('Label_PointLevel'),
					width: 80,
					align: 'center' as 'center',
					render: () => (
						<Form.Item
							name='vipLevel'
							style={{ margin: 0 }}
							rules={[
								{
									required: true,
									message: '',
								},
							]}
						>
							<InputNumber
								style={{ width: '100%' }}
								controls={false}
								type='number'
							/>
						</Form.Item>
					),
				},
			],
		},
		{
			title: t('Label_OnlineBanking'),
			children: [
				{
					title: t('Label_Status'),
					key: 'onlineBankingStatus',
					width: 80,
					align: 'center' as 'center',
					render: () => (
						<Form.Item
							name='onlineBankingStatus'
							style={{ margin: 0 }}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					),
				},
				{
					title: t('Label_Min'),
					width: 100,
					align: 'center' as 'center',
					key: 'onlineBankingMin',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='onlineBankingMin'
							style={{ margin: 0 }}
							rules={[
								{
									required: true,
									message: '',
								},
							]}
						>
							<InputNumber
								style={{ width: '100%' }}
								controls={false}
								type='number'
							/>
						</Form.Item>
					),
				},
				{
					title: t('Label_Max'),
					width: 100,
					align: 'center' as 'center',
					key: 'onlineBankingMax',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='onlineBankingMax'
							style={{ margin: 0 }}
							rules={[
								{
									required: true,
									message: '',
								},
							]}
						>
							<InputNumber
								style={{ width: '100%' }}
								controls={false}
								type='number'
							/>
						</Form.Item>
					),
				},
			],
		},
		{
			title: t('Label_MobilePay'),
			children: [
				{
					title: t('Label_Status'),
					key: 'mobilePayStatus',
					width: 80,
					align: 'center' as 'center',
					render: () => (
						<Form.Item
							name='mobilePayStatus'
							style={{ margin: 0 }}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					),
				},
				{
					title: t('Label_Min'),
					width: 100,
					align: 'center' as 'center',
					key: 'mobilePayMin',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='mobilePayMin'
							style={{ margin: 0 }}
							rules={[
								{
									required: true,
									message: '',
								},
							]}
						>
							<InputNumber
								style={{ width: '100%' }}
								controls={false}
								type='number'
							/>
						</Form.Item>
					),
				},
				{
					title: t('Label_Max'),
					width: 100,
					align: 'center' as 'center',
					key: 'mobilePayMax',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='mobilePayMax'
							style={{ margin: 0 }}
							rules={[
								{
									required: true,
									message: '',
								},
							]}
						>
							<InputNumber
								style={{ width: '100%' }}
								controls={false}
								type='number'
							/>
						</Form.Item>
					),
				},
			],
		},
		{
			title: t('Label_LocalBanking'),
			children: [
				{
					title: t('Label_Status'),
					key: 'localBankingStatus',
					width: 80,
					align: 'center' as 'center',
					render: () => (
						<Form.Item
							name='localBankingStatus'
							style={{ margin: 0 }}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					),
				},
				{
					title: t('Label_Min'),
					width: 100,
					align: 'center' as 'center',
					key: 'localBankingMin',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='localBankingMin'
							style={{ margin: 0 }}
							rules={[
								{
									required: true,
									message: '',
								},
							]}
						>
							<InputNumber
								style={{ width: '100%' }}
								controls={false}
								type='number'
							/>
						</Form.Item>
					),
				},
				{
					title: t('Label_Max'),
					width: 100,
					align: 'center' as 'center',
					key: 'localBankingMax',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='localBankingMax'
							style={{ margin: 0 }}
							rules={[
								{
									required: true,
									message: '',
								},
							]}
						>
							<InputNumber
								style={{ width: '100%' }}
								controls={false}
								type='number'
							/>
						</Form.Item>
					),
				},
			],
		},
	]

	useEffect(() => {
		if (!visible) {
			form.resetFields()
		}
	}, [visible])

	return (
		<Modal
			visible={visible}
			title={
				<div style={{ textAlign: 'center' }}>
					{t('Label_CreateDepositLimit')}
				</div>
			}
			okText={t('Label_Save')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={onFinish}
			width='70vw'
		>
			<Form
				form={form}
				component={false}
				// 其他都是 required值 , 所以只有這三個給預設
				initialValues={{
					localBankingStatus: false,
					mobilePayStatus: false,
					onlineBankingStatus: false,
				}}
			>
				<Table
					loading={loading}
					pagination={false}
					size='middle'
					columns={columns}
					dataSource={initData}
				/>
			</Form>
		</Modal>
	)
}

export { CreateDepositLimitModal }

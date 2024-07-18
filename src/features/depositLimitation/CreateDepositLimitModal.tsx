import React, { FC, useEffect } from 'react'
import { Form, FormInstance, InputNumber, Modal, Switch } from 'antd'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { isNumber } from 'lodash'

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
					width: 100,
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
								{
									type: 'number',
									min: 0,
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
					width: 100,
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
					width: 80,
					align: 'center' as 'center',
					key: 'onlineBankingMin',
					innerWidth: 200,
					render: () => {
						return (
							<Form.Item
								name='onlineBankingMin'
								style={{ margin: 0 }}
								rules={[
									({ getFieldValue }) => ({
										validator(_, value) {
											// getFieldValue('password')
											if (!isNumber(getFieldValue('onlineBankingMax')))
												return Promise.resolve()
											if (value && isNumber(getFieldValue('onlineBankingMax')))
												return Promise.resolve()

											return Promise.reject(new Error(''))
										},
									}),
									{
										type: 'number',
										min: 0,
										message: '',
									},
								]}
							>
								<InputNumber controls={false} type='number' />
							</Form.Item>
						)
					},
				},
				{
					title: t('Label_Max'),
					width: 140,
					align: 'center' as 'center',
					key: 'onlineBankingMax',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='onlineBankingMax'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('onlineBankingMin')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('onlineBankingMin')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
					width: 100,
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
					width: 80,
					align: 'center' as 'center',
					key: 'mobilePayMin',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='mobilePayMin'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('mobilePayMax')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('mobilePayMax')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
					width: 140,
					align: 'center' as 'center',
					key: 'mobilePayMax',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='mobilePayMax'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('mobilePayMin')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('mobilePayMin')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
					width: 100,
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
					width: 80,
					align: 'center' as 'center',
					key: 'localBankingMin',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='localBankingMin'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('localBankingMax')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('localBankingMax')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
					width: 140,
					align: 'center' as 'center',
					key: 'localBankingMax',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='localBankingMax'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('localBankingMin')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('localBankingMin')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
			title: t('Label_QuickTransfer'),
			children: [
				{
					title: t('Label_Status'),
					key: 'quickTransferStatus',
					width: 100,
					align: 'center' as 'center',
					render: () => (
						<Form.Item
							name='quickTransferStatus'
							style={{ margin: 0 }}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					),
				},
				{
					title: t('Label_Min'),
					width: 80,
					align: 'center' as 'center',
					key: 'quickTransferMin',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='quickTransferMin'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('quickTransferMax')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('quickTransferMax')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
					width: 140,
					align: 'center' as 'center',
					key: 'quickTransferMax',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='quickTransferMax'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('quickTransferMin')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('quickTransferMin')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
			title: t('Label_CryptoPay'),
			children: [
				{
					title: t('Label_Status'),
					key: 'cryptoPayStatus',
					width: 100,
					align: 'center' as 'center',
					render: () => (
						<Form.Item
							name='cryptoPayStatus'
							style={{ margin: 0 }}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					),
				},
				{
					title: t('Label_Min'),
					width: 80,
					align: 'center' as 'center',
					key: 'cryptoPayMin',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='cryptoPayMin'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('cryptoPayMax')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('cryptoPayMax')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
					width: 140,
					align: 'center' as 'center',
					key: 'cryptoPayMax',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='cryptoPayMax'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('cryptoPayMin')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('cryptoPayMin')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
			title: t('Label_LoadCard'),
			children: [
				{
					title: t('Label_Status'),
					key: 'loadCardStatus',
					width: 100,
					align: 'center' as 'center',
					render: () => (
						<Form.Item
							name='loadCardStatus'
							style={{ margin: 0 }}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					),
				},
				{
					title: t('Label_Min'),
					width: 80,
					align: 'center' as 'center',
					key: 'loadCardMin',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='loadCardMin'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('loadCardMax')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('loadCardMax')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
					width: 140,
					align: 'center' as 'center',
					key: 'loadCardMax',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='loadCardMax'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('loadCardMin')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('loadCardMin')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
			title: t('Label_Auto_Deposit'),
			children: [
				{
					title: t('Label_Status'),
					key: 'bankAutoChannelStatus',
					width: 100,
					align: 'center' as 'center',
					render: () => (
						<Form.Item
							name='bankAutoChannelStatus'
							style={{ margin: 0 }}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					),
				},
				{
					title: t('Label_Min'),
					width: 80,
					align: 'center' as 'center',
					key: 'bankAutoChannelMin',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='bankAutoChannelMin'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('bankAutoChannelMax')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('bankAutoChannelMax')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
					width: 140,
					align: 'center' as 'center',
					key: 'bankAutoChannelMax',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='bankAutoChannelMax'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('bankAutoChannelMin')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('bankAutoChannelMin')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
			title: t('Label_CryptoWallet'),
			children: [
				{
					title: t('Label_Status'),
					key: 'cryptoWalletStatus',
					width: 100,
					align: 'center' as 'center',
					render: () => (
						<Form.Item
							name='cryptoWalletStatus'
							style={{ margin: 0 }}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					),
				},
				{
					title: t('Label_Min'),
					width: 80,
					align: 'center' as 'center',
					key: 'cryptoWalletMin',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='cryptoWalletMin'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('cryptoWalletMax')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('cryptoWalletMax')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
					width: 140,
					align: 'center' as 'center',
					key: 'cryptoWalletMax',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='cryptoWalletMax'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('cryptoWalletMin')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('cryptoWalletMin')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
			title: t('Label_ChatTransfer'),
			children: [
				{
					title: t('Label_Status'),
					key: 'chatTransferStatus',
					width: 100,
					align: 'center' as 'center',
					render: () => (
						<Form.Item
							name='chatTransferStatus'
							style={{ margin: 0 }}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					),
				},
				{
					title: t('Label_Min'),
					width: 80,
					align: 'center' as 'center',
					key: 'chatTransferMin',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='chatTransferMin'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('chatTransferMax')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('chatTransferMax')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
					width: 140,
					align: 'center' as 'center',
					key: 'chatTransferMax',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='chatTransferMax'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('chatTransferMin')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('chatTransferMin')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
			title: t('Label_Qr_Pay'),
			children: [
				{
					title: t('Label_Status'),
					key: 'qrPayStatus',
					width: 100,
					align: 'center' as 'center',
					render: () => (
						<Form.Item
							name='qrPayStatus'
							style={{ margin: 0 }}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					),
				},
				{
					title: t('Label_Min'),
					width: 80,
					align: 'center' as 'center',
					key: 'qrPayMin',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='qrPayMin'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('qrPayMax')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('qrPayMax')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
					width: 140,
					align: 'center' as 'center',
					key: 'qrPayMax',
					innerWidth: 200,
					render: () => (
						<Form.Item
							name='qrPayMax'
							style={{ margin: 0 }}
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!isNumber(getFieldValue('qrPayMin')))
											return Promise.resolve()
										if (value && isNumber(getFieldValue('qrPayMin')))
											return Promise.resolve()

										return Promise.reject(new Error(''))
									},
								}),
								{
									type: 'number',
									min: 0,
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
			open={visible}
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
				// 其他都是 required值
				initialValues={{
					localBankingStatus: false,
					mobilePayStatus: false,
					onlineBankingStatus: false,
					quickTransferStatus: false,
					cryptoPayStatus: false,
					loadCardStatus: false,
					bankAutoChannelStatus: false,
					cryptoWalletStatus: false,
					chatTransferStatus: false,
					qrPayStatus: false,
				}}
			>
				<Table
					loading={loading}
					pagination={false}
					size='middle'
					columns={columns}
					dataSource={initData}
					scroll={{ x: 'max-content' }}
				/>
			</Form>
		</Modal>
	)
}

export { CreateDepositLimitModal }

import React, { FC, useEffect, useState } from 'react'
import {
	IGetEnumData,
	SupportChannelEnum,
} from 'features/bankCardManagement/type'
import {
	Button,
	Col,
	Form,
	FormInstance,
	Input,
	InputNumber,
	message,
	Modal,
	Row,
	Select,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { Currency } from 'common/enum/type'
import { MultipleSelect } from 'components/Select'
import { IVipLevelsData } from 'common/service/allDataApi'
import { useGetQrCodeUrlMutation } from 'features/bankCardManagement/api'
import { UploadOutlined } from '@ant-design/icons'
import { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { RcFile } from 'antd/es/upload'
import { includes, isNull } from 'lodash'
import { StyleUpload } from 'features/bankCardManagement/StyleUpload'

interface IEditBankCardModal {
	loading: boolean
	form: FormInstance
	visible: boolean
	onFinish: () => void
	onCancel: () => void
	currencyListBySite: Currency[]
	vipLevelList: IVipLevelsData[]
	statusEnumList: IGetEnumData[]
	supportChannelsList: IGetEnumData[]
	pointLevelList: number[]
}

const { Option } = Select

const EditBankCardModal: FC<IEditBankCardModal> = ({
	loading,
	form,
	visible,
	onFinish,
	onCancel,
	currencyListBySite,
	vipLevelList,
	statusEnumList,
	pointLevelList,
	supportChannelsList,
}) => {
	const { t } = useTranslation()
	const [getQrCodeUrl] = useGetQrCodeUrlMutation()
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const supportChannels = Form.useWatch('supportChannels', form)

	// 上傳 QRCode 將Url 填入 form表單
	const handleUploadQrCode = async (formData: FormData) => {
		try {
			const { data } = await getQrCodeUrl(formData).unwrap()
			const { qrCodeUrl } = data

			if (isNull(qrCodeUrl)) {
				// manual Error , erase FileList
				message.error(t('Label_QrCodeErrorMsg'))
				setFileList([])
			} else {
				form.setFieldsValue({
					qrCodeUrl,
				})
			}
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
			// throw error 回去 uploader 元件 , 觸發 error status
			throw error
		}
	}

	const uploadProps: UploadProps = {
		accept: 'image/*',
		maxCount: 1,
		fileList,
		beforeUpload: () => false,
		onRemove: () => {
			setFileList([])
			form.setFieldsValue({
				qrCodeUrl: null,
			})
		},
		onPreview: () => false,
		// 上傳行為處理在此
		onChange: async ({ fileList: [file] }) => {
			// uploading 狀態
			file.status = 'uploading'
			setFileList([file])
			try {
				const formData = new FormData()
				formData.append('File', file.originFileObj as RcFile)
				await handleUploadQrCode(formData)
				file.status = 'done'
			} catch (error) {
				// 清空 list
				setFileList([])
			}
		},
	}

	const vipLevelSelector = () => {
		const handleChangeVipLevel = (newVipLevels: Array<number | string>) => {
			if (newVipLevels.includes('all')) {
				form.setFieldsValue({
					vipLevels: vipLevelList?.map(item => item.level),
				})
			} else {
				form.setFieldsValue({
					vipLevels: newVipLevels,
				})
			}
		}

		return (
			<Form.Item
				name='vipLevels'
				label={t('Label_VipLevel')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_VipLevel'),
						}),
					},
				]}
			>
				<MultipleSelect
					onChange={handleChangeVipLevel}
					placeholder={t('Label_Select') + t('Label_VipLevel')}
				>
					{(vipLevelList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{vipLevelList?.map(item => (
						<Option key={item.level} value={item.level}>
							{item.levelName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const pointLevelSelector = () => {
		const handleChangePointLevel = (newPointLevels: Array<number | string>) => {
			if (newPointLevels.includes('all')) {
				form.setFieldsValue({
					pointLevels: pointLevelList?.map(pointLevel => pointLevel),
				})
			} else {
				form.setFieldsValue({
					pointLevels: newPointLevels,
				})
			}
		}

		return (
			<Form.Item
				name='pointLevels'
				label={t('Label_PointLevel')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_PointLevel'),
						}),
					},
				]}
			>
				<MultipleSelect
					onChange={handleChangePointLevel}
					placeholder={t('Label_Select') + t('Label_PointLevel')}
				>
					{(pointLevelList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{pointLevelList?.map(pointLevel => (
						<Option key={pointLevel} value={pointLevel}>
							{pointLevel}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const supportChannelSelector = () => {
		const handleChangeSupportChannel = (newChannel: Array<number | string>) => {
			if (newChannel.includes('all')) {
				form.setFieldsValue({
					supportChannels: supportChannelsList?.map(channel => channel.value),
				})
			} else {
				form.setFieldsValue({
					supportChannels: newChannel,
				})
			}
		}

		return (
			<Form.Item
				name='supportChannels'
				label={t('Label_SupportChannels')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_SupportChannels'),
						}),
					},
				]}
			>
				<MultipleSelect
					onChange={handleChangeSupportChannel}
					placeholder={t('Label_Select') + t('Label_SupportChannels')}
				>
					{(supportChannelsList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{supportChannelsList?.map(channel => (
						<Option key={channel.value} value={channel.value}>
							{channel.name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	useEffect(() => {
		if (!visible) {
			setFileList([])
		}
	}, [visible])

	return (
		<Modal
			visible={visible}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_EditBankCard')}</div>
			}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={onFinish}
		>
			<Form layout='vertical' size='middle' form={form}>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='currency' label={t('Label_Currency')}>
							<Select disabled>
								{currencyListBySite?.map(currency => (
									<Option key={currency.currencyId} value={currency.currencyId}>
										{currency.isoCode}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='bankName' label={t('Label_Bank')}>
							<Input disabled />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='accountName' label={t('Label_AccountName')}>
							<Input disabled />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='accountNo' label={t('Label_AccountNo')}>
							<Input disabled />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='minAmount'
							label={t('Label_MinAmount')}
							extra={t('Label_ZeroIsNotChecked')}
						>
							<InputNumber style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='maxAmount'
							label={t('Label_MaxAmount')}
							extra={t('Label_ZeroIsNotChecked')}
						>
							<InputNumber style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='dailyLimitAmount'
							label={t('Label_DailyLimitAmount')}
							extra={t('Label_ZeroIsNotChecked')}
						>
							<InputNumber style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='purpose' label={t('Label_Purposes')}>
							<Input disabled />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={24}>{vipLevelSelector()}</Col>
					<Col span={24}>{pointLevelSelector()}</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='status' label={t('Label_Status')}>
							<Select>
								{statusEnumList?.map(status => (
									<Option key={status.value} value={status.value}>
										{status.name}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='sort' label={t('Label_Sort')}>
							<InputNumber style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>{supportChannelSelector()}</Col>
					<Col span={12}>
						<Form.Item label={t('Label_Upload', { key: t('Label_BankQR') })}>
							<StyleUpload {...uploadProps}>
								<Button icon={<UploadOutlined />}>
									{t('Label_Upload', { key: t('Label_File') })}
								</Button>
							</StyleUpload>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={24}>
						{/* 僅用來讓用戶檢視上傳的 qrcode 連結正確與否和驗證表單 ,有選 eWallet才必填 */}
						<Form.Item
							name='qrCodeUrl'
							label={t('Label_QrCodeUrl')}
							rules={[
								{
									required: includes(
										supportChannels,
										SupportChannelEnum.EWallet
									),
									message: t('Label_Required', {
										key: t('Label_QrCodeUrl'),
									}),
								},
							]}
						>
							<Input disabled />
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Form.Item name='memo' label={t('Label_Memo')}>
							<Input.TextArea />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

export { EditBankCardModal }

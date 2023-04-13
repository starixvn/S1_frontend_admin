import {
	Button,
	Checkbox,
	Col,
	Form,
	FormInstance,
	Input,
	Modal,
	Row,
	Select,
	Space,
	Spin,
} from 'antd'
import { IEditForm, IMessageDetailData } from 'features/smsGenerator/type'
import { first } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { Currency } from 'common/enum/type'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { useGetLanguageListQuery } from 'common/service/permissionApi/api'
import { useGetMessageDetailQuery } from 'features/smsGenerator/api'
import {
	accountStatusList,
	MethodEnum,
	methodList,
} from 'features/smsGenerator/constants'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { StyleUpload } from 'features/bankCardManagement/StyleUpload'
import { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { normFileForFormImageItem } from 'common/utils/image'
import { xlsxMimeType } from 'features/balanceAdjustment/balanceAdjustment/BalanceAdjustmentForm'
import { Link } from 'react-router-dom'
import { MessageTabs } from 'features/smsGenerator/messageModal/MessageTabs'
import { useEffect } from 'react'
import { messagesResConverter } from 'features/smsGenerator/utils'
import { PermissionInterface } from 'type'

interface ISetMessageModalProps {
	open: boolean
	form: FormInstance<IEditForm>
	loading: boolean
	currencyListBySite: Currency[]
	editPermission?: PermissionInterface
	onCancel: () => void
	onFinish: (isAdd: boolean) => void
}

const { Option } = Select

const SetMessageModal = ({
	open,
	form,
	loading,
	currencyListBySite,
	editPermission,
	onCancel,
	onFinish,
}: ISetMessageModalProps) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const batchId = form.getFieldValue(['batchId'])
	const formMethod = Form.useWatch('method', form)
	const formCurrencyId = Form.useWatch('currencyId', form)
	const formFileList = Form.useWatch<UploadFile[]>('fileList', form)
	const isAdd = batchId === 'Add'

	// 每次開都重撈資料
	const {
		data: { data: messageDetail } = {} as IAxiosResponse<IMessageDetailData>,
		isFetching: isGetMessageDetailLoading,
	} = useGetMessageDetailQuery(
		{
			batchId,
		},
		{
			skip: isAdd || !batchId,
			refetchOnMountOrArgChange: true,
		}
	)

	// 編輯時拿 messageDetail 裡的 currencyId 新增時拿用戶選得的 formCurrencyId
	const currencyIdSelected = !formCurrencyId
		? messageDetail?.currencyId
		: formCurrencyId

	const { data: { data: langCodes = [] } = {} } = useGetLanguageListQuery(
		{
			siteId,
			currencyId:
				formMethod === MethodEnum.BatchUpload ? 0 : currencyIdSelected,
		},
		{
			skip:
				// currencyIdSelected 有可能是0 必須帶 undefined
				currencyIdSelected === undefined &&
				formMethod !== MethodEnum.BatchUpload,
		}
	)

	const uploadProps: UploadProps = {
		onRemove: () => {
			form.setFieldsValue({
				fileList: [],
			})
		},
		accept: xlsxMimeType,
		maxCount: 1,
		beforeUpload: file => {
			form.setFieldsValue({
				fileList: [file],
			})
			return false
		},
		fileList: formFileList,
	}

	useEffect(() => {
		if (!isGetMessageDetailLoading && !isAdd && open) {
			const { isPopup, message } = messageDetail ?? {}
			const result = messagesResConverter(message)
			form.setFieldsValue({
				isPopup,
			})
			result.forEach(item => {
				// 這裡因為後端結構
				const { key, Title, Content, PopupMessage } = item ?? {}
				form.setFieldsValue({
					messages: {
						[key]: {
							Title,
							Content,
							PopupMessage,
						},
					},
				})
			})
		}
	}, [isGetMessageDetailLoading, open])

	return (
		<Modal
			title={isAdd ? t('Label_SendMessage') : t('Label_EditMessage')}
			open={open}
			onCancel={onCancel}
			onOk={() => onFinish(isAdd)}
			width='60vw'
			confirmLoading={loading}
			// 這裡之所以又要 afterClose 又要destroyOnClose 原因在於這個 modal 內有很多 tinyEditor 的 tab , 關閉時直接 destroy掉整個元件避免一些無法預期的錯誤
			// 且為了正確觸發 form 的初始化，故每次關閉便移除整個元件
			afterClose={() => form.resetFields()}
			destroyOnClose
			// 沒編輯權限則關閉 footer submit button
			footer={
				editPermission?.canUse
					? [
							<Button key='back' onClick={onCancel}>
								{t('Label_Cancel')}
							</Button>,
							<Button
								key='submit'
								type='primary'
								loading={loading}
								onClick={() => onFinish(isAdd)}
							>
								{t('Label_Submit')}
							</Button>,
					  ]
					: null
			}
		>
			{/* 新增 */}
			{isAdd && (
				<Form
					form={form}
					layout='vertical'
					initialValues={{
						method: MethodEnum.ByUserStatus,
						isPopup: false,
						currencyId: first(currencyListBySite)?.currencyId,
					}}
					disabled={!editPermission?.canUse}
				>
					<Row gutter={16} align='middle'>
						<Col lg={8} md={24} xs={24}>
							<Form.Item
								name='method'
								label={t('Label_MethodType')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_MethodType'),
										}),
									},
								]}
							>
								<Select placeholder={t('Label_Select') + t('Label_MethodType')}>
									{methodList.map(({ value, displayName }) => (
										<Option key={value} value={value}>
											{t(displayName)}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						{formMethod === MethodEnum.ByUserStatus ? (
							<Col lg={8} md={24} xs={24}>
								<Form.Item
									name='currencyId'
									label={
										<Space align='center' size='middle'>
											{t('Label_Currency')}
											<Form.Item name='isPopup' noStyle valuePropName='checked'>
												<Checkbox>{t('Label_Popup')}</Checkbox>
											</Form.Item>
										</Space>
									}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Currency'),
											}),
										},
									]}
								>
									<Select placeholder={t('Label_Select') + t('Label_Currency')}>
										{currencyListBySite.map(({ currencyId, isoCode }) => (
											<Option key={currencyId} value={currencyId}>
												{isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						) : (
							<Col lg={8} md={24} xs={24}>
								<Form.Item name='isPopup' noStyle valuePropName='checked'>
									<Checkbox>{t('Label_Popup')}</Checkbox>
								</Form.Item>
							</Col>
						)}
					</Row>

					{formMethod === MethodEnum.ByUserStatus && (
						<Row gutter={16} align='middle'>
							<Col lg={8} md={24} xs={24}>
								<Form.Item
									name='accountStatus'
									label={t('Label_AccountStatus')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_AccountStatus'),
											}),
										},
									]}
								>
									<Select>
										{accountStatusList?.map(({ value, displayName }) => (
											<Option value={value} key={value}>
												{t(displayName)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
					)}
					{formMethod === MethodEnum.BatchUpload && (
						<Row gutter={16} align='middle'>
							<Col lg={8} md={24} xs={24}>
								<Form.Item
									name='fileList'
									valuePropName='fileList'
									getValueFromEvent={normFileForFormImageItem}
									label={
										<Space size='large'>
											{t('Label_Upload', { key: t('Label_File') })}
											<Link
												to='/exampleFile/PersonalMessageTemplateFile.xlsx'
												download='PersonalMessageTemplateFile.xlsx'
												target='_blank'
											>
												<DownloadOutlined />
												{t('Label_TemplateFile')}
											</Link>
										</Space>
									}
								>
									<StyleUpload {...uploadProps}>
										<Button icon={<UploadOutlined />}>
											{t('Label_Upload', { key: t('Label_File') })}
										</Button>
									</StyleUpload>
								</Form.Item>
							</Col>
						</Row>
					)}
				</Form>
			)}
			{/* 編輯模式 */}
			{!isAdd && (
				<Spin spinning={isGetMessageDetailLoading}>
					<Form
						form={form}
						layout='vertical'
						disabled={!editPermission?.canUse}
					>
						<Row gutter={16} align='middle'>
							<Col lg={8} md={24} xs={24}>
								<Form.Item
									name='batchId'
									label={
										<Space align='center' size='middle'>
											{t('Label_BatchId')}
											<Form.Item name='isPopup' noStyle valuePropName='checked'>
												<Checkbox>{t('Label_Popup')}</Checkbox>
											</Form.Item>
										</Space>
									}
								>
									<Input disabled />
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Spin>
			)}
			{/* 訊息編輯 Tab */}
			{langCodes?.length > 0 && (
				<MessageTabs
					langCodes={langCodes}
					form={form}
					editPermission={editPermission}
				/>
			)}
		</Modal>
	)
}

export { SetMessageModal }

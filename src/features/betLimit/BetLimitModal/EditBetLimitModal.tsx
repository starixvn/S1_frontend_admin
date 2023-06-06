import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import {
	Col,
	Row,
	Form,
	Spin,
	Input,
	Modal,
	Select,
	Button,
	Switch,
	message,
	Space,
	FormInstance,
	Table,
} from 'antd'
import { InputNumber } from 'components'
import { PermissionInterface } from 'type'
import { useAppSelector } from 'app/store'
import { selectUserSite, selectCurrencyListBySite } from 'common/enum'
import {
	useLazyGetByCustIdQuery,
	useLazyGetTpCategoryListQuery,
	useLazyGetCustInfoDetailsQuery,
} from 'features/betLimit/api'
import {
	IBetLimitTableData,
	IEditForm,
	IFormBetLimitTableData,
	IGameTypeBetLimit,
} from 'features/betLimit/type'
import { find, isEmpty } from 'lodash'

interface IEditBetLimitModalProps {
	form: FormInstance<IEditForm>
	isAdd: boolean
	isOpen: boolean
	editPermission?: PermissionInterface
	isSetBetLimitLoading: boolean
	onCancel: () => void
	onSetBetLimit: (list: IGameTypeBetLimit[] | undefined) => void
}

const EditBetLimitModal = ({
	form,
	isAdd,
	isOpen,
	editPermission,
	isSetBetLimitLoading,
	onCancel,
	onSetBetLimit,
}: IEditBetLimitModalProps) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { currencyId } = form.getFieldsValue(true)
	const currency = find(currencyListBySite, { currencyId })?.isoCode ?? 'N/A'
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [betLimitForm] = Form.useForm<IFormBetLimitTableData>()

	const [dataSource, setDataSource] = useState<
		IBetLimitTableData[] | undefined
	>(undefined)

	const [getByCustId, { isFetching: isGetByCustIdLoading }] =
		useLazyGetByCustIdQuery()

	const [getCustInfoDetails, { isFetching: isGetCustInfoDetailsFetching }] =
		useLazyGetCustInfoDetailsQuery()

	const [getTpCategoryList, { isFetching: isGetTpCategoryListFetching }] =
		useLazyGetTpCategoryListQuery()

	const onSearchBetLimit = async () => {
		try {
			let betLimitTableDataList: IBetLimitTableData[] = []

			if (isAdd) {
				const { userName } = form.getFieldsValue()

				const { data: custInfoDetail } = await getCustInfoDetails({
					siteId,
					userName,
				}).unwrap()

				const { data: tpBetLimitCategoryList } = await getTpCategoryList({
					siteId,
					currencyId: custInfoDetail.currencyId,
				}).unwrap()

				betLimitTableDataList = tpBetLimitCategoryList.map(
					({
						gameType: gameTypeId,
						gameTypeName,
						limitGroup: limitGroupOptions,
						isGroup,
						limitInput,
						categoryName: tpCategoryName,
						categoryId: tpCategory,
					}) => ({
						checked: false,
						gameTypeId,
						gameTypeName,
						limitGroupOptions,
						limitGroup: undefined,
						isGroup,
						limitInput,
						tpCategoryName,
						tpCategory,
					})
				)
			} else {
				const { custId } = form.getFieldsValue(true)

				const { data: tpCategoryList = [] } = await getTpCategoryList({
					siteId,
					currencyId,
				}).unwrap()

				const { data: custBetLimitData } = await getByCustId({
					custId,
				}).unwrap()

				const { betSetting } = custBetLimitData
				betLimitTableDataList = betSetting.map(
					({
						checked,
						gameTypeId,
						gameTypeName,
						limitGroup,
						min,
						max,
						maxPerMatch,
						tpCategoryName,
						tpCategory,
					}) => {
						const isGroup = Boolean(limitGroup)

						return {
							checked,
							gameTypeId,
							gameTypeName,
							limitGroupOptions: isGroup
								? find(tpCategoryList, { gameTypeName })?.limitGroup
								: undefined,
							limitGroup,
							isGroup,
							limitInput: max ? { min, max, maxPerMatch } : undefined,
							tpCategoryName,
							tpCategory,
						}
					}
				)
			}

			// * for render Table
			setDataSource(betLimitTableDataList)

			// * 透過 gameTypeName 當作 key 製作成 form object
			const betLimitFormResult: {
				[key: string]: IBetLimitTableData
			} = {}
			betLimitTableDataList.forEach(item => {
				betLimitFormResult[item.gameTypeName] = item
			})
			betLimitForm.setFieldsValue(betLimitFormResult)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('Label_NotExpectedServerError')
			)
		}
	}

	const handleBeforeSetBetLimit = async () => {
		const values: IFormBetLimitTableData = betLimitForm.getFieldsValue(true)

		const newBetLimit: IGameTypeBetLimit[] = Object.values(values).map(
			({
				isGroup,
				checked,
				tpCategory,
				tpCategoryName,
				gameTypeId,
				gameTypeName,
				limitGroupOptions,
				limitGroup,
				limitInput,
			}) => {
				return {
					checked,
					tpCategory,
					tpCategoryName,
					gameTypeId,
					gameTypeName,
					// * 分別格式化成 'limitGroup' or 'limitInput' 的送出格式
					...(isGroup
						? {
								limitGroup,
								limitRange: find(limitGroupOptions, { group: limitGroup })
									?.range,
						  }
						: {
								min: limitInput?.min,
								max: limitInput?.max,
								maxPerMatch: limitInput?.maxPerMatch,
						  }),
				}
			}
		)

		onSetBetLimit(newBetLimit)
	}

	// * 清空列表
	const onCloseModal = () => {
		setDataSource(undefined)
		form.resetFields()
		betLimitForm.resetFields()
	}

	// * 每次打開初次渲染 table
	useEffect(() => {
		if (isOpen && !isAdd) {
			onSearchBetLimit()
		}
	}, [isOpen])

	const loading =
		isGetByCustIdLoading ||
		isGetCustInfoDetailsFetching ||
		isGetTpCategoryListFetching ||
		isSetBetLimitLoading

	const columns = [
		{
			title: t('Label_Status'),
			key: 'checked',
			width: 60,
			align: 'center' as 'center',
			render: ({ gameTypeName }: IBetLimitTableData) => (
				<Form.Item name={[gameTypeName, 'checked']} valuePropName='checked'>
					<Switch disabled={!editPermission?.canUse} />
				</Form.Item>
			),
		},
		{
			title: t('Label_Category'),
			key: 'tpCategoryName',
			dataIndex: 'tpCategoryName',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Product'),
			key: 'gameTypeName',
			dataIndex: 'gameTypeName',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_LimitGroup'),
			width: 300,
			align: 'center' as 'center',
			editable: true,
			render: ({
				isGroup,
				limitGroupOptions = [],
				gameTypeName,
			}: IBetLimitTableData) => {
				return isGroup ? (
					<Form.Item
						name={[gameTypeName, 'limitGroup']}
						rules={[
							{
								required: true,
								message: '',
							},
						]}
					>
						<Select
							placeholder='select'
							style={{ width: '50%' }}
							disabled={!editPermission?.canUse}
						>
							{limitGroupOptions.map(({ group, range }) => (
								<Select.Option key={group} value={group}>
									{range}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				) : (
					<Space>
						<Form.Item
							style={{ margin: 0 }}
							name={[gameTypeName, 'limitInput', 'min']}
							label={t('Label_Min')}
							rules={[
								{
									required: true,
									message: '',
								},
								({ getFieldValue }) => ({
									validator(_, value) {
										if (
											value <=
											getFieldValue([gameTypeName, 'limitInput', 'max'])
										) {
											return Promise.resolve()
										}
										return Promise.reject(new Error(''))
									},
								}),
							]}
						>
							<InputNumber />
						</Form.Item>
						<Form.Item
							style={{ margin: 0 }}
							name={[gameTypeName, 'limitInput', 'max']}
							label={t('Label_Max')}
							rules={[
								{
									required: true,
									message: '',
								},
								({ getFieldValue }) => ({
									validator(_, value) {
										if (
											value >=
												getFieldValue([gameTypeName, 'limitInput', 'min']) &&
											value <=
												getFieldValue([
													gameTypeName,
													'limitInput',
													'maxPerMatch',
												])
										) {
											return Promise.resolve()
										}
										return Promise.reject(new Error(''))
									},
								}),
							]}
						>
							<InputNumber />
						</Form.Item>
						<Form.Item
							style={{ margin: 0 }}
							name={[gameTypeName, 'limitInput', 'maxPerMatch']}
							label={t('Label_MaxPerMatch')}
							rules={[
								{
									required: true,
									message: '',
								},
								({ getFieldValue }) => ({
									validator(_, value) {
										if (
											value >=
											getFieldValue([gameTypeName, 'limitInput', 'max'])
										) {
											return Promise.resolve()
										}
										return Promise.reject(new Error(''))
									},
								}),
							]}
						>
							<InputNumber />
						</Form.Item>
					</Space>
				)
			},
		},
	]

	return (
		<Modal
			title={t('Label_EditBetLimit')}
			open={isOpen}
			onCancel={onCancel}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			onOk={async () => {
				betLimitForm.validateFields().then(() => handleBeforeSetBetLimit())
			}}
			okButtonProps={{ disabled: isEmpty(dataSource) }}
			width='70vw'
			confirmLoading={loading}
			afterClose={onCloseModal}
			maskClosable={false}
		>
			<Spin spinning={loading}>
				<Form form={form} layout='vertical' initialValues={{ currency }}>
					<Row gutter={16} align='middle'>
						<Col span={12}>
							<Form.Item
								name='userName'
								label={t('Label_MemberId')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_MemberId'),
										}),
									},
								]}
							>
								<Input disabled={!editPermission?.canUse || !isAdd} />
							</Form.Item>
						</Col>
						{isAdd && (
							<Form.Item label=' '>
								<Col>
									<Button
										loading={loading}
										type='primary'
										htmlType='submit'
										icon={<SearchOutlined />}
										onClick={onSearchBetLimit}
									>
										{t('Label_Search')}
									</Button>
								</Col>
							</Form.Item>
						)}
						{!isAdd && (
							<Col span={12}>
								<Form.Item name='currency' label={t('Label_Currency')}>
									<Input disabled />
								</Form.Item>
							</Col>
						)}
					</Row>
				</Form>
				<Form form={betLimitForm} component={false}>
					{dataSource && (
						<Table
							loading={loading}
							columns={columns}
							dataSource={dataSource}
							pagination={false}
							size='large'
						/>
					)}
				</Form>
			</Spin>
		</Modal>
	)
}

export { EditBetLimitModal }

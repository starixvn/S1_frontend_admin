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
import { findIndex, head, find, keys, values, cloneDeep, filter } from 'lodash'
import { PermissionInterface } from 'type'
import { useAppSelector } from 'app/store'
import { selectUserSite, selectCurrencyListBySite } from 'common/enum'
import {
	useLazyGetByCustIdQuery,
	useLazyGetTpCategoryListQuery,
	useLazyGetCustInfoDetailsQuery,
} from 'features/betLimit/api'
import { IEditForm, ITpCategoryListData } from 'features/betLimit/type'
import { CustBetLimitConverter } from 'features/betLimit/utils'

interface IEditBetLimitModalProps {
	form: FormInstance<IEditForm>
	isAdd: boolean
	isOpen: boolean
	editPermission?: PermissionInterface
	isSetBetLimitLoading: boolean
	onCancel: () => void
	onSetBetLimit: (list: ITpCategoryListData[] | undefined) => void
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
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { currencyId } = form.getFieldsValue(['currencyId'])
	const [dataSource, setDataSource] = useState<
		ITpCategoryListData[] | undefined
	>(undefined)
	const currency =
		currencyListBySite.find(
			({ currencyId: siteCurrencyId }) => currencyId === siteCurrencyId
		)?.isoCode ?? 'N/A'

	const [getByCustId, { isFetching: isGetByCustIdLoading }] =
		useLazyGetByCustIdQuery()

	const [getCustInfoDetails, { isFetching: isGetCustInfoDetailsFetching }] =
		useLazyGetCustInfoDetailsQuery()

	const [getTpCategoryList, { isFetching: isGetTpCategoryListFetching }] =
		useLazyGetTpCategoryListQuery()

	const getBetLimitByCustId = async () => {
		const { custId } = form.getFieldsValue(['custId'])

		try {
			const { data: tpBetLimitCategoryList } = await getTpCategoryList({
				siteId,
				currencyId,
			}).unwrap()

			const { data: custBetLimitData } = await getByCustId({
				custId,
			}).unwrap()

			const actualDataList = CustBetLimitConverter(
				custBetLimitData.betSetting,
				tpBetLimitCategoryList
			)

			setDataSource(actualDataList)
			filter(actualDataList, ['isGroup', false]).map(data =>
				form.setFieldsValue({
					limitInput: {
						[data.key]: {
							min: data.limitInput.min,
							max: data.limitInput.max,
							maxPerMatch: data.limitInput.maxPerMatch,
						},
					},
				})
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('Label_NotExpectedServerError')
			)
		}
	}

	const onTableChange = ({
		key,
		checked,
		group,
	}: {
		key: string
		checked?: boolean
		group?: string
	}) => {
		setDataSource(prev => {
			const newArr = [...(prev || [])]
			const idx = findIndex(newArr, ['key', key])
			const newData = group ? { selectedGroup: group } : { checked: !checked }
			newArr[idx] = { ...newArr[idx], ...newData }
			return newArr
		})
	}

	const onSearchUserName = async () => {
		const { userName } = form.getFieldsValue()
		if (!userName) return

		try {
			const { data: custInfoDetail } = await getCustInfoDetails({
				siteId,
				userName,
			}).unwrap()

			const { data: tpBetLimitCategoryList } = await getTpCategoryList({
				siteId,
				currencyId: custInfoDetail.currencyId,
			}).unwrap()

			setDataSource(tpBetLimitCategoryList)
			filter(tpBetLimitCategoryList, ['isGroup', false]).map(data =>
				form.setFieldsValue({
					limitInput: {
						[data.key]: {
							min: data.limitInput.min,
							max: data.limitInput.max,
							maxPerMatch: data.limitInput.maxPerMatch,
						},
					},
				})
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleValidation = async () => {
		const { limitInput } = await form.validateFields()
		const { min, max, maxPerMatch } = values(limitInput)[0]

		switch (true) {
			case min >= max || min >= maxPerMatch || max >= maxPerMatch:
				throw new Error('error')
			default:
				return true
		}
	}

	// 送出修改前單獨驗證 min max maxPerMatch 輸入框
	const handleBeforeSetBetLimit = async () => {
		try {
			await handleValidation()
			const newDataSource: ITpCategoryListData[] = cloneDeep(dataSource!)

			const { limitInput } = await form.validateFields()
			const { min, max, maxPerMatch } = values(limitInput)[0]
			const key = keys(limitInput)[0]

			const idx = findIndex(newDataSource, ['key', key])
			const newData = {
				limitInput: {
					min,
					max,
					maxPerMatch,
				},
			}
			newDataSource[idx] = { ...newDataSource[idx], ...newData }
			return newDataSource ?? []
		} catch (error) {
			message.error(t('Label_LimitInputAmount'))
			//  驗證未過送 undefined 避免打 api
			return undefined
		}
	}

	const onCloseModal = () => {
		setDataSource(undefined)
		form.resetFields()
	}

	// 每次打開初次渲染 table
	useEffect(() => {
		if (isOpen) {
			if (!isAdd) {
				getBetLimitByCustId()
			}
		}
	}, [isOpen, isAdd])

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
			render: ({ key, checked }: ITpCategoryListData) => (
				<Switch
					checked={checked}
					disabled={!editPermission?.canUse}
					onChange={() => onTableChange({ key, checked })}
				/>
			),
		},
		{
			title: t('Label_Category'),
			key: 'categoryName',
			dataIndex: 'categoryName',
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
			key: 'limitGroup',
			width: 300,
			align: 'center' as 'center',
			editable: true,
			render: ({
				key,
				isGroup,
				limitGroup,
				selectedGroup,
			}: ITpCategoryListData) => {
				const selectedRange = find(limitGroup, ['group', selectedGroup])?.range

				return isGroup ? (
					<Select
						placeholder={selectedRange || head(limitGroup)?.range}
						style={{ width: '50%' }}
						disabled={!editPermission?.canUse}
						onSelect={(group: string) => onTableChange({ key, group })}
					>
						{limitGroup.map(({ group, range }) => (
							<Select.Option key={group} value={group}>
								{range}
							</Select.Option>
						))}
					</Select>
				) : (
					<Space>
						{/* Label_MaxPerMatch 是串關累計最大金額 條件是 MIn <= Max <= MaxPerMatch */}
						<Form.Item
							style={{ margin: 0 }}
							name={['limitInput', String(key), 'min']}
							label={t('Label_Min')}
							rules={[
								{
									required: true,
									message: '',
								},
							]}
						>
							<InputNumber />
						</Form.Item>
						<Form.Item
							style={{ margin: 0 }}
							name={['limitInput', String(key), 'max']}
							label={t('Label_Max')}
							rules={[
								{
									required: true,
									message: '',
								},
							]}
						>
							<InputNumber />
						</Form.Item>
						<Form.Item
							style={{ margin: 0 }}
							name={['limitInput', String(key), 'maxPerMatch']}
							label={t('Label_MaxPerMatch')}
							rules={[
								{
									required: true,
									message: '',
								},
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
			// handleBeforeSetBetLimit 裡 validateFields驗正需異步
			onOk={async () => {
				onSetBetLimit(await handleBeforeSetBetLimit())
			}}
			// okButtonProps={{ disabled: true }}
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
										onClick={onSearchUserName}
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

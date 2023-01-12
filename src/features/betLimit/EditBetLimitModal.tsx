import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
	FormInstance,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Table } from 'components'
import { PermissionInterface } from 'type'
import { selectUserSite } from 'common/enum'
import { Currency } from 'common/enum/type'
import { useAppSelector } from 'app/store'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import {
	useLazyGetByCustIdQuery,
	useSetBetLimitMutation,
	useLazyGetCustInfoDetailsQuery,
	useLazyGetTpCategoryListQuery,
	useLazyGetTpBetLimitGroupQuery,
} from 'features/betLimit/api'
import {
	IGetByCustIdData,
	IEditForm,
	IGameTypeBetLimit,
	IGetTpBetLimitGroupResponse,
	IGetTpCategoryListResponse,
	ICustInfoDetailsResponse,
} from 'features/betLimit/type'

interface IEditBetLimitModalProps {
	form: FormInstance<IEditForm>
	isOpen: boolean
	isAdd: boolean
	editPermission?: PermissionInterface
	currencyListBySite: Currency[]
	onCancel: () => void
}

const EditBetLimitModal = ({
	form,
	isOpen,
	isAdd,
	editPermission,
	currencyListBySite,
	onCancel,
}: IEditBetLimitModalProps) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { custId } = form.getFieldsValue(['custId'])
	const { currencyId } = form.getFieldsValue(['currencyId'])
	const [gameTypeBetLimitList, setGameTypeBetLimitList] = useState<
		IGameTypeBetLimit[]
	>([])

	const currency =
		currencyListBySite.find(
			({ currencyId: siteCurrencyId }) => currencyId === siteCurrencyId
		)?.isoCode ?? 'N/A'

	const [
		getByCustId,
		{
			data: { data: custBetLimit } = {} as IAxiosResponse<IGetByCustIdData>,
			isFetching: isGetByCustIdLoading,
		},
	] = useLazyGetByCustIdQuery()

	const [
		getCustInfoDetails,
		{
			data: { data: custInfoDetails } = {} as ICustInfoDetailsResponse,
			isFetching: isGetCustInfoDetailsFetching,
		},
	] = useLazyGetCustInfoDetailsQuery()

	const [
		getTpCategoryList,
		{
			data: { data: tpCategoryList } = {} as IGetTpCategoryListResponse,
			isFetching: isGetTpCategoryListFetching,
		},
	] = useLazyGetTpCategoryListQuery()

	const [
		getTpBetLimitGroup,
		{
			data: { data: tpBetLimitGroup } = {} as IGetTpBetLimitGroupResponse,
			isFetching: isGetTpBetLimitGroupFetching,
		},
	] = useLazyGetTpBetLimitGroupQuery()

	const [setBetLimit, { isLoading: isSetBetLimitLoading }] =
		useSetBetLimitMutation()

	const handleTableChange = ({
		categoryId,
		typeId,
		checked,
		group,
	}: {
		categoryId: number
		typeId: number
		checked?: boolean
		group?: string
	}) => {
		const newArr = gameTypeBetLimitList.map(data => {
			let obj = data
			if (data.categoryId === categoryId && data.typeId === typeId) {
				obj = group
					? { ...data, selectedValue: group }
					: { ...data, checked: !checked }
			}
			return obj
		})

		setGameTypeBetLimitList(newArr)
	}

	const getBetLimitByCustId = async () => {
		try {
			const { data: custBetLimitData } = await getByCustId({ custId }).unwrap()
			setGameTypeBetLimitList(custBetLimitData?.gameTypeBetLimit)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('Label_NotExpectedServerError')
			)
		}
	}

	const handleSearchUserName = async () => {
		const { userName } = form.getFieldsValue()
		if (!userName) return

		try {
			const { data: custInfoDetail } = await getCustInfoDetails({
				siteId,
				userName,
			}).unwrap()

			const { data: tpBetLimit } = await getTpBetLimitGroup({
				categoryId: tpCategoryList.categoryId,
				currencyId: custInfoDetail.currencyId,
			}).unwrap()

			setGameTypeBetLimitList(tpBetLimit)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetBetLimit = async () => {
		const { userName } = form.getFieldsValue()

		const betSettingList = gameTypeBetLimitList.map(
			({
				categoryId,
				categoryName,
				typeId,
				typeName,
				limitGroup,
				selectedValue,
				checked,
			}) => ({
				checked,
				tpCategory: categoryId,
				tpCategoryName: categoryName,
				gameTypeId: typeId,
				gameTypeName: typeName,
				limitGroup: checked ? selectedValue : null,
				limitRange: checked
					? limitGroup.find(obj => obj.group === selectedValue)?.range
					: null,
			})
		)

		try {
			await setBetLimit({
				siteId,
				currencyId: currencyId ?? custInfoDetails.currencyId,
				after: {
					userName,
					betSetting: betSettingList,
				},
			}).unwrap()

			onCancel()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (isAdd) {
			getTpCategoryList()
		} else {
			getBetLimitByCustId()
		}
	}, [])

	const loading =
		isGetByCustIdLoading ||
		isSetBetLimitLoading ||
		isGetCustInfoDetailsFetching ||
		isGetTpCategoryListFetching ||
		isGetTpBetLimitGroupFetching

	const showingTable = tpBetLimitGroup || custBetLimit?.gameTypeBetLimit

	const columns = [
		{
			title: t('Label_Status'),
			key: 'checked',
			width: 60,
			align: 'center' as 'center',
			render: (data: IGameTypeBetLimit) => {
				const { categoryId, typeId } = data
				const stateChecked = gameTypeBetLimitList.find(
					obj => obj.categoryId === categoryId && obj.typeId === typeId
				)?.checked

				return (
					<Switch
						size='small'
						checked={stateChecked}
						disabled={!editPermission?.canUse}
						onChange={() =>
							handleTableChange({ categoryId, typeId, checked: stateChecked })
						}
					/>
				)
			},
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
			key: 'typeName',
			dataIndex: 'typeName',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_LimitGroup'),
			key: 'limitGroup',
			width: 150,
			align: 'center' as 'center',
			render: (data: IGameTypeBetLimit) => {
				const { categoryId, typeId, limitGroup, selectedValue } = data
				const stateChecked = gameTypeBetLimitList.find(
					obj => obj.categoryId === categoryId && obj.typeId === typeId
				)?.checked
				const selectedRange = limitGroup?.find(
					({ group }) => group === selectedValue
				)?.range

				return (
					<Select
						placeholder={selectedRange}
						disabled={!stateChecked || !editPermission?.canUse}
						onSelect={(group: string) =>
							handleTableChange({ categoryId, typeId, group })
						}
					>
						{limitGroup?.map(({ group, range }) => (
							<Select.Option key={group} value={group}>
								{range}
							</Select.Option>
						))}
					</Select>
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
			onOk={handleSetBetLimit}
			width='60vw'
			confirmLoading={loading}
			afterClose={() => {
				form.resetFields()
			}}
		>
			<Spin spinning={isGetByCustIdLoading}>
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
							<Row justify='end' align='middle'>
								<Col>
									<Button
										loading={isGetByCustIdLoading}
										type='primary'
										htmlType='submit'
										icon={<SearchOutlined />}
										onClick={handleSearchUserName}
									>
										{t('Label_Search')}
									</Button>
								</Col>
							</Row>
						)}
						{!isAdd && (
							<Col span={12}>
								<Form.Item name='currency' label={t('Label_Currency')}>
									<Input disabled />
								</Form.Item>
							</Col>
						)}
					</Row>
					{showingTable && (
						<Table
							loading={isGetByCustIdLoading}
							columns={columns}
							dataSource={
								isAdd ? tpBetLimitGroup : custBetLimit?.gameTypeBetLimit
							}
							pagination={false}
						/>
					)}
				</Form>
			</Spin>
		</Modal>
	)
}

export { EditBetLimitModal }

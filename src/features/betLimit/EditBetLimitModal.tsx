import { useEffect, useState } from 'react'
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
	FormInstance,
} from 'antd'
import { Table } from 'components'
import { findIndex } from 'lodash'
import { PermissionInterface } from 'type'
import { useAppSelector } from 'app/store'
import { selectUserSite, selectCurrencyListBySite } from 'common/enum'
import {
	useLazyGetByCustIdQuery,
	useLazyGetTpCategoryListQuery,
	useLazyGetCustInfoDetailsQuery,
	useLazyGetTpBetLimitGroupQuery,
} from 'features/betLimit/api'

import {
	IEditForm,
	IGameTypeBetLimit,
	ITpCategoryListResponse,
} from 'features/betLimit/type'

interface IEditBetLimitModalProps {
	form: FormInstance<IEditForm>
	isAdd: boolean
	isOpen: boolean
	editPermission?: PermissionInterface
	isSetBetLimitLoading: boolean
	onCancel: () => void
	onSetBetLimit: (list: IGameTypeBetLimit[]) => void
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
	const [gameTypeBetLimitList, setGameTypeBetLimitList] = useState<
		undefined | IGameTypeBetLimit[]
	>(undefined)

	const currency =
		currencyListBySite.find(
			({ currencyId: siteCurrencyId }) => currencyId === siteCurrencyId
		)?.isoCode ?? 'N/A'

	const [getByCustId, { isFetching: isGetByCustIdLoading }] =
		useLazyGetByCustIdQuery()

	const [getCustInfoDetails, { isFetching: isGetCustInfoDetailsFetching }] =
		useLazyGetCustInfoDetailsQuery()

	const [
		getTpCategoryList,
		{
			data: { data: tpCategoryList } = {} as ITpCategoryListResponse,
			isFetching: isGetTpCategoryListFetching,
		},
	] = useLazyGetTpCategoryListQuery()

	const [getTpBetLimitGroup, { isFetching: isGetTpBetLimitGroupFetching }] =
		useLazyGetTpBetLimitGroupQuery()

	const getBetLimitByCustId = async () => {
		const { custId } = form.getFieldsValue(['custId'])

		try {
			const { data: custBetLimitData } = await getByCustId({
				custId,
			}).unwrap()

			setGameTypeBetLimitList(custBetLimitData?.gameTypeBetLimit)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('Label_NotExpectedServerError')
			)
		}
	}

	const onTableChange = ({
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
		setGameTypeBetLimitList(prev => {
			const newArr = [...(prev || [])]
			const idx = findIndex(newArr, { categoryId, typeId })
			const newData = group ? { selectedValue: group } : { checked: !checked }
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

	const onCloseModal = () => {
		setGameTypeBetLimitList(undefined)
		form.resetFields()
	}

	useEffect(() => {
		if (isOpen) {
			if (isAdd) {
				getTpCategoryList()
			} else {
				getBetLimitByCustId()
			}
		}
	}, [isOpen, isAdd])

	const loading =
		isGetByCustIdLoading ||
		isGetCustInfoDetailsFetching ||
		isGetTpCategoryListFetching ||
		isGetTpBetLimitGroupFetching ||
		isSetBetLimitLoading

	const columns = [
		{
			title: t('Label_Status'),
			key: 'checked',
			width: 60,
			align: 'center' as 'center',
			render: ({ categoryId, typeId, checked }: IGameTypeBetLimit) => (
				<Switch
					checked={checked}
					disabled={!editPermission?.canUse}
					onChange={() => onTableChange({ categoryId, typeId, checked })}
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
			key: 'typeName',
			dataIndex: 'typeName',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_LimitGroup'),
			key: 'limitGroup',
			width: 200,
			align: 'center' as 'center',
			render: ({
				typeId,
				checked,
				categoryId,
				limitGroup,
				selectedValue,
			}: IGameTypeBetLimit) => {
				const selectedRange = limitGroup.find(
					({ group }) => group === selectedValue
				)?.range

				return (
					<Select
						placeholder={selectedRange}
						style={{ width: '50%' }}
						disabled={!checked || !editPermission?.canUse}
						onSelect={(group: string) =>
							onTableChange({ categoryId, typeId, group })
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
			onOk={() => {
				onSetBetLimit(gameTypeBetLimitList ?? [])
			}}
			width='60vw'
			confirmLoading={loading}
			afterClose={onCloseModal}
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
					{gameTypeBetLimitList && (
						<Table
							loading={loading}
							columns={columns}
							dataSource={gameTypeBetLimitList}
							pagination={false}
						/>
					)}
				</Form>
			</Spin>
		</Modal>
	)
}

export { EditBetLimitModal }

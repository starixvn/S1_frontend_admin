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
import { findIndex, head, find } from 'lodash'
import { PermissionInterface } from 'type'
import { useAppSelector } from 'app/store'
import { selectUserSite, selectCurrencyListBySite } from 'common/enum'
import {
	useLazyGetByCustIdQuery,
	useLazyGetTpCategoryListQuery,
	useLazyGetCustInfoDetailsQuery,
} from 'features/betLimit/api'
import { IEditForm, ITpCategoryListData } from 'features/betLimit/type'
import { SetByBetLimitCell } from 'features/betLimit/BetLimitModal/SetByBetLimitCell'
import { CustBetLimitConverter } from 'features/betLimit/utils'

interface IEditBetLimitModalProps {
	form: FormInstance<IEditForm>
	isAdd: boolean
	isOpen: boolean
	editPermission?: PermissionInterface
	isSetBetLimitLoading: boolean
	onCancel: () => void
	onSetBetLimit: (list: ITpCategoryListData[]) => void
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
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleEndEdit = (
		key: string,
		min: number,
		max: number,
		maxPerMatch: number
	) => {
		setDataSource(prev => {
			const newArr = [...(prev || [])]
			const idx = findIndex(newArr, ['key', key])
			const newData = {
				limitInput: {
					min: Number(min),
					max: Number(max),
					maxPerMatch: Number(maxPerMatch),
				},
			}
			newArr[idx] = { ...newArr[idx], ...newData }
			return newArr
		})
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
			width: 200,
			align: 'center' as 'center',
			editable: true,
			render: ({
				key,
				isGroup,
				limitGroup,
				limitInput,
				selectedGroup,
			}: ITpCategoryListData) => {
				const { max, min, maxPerMatch } = limitInput ?? {}
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
						<Form.Item style={{ margin: 0 }} name='min' label={t('Label_Min')}>
							<InputNumber bordered={false} defaultValue={min} />
						</Form.Item>
						<Form.Item style={{ margin: 0 }} name='max' label={t('Label_Max')}>
							<InputNumber bordered={false} defaultValue={max} />
						</Form.Item>
						<Form.Item
							style={{ margin: 0 }}
							name='maxPerMatch'
							label={t('Label_MaxPerMatch')}
						>
							<InputNumber bordered={false} defaultValue={maxPerMatch} />
						</Form.Item>
					</Space>
				)
			},
		},
	]

	const mergedColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: ITpCategoryListData) => ({
				record,
				form,
				handleEndEdit,
				title: col.title,
				editable: col.editable,
				dataIndex: col.dataIndex,
			}),
		}
	})

	return (
		<Modal
			title={t('Label_EditBetLimit')}
			open={isOpen}
			onCancel={onCancel}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			onOk={() => {
				onSetBetLimit(dataSource ?? [])
			}}
			width='70vw'
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
					{dataSource && (
						<Table
							components={{
								body: {
									cell: SetByBetLimitCell,
								},
							}}
							loading={loading}
							columns={mergedColumns}
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

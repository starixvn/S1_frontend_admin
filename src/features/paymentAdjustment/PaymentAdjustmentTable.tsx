import { useTranslation } from 'react-i18next'
import { EditableCellRows, Table } from 'components'
import { LayoutContent } from 'app/pages/layout'
import {
	IEditForm,
	IGetPaymentAdjustmentReportData,
	IGetReasonListData,
} from 'features/paymentAdjustment/type'
import { PermissionInterface } from 'type'
import { PaginationInterface } from 'common/hooks'
import {
	Form,
	FormInstance,
	Select,
	Space,
	TablePaginationConfig,
	Typography,
} from 'antd'
import React from 'react'
import { numberFormatter, timeFormat } from 'common/utils/format'
import moment from 'moment/moment'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { IEnumTypeData } from 'common/service/enumApi'
import { AdjustmentTypeEnum } from 'features/paymentAdjustment/constants'
import { multiEqual } from 'common/utils'

interface IPaymentAdjustmentTableProps {
	form: FormInstance<IEditForm>
	loading: boolean
	timeZoneUtcOffset: number
	editingKey: string | undefined
	pagination: PaginationInterface
	editPermission?: PermissionInterface
	reasonList: IGetReasonListData[]
	paymentAdjustmentReport: IGetPaymentAdjustmentReportData[]
	adjustTypeList: IEnumTypeData[]
	setEditingKey: React.Dispatch<React.SetStateAction<string | undefined>>
	onSaved: (before: IGetPaymentAdjustmentReportData) => void
	onTableChange: (newPagination: TablePaginationConfig) => void
	setSelectedMethodType: React.Dispatch<React.SetStateAction<number>>
}

const { Option } = Select

const PaymentAdjustmentTable = ({
	form,
	loading,
	reasonList,
	editingKey,
	pagination,
	editPermission,
	adjustTypeList,
	timeZoneUtcOffset,
	paymentAdjustmentReport,
	onSaved,
	setEditingKey,
	onTableChange,
	setSelectedMethodType,
}: IPaymentAdjustmentTableProps) => {
	const { t } = useTranslation()

	const onEdit = (record: IGetPaymentAdjustmentReportData) => {
		const { transId, methodType } = record
		form.setFieldsValue({ ...record })
		setEditingKey(transId)
		setSelectedMethodType(methodType)
	}

	const isEditing = (transId: string) => transId === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 120,
			align: 'center' as 'center',
			render: (record: IGetPaymentAdjustmentReportData) => {
				const { transId } = record
				const editable = isEditing(transId)

				return editable ? (
					<Space>
						<Typography.Link
							onClick={() => onSaved(record)}
							style={{ marginRight: 8 }}
						>
							{t('Label_Save')}
						</Typography.Link>
						<Typography.Link onClick={() => setEditingKey(undefined)}>
							{t('Label_Cancel')}
						</Typography.Link>
					</Space>
				) : (
					<Typography.Link
						disabled={!editPermission?.canUse}
						onClick={() => onEdit(record)}
					>
						{t('Label_Edit')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Currency'),
			key: 'currencyName',
			dataIndex: 'currencyName',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_TransId'),
			key: 'transId',
			dataIndex: 'transId',
			width: 100,
			align: 'center' as 'center',
		},

		// adjust type //
		{
			title: t('Label_AdjustType'),
			key: 'adjustType',
			width: 100,
			align: 'center' as 'center',

			render: (record: IGetPaymentAdjustmentReportData) => {
				const { transId, adjustType, adjustTypeName } = record
				const editable = isEditing(transId)

				// Filter adjustTypeList based on adjustTypeName for selecting options //

				const filteredOptions = adjustTypeList.filter(({ value }) => {
					if (
						multiEqual(adjustType, [
							AdjustmentTypeEnum.Credit,
							AdjustmentTypeEnum.IncreaseBonus,
						])
					) {
						return (
							value === AdjustmentTypeEnum.Credit ||
							value === AdjustmentTypeEnum.IncreaseBonus
						)
					}

					if (
						multiEqual(adjustType, [
							AdjustmentTypeEnum.Debit,
							AdjustmentTypeEnum.ReduceBonus,
						])
					) {
						return (
							value === AdjustmentTypeEnum.Debit ||
							value === AdjustmentTypeEnum.ReduceBonus
						)
					}
					return false
				})

				// Check if adjustTypeName is Credit or Debit //

				const isCreditOrDebit = multiEqual(adjustType, [
					AdjustmentTypeEnum.Credit,
					AdjustmentTypeEnum.Debit,
					AdjustmentTypeEnum.IncreaseBonus,
					AdjustmentTypeEnum.ReduceBonus,
				])
				// Only if user has edit permission and adjustTypeName is Credit or Debit, then show the dropdown //

				return editable && isCreditOrDebit ? (
					<Form.Item name='adjustType' style={{ margin: 0 }}>
						<Select>
							{filteredOptions.map(({ value, name }) => (
								<Option key={value} value={value}>
									{name}
								</Option>
							))}
						</Select>
					</Form.Item>
				) : (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{adjustTypeName}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_MemberId'),
			key: 'memberId',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetPaymentAdjustmentReportData) => {
				const { userName, custId } = record
				return (
					<Typography.Link
						href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
						target='_blank'
					>
						{userName}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_SabaId'),
			key: 'sabaID',
			dataIndex: 'sabaID',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_WalletType'),
			key: 'walletType',
			dataIndex: 'walletType',
			width: 100,
			align: 'center' as 'center',
			render: (walletType: string) => walletType || '-',
		},
		{
			title: t('Label_Amount'),
			key: 'amount',
			dataIndex: 'amount',
			width: 100,
			align: 'center' as 'center',
			render: (amount: number) => numberFormatter.format(amount),
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			align: 'center' as 'center',
			render: (createTime: string) => (
				<div style={{ width: '180px' }}>
					{createTime ? (
						<Typography.Text style={{ whiteSpace: 'nowrap' }}>
							{moment(createTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)}
						</Typography.Text>
					) : (
						''
					)}
				</div>
			),
		},
		{
			title: t('Label_Status'),
			key: 'statusName',
			dataIndex: 'statusName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_AdjustReason'),
			key: 'adjustReason',
			width: '200px',
			align: 'center' as 'center',
			render: (record: IGetPaymentAdjustmentReportData) => {
				const { adjustCategoryName, transId } = record
				const editable = isEditing(transId)
				return editable && reasonList ? (
					<Form.Item name='adjustCategory' style={{ margin: 0 }}>
						<Select>
							{reasonList?.map(({ id, name }) => (
								<Option key={id} value={id}>
									{name}
								</Option>
							))}
						</Select>
					</Form.Item>
				) : (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{adjustCategoryName}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_Memo'),
			key: 'memo',
			dataIndex: 'memo',
			width: '200px',
			align: 'center' as 'center',
			editable: true,
			render: (memo: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{memo}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 80,
			align: 'center' as 'center',
		},
	]

	const mergeColumns = columns.map(col => {
		const { editable, dataIndex, title } = col
		if (!editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IGetPaymentAdjustmentReportData) => {
				const { transId } = record
				return {
					record,
					inputType: 'text',
					dataIndex,
					title,
					editing: isEditing(transId),
				}
			},
		}
	})
	return (
		<LayoutContent.Card>
			<Form form={form} component={false}>
				<Table
					loading={loading}
					dataSource={paymentAdjustmentReport ?? []}
					columns={mergeColumns}
					components={{
						body: {
							cell: EditableCellRows,
						},
					}}
					pagination={pagination as TablePaginationConfig}
					onChange={onTableChange}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export { PaymentAdjustmentTable }

import { Dispatch, FC, SetStateAction } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { EditableCellRows, Table } from 'components'
import { useTranslation } from 'react-i18next'
import { PermissionInterface } from 'type'
import { numberFormatter } from 'common/utils/format'
import { IWithdrawalLimitationTableData } from 'features/withdrawalLimitation/type'
import { Form, FormInstance, Space, Typography } from 'antd'
import { isNumber } from 'lodash'

interface IWithdrawalLimitationTableProps {
	loading: boolean
	editPermission?: PermissionInterface
	editingKey: number | undefined
	setEditingKey: Dispatch<SetStateAction<number | undefined>>
	onTableRowSave: (record: IWithdrawalLimitationTableData) => void
	withdrawalTableData: IWithdrawalLimitationTableData[]
	form: FormInstance
}

const WithdrawalLimitationTable: FC<IWithdrawalLimitationTableProps> = ({
	loading,
	editPermission,
	editingKey,
	setEditingKey,
	onTableRowSave,
	withdrawalTableData,
	form,
}) => {
	const { t } = useTranslation()

	const isEditing = (record: IWithdrawalLimitationTableData) =>
		record.vipLevel === editingKey

	const onEdit = (record: IWithdrawalLimitationTableData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.vipLevel)
	}

	const columns = [
		{
			title: t('Label_Action'),
			width: 140,
			align: 'center' as 'center',
			render: (record: IWithdrawalLimitationTableData) => {
				const editable = isEditing(record)
				return editable ? (
					<Space>
						<Typography.Link
							onClick={() => {
								onTableRowSave(record)
							}}
						>
							{t('Label_Save')}
						</Typography.Link>

						<Typography.Link onClick={() => setEditingKey(undefined)}>
							{t('Label_Cancel')}
						</Typography.Link>
					</Space>
				) : (
					<Typography.Link
						disabled={editingKey !== undefined || !editPermission?.canUse}
						onClick={() => onEdit(record)}
					>
						{t('Label_Edit')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_VipLevel'),
			dataIndex: 'levelName',
			width: 100,
			align: 'center' as 'center',
			render: (levelName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{levelName ?? ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_WithdrawalFrequency'),
			dataIndex: 'times',
			width: 100,
			align: 'center' as 'center',
			innerWidth: 200,
			editable: true,
			render: (times: number) =>
				isNumber(times) ? numberFormatter.format(times) : 'N/A',
		},
		{
			title: t('Label_WithdrawalMax'),
			dataIndex: 'totalWithdrawalMax',
			width: 100,
			align: 'center' as 'center',
			innerWidth: 200,
			editable: true,
			render: (totalWithdrawalMax: number) =>
				totalWithdrawalMax ? numberFormatter.format(totalWithdrawalMax) : 'N/A',
		},
		{
			title: t('Label_WithdrawalMin'),
			dataIndex: 'withdrawalMin',
			width: 100,
			align: 'center' as 'center',
			innerWidth: 200,
			editable: true,
			render: (withdrawalMin: number) =>
				isNumber(withdrawalMin) ? numberFormatter.format(withdrawalMin) : 'N/A',
		},
		{
			title: t('Label_USDT_ERCMin'),
			dataIndex: 'UsdtErcMin',
			width: 100,
			align: 'center' as 'center',
			innerWidth: 200,
			editable: true,
			render: (UsdtErcMin: number) =>
				isNumber(UsdtErcMin) ? numberFormatter.format(UsdtErcMin) : 'N/A',
		},
		{
			title: t('Label_USDT_TRCMin'),
			width: 100,
			dataIndex: 'UsdtTrcMin',
			align: 'center' as 'center',
			innerWidth: 200,
			editable: true,
			render: (UsdtTrcMin: number) =>
				isNumber(UsdtTrcMin) ? numberFormatter.format(UsdtTrcMin) : 'N/A',
		},
		{
			title: t('Label_USDC_ERCMin'),
			width: 100,
			dataIndex: 'UsdcErcMin',
			align: 'center' as 'center',
			innerWidth: 200,
			editable: true,
			render: (UsdcErcMin: number) =>
				isNumber(UsdcErcMin) ? numberFormatter.format(UsdcErcMin) : 'N/A',
		},
		{
			title: t('Label_USDC_TRCMin'),
			width: 100,
			dataIndex: 'UsdcTrcMin',
			align: 'center' as 'center',
			innerWidth: 200,
			editable: true,
			render: (UsdcTrcMin: number) =>
				isNumber(UsdcTrcMin) ? numberFormatter.format(UsdcTrcMin) : 'N/A',
		},
		{
			title: t('Label_ETHMin'),
			width: 100,
			align: 'center' as 'center',
			dataIndex: 'EthMin',
			innerWidth: 200,
			editable: true,
			render: (EthMin: number) =>
				isNumber(EthMin) ? numberFormatter.format(EthMin) : 'N/A',
		},
		{
			title: t('Label_BTCMin'),
			width: 100,
			align: 'center' as 'center',
			dataIndex: 'BtcMin',
			innerWidth: 200,
			editable: true,
			render: (BtcMin: number) =>
				isNumber(BtcMin) ? numberFormatter.format(BtcMin) : 'N/A',
		},
	]

	const mergedColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IWithdrawalLimitationTableData) => ({
				record,
				inputType: 'number',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		}
	})

	return (
		<LayoutContent.Card style={{ marginTop: 0 }}>
			<Form form={form} component={false}>
				<Table
					loading={loading}
					pagination={false}
					columns={mergedColumns}
					components={{
						body: {
							cell: EditableCellRows,
						},
					}}
					dataSource={withdrawalTableData}
					size='middle'
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export { WithdrawalLimitationTable }

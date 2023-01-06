import React from 'react'
import moment from 'moment'
import { Form, FormInstance, Space, Typography } from 'antd'
import { PermissionInterface } from 'type'
import { EditableCellRows, Table } from 'components'
import { IGetUsdData } from 'features/exchangeUsdRate/type'
import { timeFormat } from 'common/utils/format'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'

interface IExchangeUsdRateTableProps {
	form: FormInstance<{
		usdRate: number
	}>
	loading: boolean
	timeZoneUtcOffset: number
	usdRateList: IGetUsdData[]
	editingKey: {
		currencyId: number | undefined
		usdRate: number | undefined
	}
	editPermission?: PermissionInterface
	setEditingKey: React.Dispatch<
		React.SetStateAction<{
			currencyId: number | undefined
			usdRate: number | undefined
		}>
	>
	onSaved: (record: IGetUsdData) => void
}

const ExchangeUsdRateTable = ({
	form,
	loading,
	timeZoneUtcOffset,
	usdRateList,
	editingKey,
	editPermission,
	setEditingKey,
	onSaved,
}: IExchangeUsdRateTableProps) => {
	const { t } = useTranslation()
	const onEdit = (record: IGetUsdData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(prev => ({ ...prev, currencyId: record.currencyId }))
	}

	const isEditing = (record: IGetUsdData) =>
		record.currencyId === editingKey.currencyId

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: '10%',
			align: 'center' as 'center',
			render: (record: IGetUsdData) => {
				const editable = isEditing(record)

				return editable ? (
					<Space size='middle'>
						<Typography.Link onClick={() => onSaved(record)}>
							{t('Label_Save')}
						</Typography.Link>
						<Typography.Link
							onClick={() =>
								setEditingKey({
									currencyId: undefined,
									usdRate: undefined,
								})
							}
						>
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
			key: 'usd',
			width: '15%',
			align: 'center' as 'center',
			render: () => t('Label_USD'),
		},
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: '15%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_ExchangeRate'),
			key: 'usdRate',
			dataIndex: 'usdRate',
			width: '15%',
			align: 'right' as 'right',
			editable: true,
			render: (usdRate: number) => usdRate ?? '-',
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'lastUpdateUser',
			dataIndex: 'lastUpdateUser',
			width: '15%',
			align: 'center' as 'center',
			render: (lastUpdateUser: string) =>
				lastUpdateUser ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{lastUpdateUser}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_LastUpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: '15%',
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
	]

	const mergeColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IGetUsdData) => ({
				record,
				inputType: 'number',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		}
	})

	return (
		<LayoutContent.Card style={{ padding: '30px 20px' }}>
			<Form form={form} component={false}>
				<Table
					components={{
						body: {
							cell: EditableCellRows,
						},
					}}
					loading={loading}
					dataSource={usdRateList ?? []}
					columns={mergeColumns}
					pagination={false}
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export default ExchangeUsdRateTable

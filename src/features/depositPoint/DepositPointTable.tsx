import { Dispatch, FC, SetStateAction } from 'react'
import moment from 'moment'
import { PermissionInterface } from 'type'
import { MOMENT_RANGE_PICKER_RANGES } from 'app/constants/moment'
import { Form, FormInstance, DatePicker, Space, Switch, Typography } from 'antd'
import { EditableCellRows, Table } from 'components'
import { useTranslation } from 'react-i18next'
import { numberFormatter, timeFormat } from 'common/utils/format'
import { IDepositPointSettingData } from './type'

const { RangePicker } = DatePicker

interface DepositPointTableProps {
	form: FormInstance
	loading: boolean
	editPermission?: PermissionInterface
	editingKey: string
	depositPointSettings: IDepositPointSettingData[]
	timeZoneUtcOffset: number
	setEditingKey: Dispatch<SetStateAction<string>>
	onTableRowSave: () => void
}

const DepositPointTable: FC<DepositPointTableProps> = ({
	form,
	loading,
	editPermission,
	editingKey,
	depositPointSettings,
	timeZoneUtcOffset,
	setEditingKey,
	onTableRowSave,
}) => {
	const { t } = useTranslation()

	const onEdit = (record: IDepositPointSettingData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.isoCode ?? '')
	}

	const isEditing = (record: IDepositPointSettingData) =>
		record.isoCode === editingKey

	const onCancel = () => {
		setEditingKey('')
	}

	const columns = [
		{
			title: t('Label_Action'),
			width: 140,
			align: 'center' as 'center',
			render: (record: IDepositPointSettingData) => {
				const editable = isEditing(record)
				return editable ? (
					<Space>
						<Typography.Link onClick={onTableRowSave}>
							{t('Label_Save')}
						</Typography.Link>

						<Typography.Link onClick={onCancel}>
							{t('Label_Cancel')}
						</Typography.Link>
					</Space>
				) : (
					<Typography.Link
						disabled={editingKey !== '' || !editPermission?.canUse}
						onClick={() => onEdit(record)}
					>
						{t('Label_Edit')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Currency'),
			width: 80,
			dataIndex: 'isoCode',
			align: 'center' as 'center',
			editable: false,
			render: (isoCode: string) => isoCode || 'N/A',
		},
		{
			title: t('Label_DepositGet1Point'),
			dataIndex: 'depositAmount',
			width: 80,
			align: 'center' as 'center',
			innerWidth: 200,
			editable: true,
			render: (depositAmount: number) =>
				numberFormatter.format(depositAmount) || 'N/A',
		},
		{
			title: t('Label_ExpiryDate'),
			width: '240px',
			align: 'center' as 'center',
			editable: false,
			render: (record: IDepositPointSettingData) => {
				const editable = isEditing(record)
				const { promotionStatus, promotionStartTime, promotionEndTime } = record

				return (
					<Space align='center'>
						{editable ? (
							<Form.Item
								name='promotionStatus'
								style={{ margin: 0 }}
								valuePropName='checked'
							>
								<Switch disabled={!editable} />
							</Form.Item>
						) : (
							<Switch checked={promotionStatus} disabled={!editable} />
						)}

						{editable ? (
							<Form.Item name='promotionDateRange' style={{ margin: 0 }}>
								<RangePicker
									disabled={!editable}
									format={time =>
										moment(time)
											.utcOffset(timeZoneUtcOffset)
											.format('YYYY-MM-DD')
									}
									ranges={MOMENT_RANGE_PICKER_RANGES([
										'Today',
										'Last 7 Day',
										'This Month',
									])}
								/>
							</Form.Item>
						) : (
							<RangePicker
								disabled={!editable}
								format={time =>
									moment(time).utcOffset(timeZoneUtcOffset).format('YYYY-MM-DD')
								}
								ranges={MOMENT_RANGE_PICKER_RANGES([
									'Today',
									'Last 7 Day',
									'This Month',
								])}
								value={[moment(promotionStartTime), moment(promotionEndTime)]}
							/>
						)}
					</Space>
				)
			},
		},
		{
			title: t('Label_PointRate'),
			dataIndex: `promotionPointRate`,
			width: 80,
			align: 'center' as 'center',
			editable: true,
		},
		{
			title: t('Label_LastUpdateUser'),
			dataIndex: `lastUpdater`,
			width: 100,
			align: 'center' as 'center',
			editable: false,
		},
		{
			title: t('Label_LastUpdateTime'),
			dataIndex: `lastUpdateTime`,
			width: 140,
			align: 'center' as 'center',
			editable: false,
			render: (lastUpdateTime: string) =>
				lastUpdateTime
					? moment(lastUpdateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)
					: '',
		},
	]

	const mergedColumns: any[] = columns.map(col => {
		const { title, dataIndex, editable } = col

		if (!editable) {
			return col
		}

		return {
			...col,
			onCell: (record: IDepositPointSettingData) => ({
				record,
				title,
				dataIndex,
				editing: isEditing(record),
				inputType:
					dataIndex === 'depositAmount' || dataIndex === 'promotionPointRate'
						? 'number'
						: 'text',
			}),
		}
	})

	return (
		<Form form={form} component={false}>
			<Table
				loading={loading}
				components={{
					body: {
						cell: EditableCellRows,
					},
				}}
				dataSource={depositPointSettings}
				columns={mergedColumns}
				pagination={false}
			/>
		</Form>
	)
}

export default DepositPointTable

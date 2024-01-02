import React from 'react'
import { PermissionInterface } from 'type'
import { useTranslation } from 'react-i18next'
import {
	Card,
	Form,
	FormInstance,
	Space,
	Switch,
	Table,
	Typography,
} from 'antd'
import { ILeaderboardPointCalculationData } from 'features/leaderboardManagement/type'
import { numberFormatter, timeFormat } from 'common/utils/format'
import moment from 'moment/moment'
import { useTimeZone } from 'components/TimeZoneSelect'
import { EditableCellRows } from 'components'

interface ICalculationFormProps {
	isInEdit: boolean
	form: FormInstance<ILeaderboardPointCalculationData>
	loading: boolean
	editingKey: number | undefined
	editPermission?: PermissionInterface
	leaderboardCalculationData: ILeaderboardPointCalculationData[]
	onSave: (record: ILeaderboardPointCalculationData) => void
	setEditingKey: React.Dispatch<React.SetStateAction<number | undefined>>
}
const CalculationForm = ({
	isInEdit,
	form,
	loading,
	editingKey,
	leaderboardCalculationData,
	editPermission,
	setEditingKey,
	onSave,
}: ICalculationFormProps) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset } = useTimeZone()
	const onEdit = (record: ILeaderboardPointCalculationData) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.currencyId)
	}
	const isEditing = (record: ILeaderboardPointCalculationData) =>
		record.currencyId === editingKey

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: '10%',
			align: 'center' as 'center',
			render: (record: ILeaderboardPointCalculationData) => {
				const editable = isEditing(record)

				return editable ? (
					<Space>
						<Typography.Link
							onClick={() => {
								onSave(record)
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
						disabled={!editPermission?.canUse || isInEdit}
						onClick={() => onEdit(record)}
					>
						{t('Label_Edit')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Status'),
			key: 'status',
			align: 'center' as 'center',
			width: '10%',
			render: (record: ILeaderboardPointCalculationData) => {
				const { status } = record
				const editable = isEditing(record)
				return editable ? (
					<Form.Item name='status' valuePropName='checked' noStyle>
						<Switch disabled={!editPermission?.canUse} />
					</Form.Item>
				) : (
					<Switch checked={Boolean(status)} disabled />
				)
			},
		},
		{
			title: t('Label_Currency'),
			key: 'currencyName',
			dataIndex: 'currency',
			width: '10%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_SportValidTurnover'),
			key: 'sportTurnOver',
			dataIndex: 'sportTurnOver',
			width: '14%',
			align: 'center' as 'center',
			editable: true,
			render: (sportTurnOver: number) =>
				numberFormatter.format(sportTurnOver) ?? '-',
		},
		{
			title: t('Label_SlotValidTurnover'),
			key: 'slotTurnOver',
			dataIndex: 'slotTurnOver',
			width: '14%',
			align: 'center' as 'center',
			editable: true,
			render: (slotTurnOver: number) =>
				numberFormatter.format(slotTurnOver) ?? '-',
		},
		{
			title: t('Label_LiveCasinoValidTurnover'),
			key: 'liveCasinoTurnOver',
			dataIndex: 'liveCasinoTurnOver',
			width: '14%',
			align: 'center' as 'center',
			editable: true,
			render: (liveCasinoTurnOver: number) =>
				numberFormatter.format(liveCasinoTurnOver) ?? '-',
		},
		{
			title: t('Label_Updator'),
			dataIndex: 'updater',
			width: '10%',
			align: 'center' as 'center',
			render: (updater: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{updater ?? 'N/A'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_LastUpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: '15.5%',
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
	]

	const mergeColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: ILeaderboardPointCalculationData) => ({
				record,
				inputType: 'number',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		}
	})

	return (
		<Card title={t('Label_SetPointCalculation')} bordered={false}>
			<Form form={form} component={false}>
				{/* 共用的 Table 沒辦法完全關閉 Pagination , 故用原生實作 */}
				<Table
					bordered
					rowClassName='editable-row'
					size='small'
					scroll={{ x: 240 }}
					loading={loading}
					components={{
						body: {
							cell: EditableCellRows,
						},
					}}
					dataSource={leaderboardCalculationData}
					pagination={false}
					columns={mergeColumns}
				/>
			</Form>
		</Card>
	)
}

export { CalculationForm }

import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Form, message, Modal, Space, Typography, Table } from 'antd'
import { PermissionInterface } from 'type'
import { useState } from 'react'
import { EditableCellRows } from 'components'
import { numberFormatter } from 'common/utils/format'
import {
	IEditRaffleTicketAndStickerForm,
	IRaffleTicketStickerSettingData,
} from 'features/eventManagement/type'
import {
	useGetRaffleTicketStickerSettingQuery,
	useSetRaffleTicketStickerSettingMutation,
} from 'features/eventManagement/api'
import { timeFormat } from '../../../common/utils/format'
import { useAppSelector } from '../../../app/store'
import { selectUserSite } from '../../../common/enum'
import { useTimeZone } from '../../../components/TimeZoneSelect'

interface IRaffleTicketAndStickerModalProps {
	visible: boolean
	editPermission?: PermissionInterface
	onCancel: () => void
}

const RaffleTicketAndStickerModal = ({
	visible,
	editPermission,
	onCancel,
}: IRaffleTicketAndStickerModalProps) => {
	/**  ======= hooks ======= */

	const { t } = useTranslation()
	const { timeZoneUtcOffset } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [editForm] = Form.useForm<IEditRaffleTicketAndStickerForm>()
	const [editingKey, setEditingKey] = useState<string | undefined>(undefined)

	/**  ======= 函數 ======= */

	const onEdit = (record: IRaffleTicketStickerSettingData) => {
		editForm.setFieldsValue({ ...record })
		setEditingKey(record.key)
	}

	const isEditing = (record: IRaffleTicketStickerSettingData) =>
		record.key === editingKey

	const handleRowSaved = async () => {
		if (!editingKey && !siteId) return
		const { currencyId, stickerPrize, nextTurnOver } =
			await editForm.getFieldsValue(true)

		try {
			await setRaffleTicketStickerSetting({
				siteId,
				currencyId,
				stickerPrize,
				turnOver: nextTurnOver,
			})
			message.success(t('System.Label_Success'))
			setEditingKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}
	/**  ======= api ======= */

	const {
		data: { data: raffleTicketStickerSettingList = [] } = {},
		isFetching: isRaffleTicketStickerSettingFetching,
	} = useGetRaffleTicketStickerSettingQuery({
		siteId,
	})

	const [
		setRaffleTicketStickerSetting,
		{ isLoading: isSetRaffleTicketStickerSettingLoading },
	] = useSetRaffleTicketStickerSettingMutation()

	/**  ======= columns ======= */

	const columns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 100,
			align: 'center' as 'center',
			render: (record: IRaffleTicketStickerSettingData) => {
				const editable = isEditing(record)
				return editable ? (
					<Space size='middle'>
						<Typography.Link onClick={handleRowSaved}>
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
			key: 'currencyId',
			dataIndex: 'currencyId',
			width: 120,
			align: 'center' as 'center',
			render: (currencyId: number) => {
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{currencyId || '-'}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_StickerPrize'),
			key: 'stickerPrize',
			dataIndex: 'stickerPrize',
			width: 120,
			editable: true,
			align: 'center' as 'center',
			render: (stickerPrize: number) => {
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{numberFormatter.format(stickerPrize) || '-'}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_TurnOver'),
			key: 'turnOver',
			dataIndex: 'turnOver',
			width: 120,
			align: 'center' as 'center',
			render: (turnOver: number) => {
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{numberFormatter.format(turnOver) || '-'}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_NextRoundTurnover'),
			key: 'nextTurnOver',
			dataIndex: 'nextTurnOver',
			width: 120,
			editable: true,
			align: 'center' as 'center',
			render: (nextTurnOver: number) => {
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{numberFormatter.format(nextTurnOver) || '-'}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_Updator'),
			key: 'updator',
			dataIndex: 'updator',
			width: 120,
			align: 'center' as 'center',
			render: (updator: string) => {
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{updator || '-'}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: '20%',
			align: 'center' as 'center',
			render: (updateTime: string) => {
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{updateTime
							? dayjs(updateTime)
									.utcOffset(timeZoneUtcOffset)
									.format(timeFormat)
							: '-'}
					</Typography.Text>
				)
			},
		},
	]

	const mergeColumns = columns.map(col => {
		const { title, dataIndex, editable } = col
		if (!editable) return col

		return {
			...col,
			onCell: (record: IRaffleTicketStickerSettingData) => ({
				record,
				title,
				dataIndex,
				editing: isEditing(record),
				inputType: 'number',
			}),
		}
	})

	return (
		<Modal
			width='60%'
			open={visible}
			title={
				<div style={{ textAlign: 'center' }}>
					{t('Label_Raffle_Ticket_And_Sticker_Management')}
				</div>
			}
			onCancel={onCancel}
			destroyOnClose
			footer={false}
		>
			<Form form={editForm} component={false}>
				<Table
					loading={
						isRaffleTicketStickerSettingFetching ||
						isSetRaffleTicketStickerSettingLoading
					}
					components={{
						body: {
							cell: EditableCellRows,
						},
					}}
					columns={mergeColumns}
					dataSource={raffleTicketStickerSettingList || []}
					pagination={false}
					bordered
				/>
			</Form>
		</Modal>
	)
}

export { RaffleTicketAndStickerModal }

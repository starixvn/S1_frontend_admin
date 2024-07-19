import dayjs from 'dayjs'
import { EyeOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { Typography, Table, FormInstance, Form, Tag } from 'antd'
import { timeFormat } from 'common/utils/format'
import { LayoutContent } from 'app/pages/layout'
import { ILotteryEventSettingData } from './type'
import {
	LOTTERY_EVENT_STATUS_DISPLAY_NAME,
	LOTTERY_EVENT_STATUS_TAGS_COLOR,
	LotteryStatusEnum,
} from './contants'

interface IEventManagementTableProps {
	loading?: boolean
	lotteryEventSettingList: ILotteryEventSettingData[]
	timeZoneUtcOffset: number
	form: FormInstance
	onOpenTicketHistoryModal: (args: {
		roundId: number
		startDate: string
		endDate: string
	}) => void
	onOpenEventSettingModal: () => void
}

const EventManagementTable = ({
	loading,
	lotteryEventSettingList,
	timeZoneUtcOffset,
	form,
	onOpenTicketHistoryModal,
	onOpenEventSettingModal,
}: IEventManagementTableProps) => {
	/**  ======= hooks ======= */

	const { t } = useTranslation()

	/**  ======= 函數 ======= */

	const renderTime = (time: string) => (
		<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
			{time ? dayjs(time).utcOffset(timeZoneUtcOffset).format(timeFormat) : '-'}
		</Typography.Text>
	)

	const renderText = (text: string) => (
		<Typography.Text style={{ whiteSpace: 'nowrap' }}>
			{text || '-'}
		</Typography.Text>
	)

	/**  ======= columns ======= */

	const columns = [
		{
			title: t('Label_Round'),
			key: 'roundId',
			dataIndex: 'roundId',
			width: 50,
			align: 'center' as 'center',
			render: renderText,
		},
		{
			title: t('Label_StartTime'),
			key: 'startDate',
			dataIndex: 'startDate',
			width: 120,
			align: 'center' as 'center',
			render: renderTime,
		},
		{
			title: t('Label_EndTime'),
			key: 'endDate',
			dataIndex: 'endDate',
			width: 120,
			align: 'center' as 'center',
			render: renderTime,
		},
		{
			title: t('Label_Draw_Prize_Date'),
			key: 'drawDate',
			dataIndex: 'drawDate',
			width: 120,
			align: 'center' as 'center',
			render: renderTime,
		},
		{
			title: t('Label_Status'),
			key: 'status',
			dataIndex: 'status',
			width: 50,
			align: 'center' as 'center',
			render: (status: number) => {
				/** 標籤顏色 */
				const statusColor =
					LOTTERY_EVENT_STATUS_TAGS_COLOR[status || LotteryStatusEnum.Running]

				/** 標籤文字 */
				const statusText =
					LOTTERY_EVENT_STATUS_DISPLAY_NAME[status || LotteryStatusEnum.Running]

				return <Tag color={statusColor}>{t(statusText)}</Tag>
			},
		},
		{
			title: t('Label_Action'),
			key: 'action',
			width: 50,
			align: 'center' as 'center',
			render: ({
				sq,
				status,
				startDate,
				endDate,
				drawDate,
			}: ILotteryEventSettingData) => {
				return (
					<Typography.Link
						onClick={() => {
							// 將後端的資料存進 EditForm，在開啟 EventSettingModal 時，可以直接使用
							form.setFieldsValue({
								sq,
								status,

								// 後端的資料是 ISO Str 不是 Dayjs 格式，在 EventSettingModal 再轉格式
								startDateISOStr: startDate,
								endDateISOStr: endDate,
								drawDateISOStr: drawDate,
							})
							onOpenEventSettingModal()
						}}
					>
						{t('Label_Edit')}
					</Typography.Link>
				)
			},
		},
		{
			title: t('Label_Result'),
			key: 'result',
			width: 50,
			align: 'center' as 'center',
			render: ({
				roundId,
				startDate,
				endDate,
				status,
			}: ILotteryEventSettingData) => {
				/** 活動是否已經結束，結束才可以查看開獎結果 */
				const isLotteryOver =
					status === LotteryStatusEnum.Done ||
					status === LotteryStatusEnum.Payout
				return (
					<Typography.Link
						onClick={() => {
							if (!isLotteryOver) return
							onOpenTicketHistoryModal({ roundId, startDate, endDate })
						}}
						// Typography.Link 無 disabled 屬性，因此用 style 控制顏色和 cursor
						style={{
							color: isLotteryOver ? undefined : 'grey',
							cursor: isLotteryOver ? 'pointer' : 'not-allowed',
						}}
					>
						<EyeOutlined />
					</Typography.Link>
				)
			},
		},
	]

	return (
		<LayoutContent.Card>
			<Form form={form} component={false}>
				<Table
					loading={loading}
					dataSource={lotteryEventSettingList}
					columns={columns}
					pagination={false}
					bordered
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export { EventManagementTable }

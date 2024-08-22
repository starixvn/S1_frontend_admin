import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, message } from 'antd'
import { useAuth, useModal, useQueryParams } from 'common/hooks'
import dayjs from 'dayjs'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import { selectUserSite } from 'common/enum'
import { dateRangeToUtcFormatter } from 'common/utils'
import { EventManagementFilter } from './EventManagementFilter'
import { EventManagementTable } from './EventManagementTable'
import { RaffleTicketAndStickerModal } from './modals/RaffleTicketAndStickerModal'
import { TicketHistoryModal } from './modals/TicketHistoryModal'
import { MaintainModal } from './modals/MaintainModal'
import {
	useLazyGetLotteryEventSettingQuery,
	useSetLotteryMaintainMutation,
	useSetLotteryEventSettingMutation,
	useAddLotteryEventMutation,
} from './api'
import type {
	TFilterForm,
	IEditOrAddForm,
	TMaintainForm,
	ISetLotteryEventSettingArgs,
	IAddLotteryEventSettingArgs,
} from './type'
import { EditOrAddEventSettingModal } from './modals/EditOrAddEventSettingModal'

const EventManagement = ({ pageTitle = '' }: { pageTitle?: string }) => {
	/**  ======= hooks ======= */

	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [queryParams, setQueryParams] = useQueryParams()

	const [editOrAddForm] = Form.useForm<IEditOrAddForm>()
	const [filterForm] = Form.useForm<TFilterForm>()
	const [maintainForm] = Form.useForm<TMaintainForm>()

	const raffleTicketAndStickerModal = useModal()
	const editOrAddEventSettingModal = useModal()
	const ticketHistoryModal = useModal()
	const maintainModal = useModal()

	/**  ======= api ======= */

	const [
		getLotteryEventSetting,
		{
			data: { data: lotteryEventSettingList = [] } = {},
			isFetching: isGetLotteryEventSettingFetching,
		},
	] = useLazyGetLotteryEventSettingQuery()

	const [
		setLotteryEventSetting,
		{ isLoading: isSetLotteryEventSettingLoading },
	] = useSetLotteryEventSettingMutation()

	const [setLotteryMaintain, { isLoading: isSetLotteryMaintainLoading }] =
		useSetLotteryMaintainMutation()

	const [addLotteryEvent, { isLoading: isAddLotteryEventSettingLoading }] =
		useAddLotteryEventMutation()

	const loading =
		isGetLotteryEventSettingFetching ||
		isSetLotteryEventSettingLoading ||
		isSetLotteryMaintainLoading ||
		isAddLotteryEventSettingLoading

	/**  ======= state ======= */

	// 根據使用者點擊的資料，開啟該筆資料的 TicketHistoryModal 並帶入該資料 roundId 與日期資訊
	const [ticketHistoryModalParams, setTicketHistoryModalParams] = useState<{
		roundId: number // payload
		startDate: string // 標題用
		endDate: string // 標題用
	}>({
		roundId: 0,
		startDate: '',
		endDate: '',
	})

	const [isAddModal, setIsAddModal] = useState<boolean>(false)

	/**  ======= 函數 ======= */

	const handleSearch = async ({
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => {
		if (!siteId) return
		const { dateRange } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)
		try {
			await getLotteryEventSetting({
				siteId,

				// 僅需要送日期給後端，不需要帶時間資訊， ex:2024-08-01 00:00:00 => 2024-08-01
				startDate: startDate.split('T')[0],
				endDate: endDate.split('T')[0],
			}).unwrap()

			setQueryParams({ timeZone: currentTimeZoneUtcOffset, startDate, endDate })
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetMaintain = async () => {
		if (!siteId) return
		try {
			const { dateRange, isMaintain } = maintainForm.getFieldsValue()

			// 將 M2 格式格式化成後端格式 YYYY-MM-DD
			const [startDate, endDate] = dateRangeToUtcFormatter(dateRange)

			const response = await setLotteryMaintain({
				siteId,
				isMaintain,
				beginDate: startDate.split('T')[0],
				endDate: endDate.split('T')[0],
			}).unwrap()

			message.success(response?.message || t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleRowSaved = async () => {
		try {
			const {
				sq,
				dateRange,
				drawDate,
				isSuspend,
				firstPrize,
				secondPrize,
				thirdPrize,
				consolation,
				small,
			} = await editOrAddForm.getFieldsValue(true)

			// 將 M2 格式格式化成後端格式 YYYY-MM-DD
			const [startDate, endDate] = dateRangeToUtcFormatter(dateRange)
			const formattedDrawDate = dayjs(drawDate).format('YYYY-MM-DD')

			const args: ISetLotteryEventSettingArgs = {
				sq,

				// 僅需要送日期給後端，不需要帶時間資訊， ex:2024-08-01 00:00:00 => 2024-08-01
				startDate: startDate.split('T')[0],
				endDate: endDate.split('T')[0],
				drawDate: formattedDrawDate,
				isSuspend,
				firstPrize,
				secondPrize,
				thirdPrize,
				consolation,
				small,
			}

			const response = await setLotteryEventSetting(args).unwrap()
			message.success(response?.message || t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleAdd = async () => {
		if (!siteId) return
		try {
			const {
				dateRange,
				drawDate,
				isSuspend,
				firstPrize,
				secondPrize,
				thirdPrize,
				consolation,
				small,
			} = await editOrAddForm.getFieldsValue(true)

			// 將 M2 格式格式化成後端格式 YYYY-MM-DD
			const [startDate, endDate] = dateRangeToUtcFormatter(dateRange)
			const formattedDrawDate = dayjs(drawDate).format('YYYY-MM-DD')

			const args: IAddLotteryEventSettingArgs = {
				siteId,

				// 僅需要送日期給後端，不需要帶時間資訊， ex:2024-08-01 00:00:00 => 2024-08-01
				startDate: startDate.split('T')[0],
				endDate: endDate.split('T')[0],
				drawDate: formattedDrawDate,
				isSuspend,
				firstPrize,
				secondPrize,
				thirdPrize,
				consolation,
				small,
			}

			const response = await addLotteryEvent(args).unwrap()
			message.success(response?.message || t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	/** 開啟 TicketHistoryModal 並根據該筆資料的 roundId 與日期資訊帶入 Modal
	 *  @paramObject Modal 需要用到的資料 */
	const handlOpenTicketHistoryModal = ({
		roundId, // payload
		startDate, // title 用
		endDate, // title 用
	}: {
		roundId: number
		startDate: string
		endDate: string
	}) => {
		setTicketHistoryModalParams({
			roundId,
			startDate,
			endDate,
		})
		ticketHistoryModal.onOpen()
	}

	useEffect(() => {
		const init = async () => {
			if (isEmpty(queryParams)) return
			const { timeZone, startDate, endDate } = queryParams

			filterForm.setFieldsValue({
				dateRange: [dayjs(startDate), dayjs(endDate)],
			})

			onTimeZoneChange(Number(timeZone))
			handleSearch({
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
		init()
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle} />
			<EventManagementFilter
				form={filterForm}
				loading={loading}
				onSearch={handleSearch}
				editPermission={editPermission}
				onSetRaffleTicketAndSticker={raffleTicketAndStickerModal.onOpen}
				onOpenMaintain={maintainModal.onOpen}
			/>
			{!isEmpty(queryParams) && (
				<EventManagementTable
					lotteryEventSettingList={lotteryEventSettingList}
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					form={editOrAddForm}
					setIsAddModal={setIsAddModal}
					onOpenTicketHistoryModal={handlOpenTicketHistoryModal}
					onOpenEventSettingModal={editOrAddEventSettingModal.onOpen}
				/>
			)}
			<RaffleTicketAndStickerModal
				visible={raffleTicketAndStickerModal.visible}
				onCancel={raffleTicketAndStickerModal.onCancel}
				editPermission={editPermission}
			/>
			<TicketHistoryModal
				visible={ticketHistoryModal.visible}
				onCancel={ticketHistoryModal.onCancel}
				ticketHistoryParams={ticketHistoryModalParams}
			/>
			<EditOrAddEventSettingModal
				visible={editOrAddEventSettingModal.visible}
				onCancel={editOrAddEventSettingModal.onCancel}
				editPermission={editPermission}
				loading={
					isSetLotteryEventSettingLoading || isAddLotteryEventSettingLoading
				}
				form={editOrAddForm}
				isAddModal={isAddModal}
				onAdd={handleAdd}
				onRowSaved={handleRowSaved}
			/>

			<MaintainModal
				visible={maintainModal.visible}
				onCancel={maintainModal.onCancel}
				form={maintainForm}
				onSetMaintain={handleSetMaintain}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					loading={loading}
					onClick={() => {
						setIsAddModal(true)
						editOrAddEventSettingModal.onOpen()
					}}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default EventManagement

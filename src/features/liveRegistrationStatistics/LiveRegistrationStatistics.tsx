import { FC, useEffect, useState } from 'react'
import moment, { Moment } from 'moment'
import download from 'downloadjs'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { Form, message, TablePaginationConfig } from 'antd'
import { useAppSelector } from 'app/store'
import { dateRangeToUtcFormatter } from 'common/utils'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import { LayoutContent } from 'app/pages/layout'
import LiveRegistrationStatisticsFilter from './LiveRegistrationStatisticsFilter'
import {
	useCallingRecordRegistrationManagementMutation,
	useExportRegistrationManagementMutation,
	useLazyGetRegistrationManagementListQuery,
	useSetRegistrationManagementMutation,
} from './api'
import {
	IRegistrationManagementData,
	IRegistrationManagementResponse,
} from './type'
import {
	DormantMemberEnum,
	AgentCodeEnum,
	CallOutStatusEnum,
	DateTypeEnum,
	StatusEnum,
} from './constants'
import LiveRegistrationStatisticsTable from './LiveRegistrationStatisticsTable'
import LiveRegistrationStatisticsNoteModal from './LiveRegistrationStatisticsNoteModal'

const LiveRegistrationStatistics: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()

	const [searchForm] = Form.useForm<{
		currencyId: number
		depositStatus: number
		status: number
		dateRange: [Moment, Moment]
		affiliatesCode: string
		agentCodeType: number
		callOutStatus: number
		dormantUser: number
		dateType: number
		userName: string
	}>()

	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()

	const noteModal = useModal()
	const [noteCustId, setNoteCustId] = useState<number>()

	const [
		getRegistrationManagementList,
		{
			data: {
				data: registrationManagementList = [],
				rowCount: registrationManagementListTotal = 0,
			} = {} as IRegistrationManagementResponse,
			isFetching: isGetRegistrationManagementListFetching,
		},
	] = useLazyGetRegistrationManagementListQuery()

	const [setRegistrationManagement] = useSetRegistrationManagementMutation()

	const [
		exportRegistrationManagement,
		{ isLoading: isExportRegistrationManagementLoading },
	] = useExportRegistrationManagementMutation()

	const [
		callingRecordRegistrationManagement,
		{ isLoading: isCallingRecordRegistrationManagementLoading },
	] = useCallingRecordRegistrationManagementMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: registrationManagementListTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { dateRange, affiliatesCode, ...values } =
			await searchForm.validateFields()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		try {
			await getRegistrationManagementList({
				siteId,
				...values,
				affiliatesCode: affiliatesCode || null,
				pageNumber: current,
				pageSize,
				sort: 0,
				startDate,
				endDate,
			}).unwrap()

			setQueryParams({
				...values,
				pageNumber: current,
				pageSize,
				startDate,
				endDate,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		try {
			const {
				currencyId = currencyListBySite[0]?.currencyId,
				depositStatus = DateTypeEnum.LastActiveDate,
				status = StatusEnum.All,
				affiliatesCode = '',
				agentCodeType = AgentCodeEnum.All,
				callOutStatus,
				dormantUser,
				dateType,
				userName = '',
				startDate,
				endDate,
			} = queryParams
			const blob = await exportRegistrationManagement({
				siteId,
				currencyId,
				depositStatus,
				status,
				callOutStatus,
				dormantUser,
				dateType,
				userName,
				sort: 0,
				startDate,
				endDate,
				affiliatesCode,
				agentCodeType,
			}).unwrap()
			download(
				blob,
				`LiveRegistrationStatistics_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleCallingRecord = async (custId: number) => {
		if (!siteId) return

		try {
			await callingRecordRegistrationManagement({ siteId, custId }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleOpenNoteLogModal = async ({
		custId,
	}: IRegistrationManagementData) => {
		try {
			setNoteCustId(custId)
			noteModal.onOpen()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		await handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleStatusChange = async ({
		custId,
		status,
	}: {
		custId: number
		status: number
	}) => {
		try {
			await setRegistrationManagement({ siteId, custId, status }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (!isEmpty(queryParams)) {
				const {
					currencyId = currencyListBySite[0]?.currencyId,
					depositStatus = DateTypeEnum.LastActiveDate,
					status = StatusEnum.All,
					affiliatesCode = '',
					agentCodeType = AgentCodeEnum.All,
					callOutStatus = CallOutStatusEnum.All,
					dormantUser = DormantMemberEnum.ThreeDaysInactive,
					dateType = DateTypeEnum.LastActiveDate,
					userName = '',
					pageNumber = PAGINATION.defaultCurrent,
					pageSize = PAGINATION.defaultPageSize,
					startDate,
					endDate,
				} = queryParams
				searchForm.setFieldsValue({
					currencyId: Number(currencyId),
					depositStatus: Number(depositStatus),
					status: Number(status),
					affiliatesCode,
					agentCodeType: Number(agentCodeType),
					callOutStatus: Number(callOutStatus),
					dormantUser: Number(dormantUser),
					dateType: Number(dateType),
					userName,
					dateRange: [moment(startDate), moment(endDate)],
				})
				setPagination(prev => ({ ...prev, current: pageNumber, pageSize }))
				handleSearch({
					current: pageNumber,
					pageSize,
				})
			}
		}
		init()
	}, [])

	const loading =
		isGetRegistrationManagementListFetching ||
		isExportRegistrationManagementLoading ||
		isCallingRecordRegistrationManagementLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<LiveRegistrationStatisticsFilter
				loading={loading}
				form={searchForm}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>

			{!isEmpty(queryParams) && (
				<LiveRegistrationStatisticsTable
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					registrationManagementList={registrationManagementList}
					onTableChange={handleTableChange}
					onStatusChange={handleStatusChange}
					onOpenNoteLogModal={handleOpenNoteLogModal}
					onCallingRecord={handleCallingRecord}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={isEmpty(queryParams) || !exportExcelPermission?.canUse}
					loading={loading}
					onClick={handleExport}
				/>
			</AffixButtons>

			<LiveRegistrationStatisticsNoteModal
				modal={noteModal}
				noteCustId={noteCustId}
			/>
		</LayoutContent.Main>
	)
}

export default LiveRegistrationStatistics

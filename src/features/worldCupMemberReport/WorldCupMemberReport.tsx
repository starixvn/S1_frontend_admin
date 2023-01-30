import { FC, useEffect } from 'react'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { useTranslation } from 'react-i18next'
import download from 'downloadjs'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	usePagination,
	useQueryParams,
	PAGINATION,
	useAuth,
} from 'common/hooks'
import { useAppSelector } from 'app/store'
import { dateRangeToUtcFormatter } from 'common/utils'
import { selectUserSite } from 'common/enum'
import { WorldCupMemberReportFilter } from './WorldCupMemberReportFilter'
import {
	useExportMemberReportMutation,
	useGetWorldCupTeamsQuery,
	useLazyGetMemberReportQuery,
} from './api'
import { IGetMemberReportResponse, IWorldCupTeamResponse } from './type'
import { WorldCupMemberReportTable } from './WorldCupMemberReportTable'

const WorldCupMemberReport: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()

	const [
		getMemberReport,
		{
			data: {
				data: memberReportData,
				rowCount: memberReportTotal = 0,
			} = {} as IGetMemberReportResponse,
			isFetching: isGetMemberReportLoading,
		},
	] = useLazyGetMemberReportQuery()
	const [pagination, setPagination] = usePagination({
		paginationTotal: memberReportTotal,
	})
	const [exportMemberReport, { isLoading: isExportMemberReportLoading }] =
		useExportMemberReportMutation()

	const {
		data: { data: worldCupTeamsList } = {} as IWorldCupTeamResponse,
		isLoading: isGetWorldCupTeamsLoading,
	} = useGetWorldCupTeamsQuery(null)

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { userName, dateRange, currencyId, ticketType, teamId, selected } =
			form.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)
		try {
			await getMemberReport({
				siteId,
				userName,
				currencyId,
				ticketType,
				teamId,
				selected,
				startTime,
				endTime,
				pageSize,
				pageNumber: current,
			}).unwrap()
			setQueryParams({
				userName,
				currencyId,
				ticketType,
				teamId,
				selected,
				startTime,
				endTime,
				pageNumber: current,
				pageSize,
				timeZone: currentTimeZoneUtcOffset,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
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
		handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleExport = async () => {
		const {
			userName = '',
			currencyId = 0,
			ticketType = 0,
			teamId = 0,
			selected = 0,
			startTime,
			endTime,
		} = queryParams

		try {
			const blob = await exportMemberReport({
				siteId,
				userName,
				currencyId: Number(currencyId),
				ticketType: Number(ticketType),
				teamId: Number(teamId),
				selected: Number(selected),
				startTime,
				endTime,
			}).unwrap()
			download(
				blob,
				`ExportWorldCupMemberReport${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) return
			const {
				userName = '',
				currencyId = 0,
				ticketType = 0,
				teamId = 0,
				selected = 0,
				startTime,
				endTime,
				pageNumber,
				pageSize,
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))

			form.setFieldsValue({
				dateRange: [moment(startTime), moment(endTime)],
				userName,
				currencyId: Number(currencyId),
				ticketType: Number(ticketType),
				teamId: Number(teamId),
				selected: Number(selected),
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
		init()
	}, [])

	const loading = isGetMemberReportLoading || isGetWorldCupTeamsLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<WorldCupMemberReportFilter
				form={form}
				loading={loading}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
				timeZoneUtcOffset={timeZoneUtcOffset}
				worldCupTeamList={worldCupTeamsList}
			/>
			<WorldCupMemberReportTable
				loading={loading}
				worldCupMemberReportData={memberReportData}
				pagination={pagination}
				onTableChange={handleTableChange}
				timeZoneUtcOffset={timeZoneUtcOffset}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportMemberReportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default WorldCupMemberReport

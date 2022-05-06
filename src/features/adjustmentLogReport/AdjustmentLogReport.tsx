import _ from 'lodash'
import moment from 'moment'
import { useEffect } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTimeZone, dateRangeToUtcFormatter } from 'components/TimeZoneSelect'
import { PAGINATION, usePagination, useQueryParams } from 'common/hooks'
import { useAppDispatch, useAppSelector } from 'app/store'
import { withOutSiteIdParams } from 'common/utils'
import { selectUserSite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import { AdjustmentLogReportFilter } from './AdjustmentLogReportFilter'
import { fetchLogReportListAsync } from './thunk'
import { AdjustmentLogReportTable } from './AdjustmentLogReportTable'
import {
	selectAdjustmentLogReportStatus,
	setAdjustmentLogReportStatus,
} from './slice'

const AdjustmentLogReport = () => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm()

	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const userSite = useAppSelector(selectUserSite)

	const adjustmentLogReportStatus = useAppSelector(
		selectAdjustmentLogReportStatus
	)
	const paginationTotal = useAppSelector(
		state => state.adjustmentLogReport.paginationTotal
	)

	const [pagination, setPagination] = usePagination({ paginationTotal })

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { actionTypes, currencyIds, menus, transId, userName, dateRange } =
			form.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		setQueryParams({
			actionTypes,
			currencyIds,
			menus,
			transId,
			userName,
			startDate,
			endDate,
			current,
			pageSize,
			tz: timeZoneUtcOffset,
		})

		try {
			await dispatch(
				fetchLogReportListAsync({
					pageNumber: current,
					pageSize,
					actionTypes,
					currencyIds,
					menus,
					transId,
					userName,
					startDate,
					endDate,
					siteIds: userSite?.siteId ? [userSite?.siteId] : [],
				})
			)

			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const { current, pageSize } = newPagination

		await handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	useEffect(() => {
		if (!userSite?.siteId) return

		const init = async () => {
			if (_.isEmpty(withOutSiteIdParams(queryParams))) return

			const {
				actionTypes,
				currencyIds,
				menus,
				transId,
				userName,
				startDate,
				endDate,
				current,
				pageSize,
				tz,
			} = queryParams

			onTimeZoneChange(Number(tz))

			form.setFieldsValue({
				actionTypes: _.isArray(actionTypes)
					? actionTypes.map((actionType: string) => Number(actionType))
					: [],
				currencyIds: _.isArray(currencyIds)
					? currencyIds.map((currencyId: string) => Number(currencyId))
					: [],
				menus: _.isArray(menus)
					? menus.map((currencyId: string) => Number(currencyId))
					: [],
				transId,
				userName,
				dateRange: [moment(startDate), moment(endDate)],
			})

			handleSearch({
				current: Number(current),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(tz),
			})
		}

		init()
	}, [userSite?.siteId])

	useEffect(() => {
		return () => {
			dispatch(setAdjustmentLogReportStatus('idle'))
		}
	}, [])

	const loading = adjustmentLogReportStatus === 'pending'

	return (
		<main>
			<LayoutContent.Title title={t('Label_AdjustmentLogReport')} />

			<AdjustmentLogReportFilter
				form={form}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>

			{adjustmentLogReportStatus !== 'idle' && (
				<AdjustmentLogReportTable
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
			</AffixButtons>
		</main>
	)
}

export default AdjustmentLogReport

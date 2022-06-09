import { FC, useEffect, useState } from 'react'
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
import { IGetReferralReportResponse } from './type'
import {
	useLazyGetReferralReportQuery,
	useExportReferralReportFileMutation,
} from './api'
import { ReferralReportFilter } from './ReferralReportFilter'
import { ReferralReportTable } from './ReferralReportTable'

const ReferralReport: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const userSite = useAppSelector(selectUserSite)
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [range, setRange] = useState({ startDate: '', endDate: '' })
	const [
		getReferralReport,
		{
			data: {
				data: referralReportData,
				rowCount: referralReportPaginationTotal = 0,
			} = {} as IGetReferralReportResponse,
			isFetching: isGetReferralReportFetching,
		},
	] = useLazyGetReferralReportQuery()

	const [
		exportReferralReportFile,
		{ isLoading: isExportReferralReportFileLoading },
	] = useExportReferralReportFileMutation()
	const [pagination, setPagination] = usePagination({
		paginationTotal: referralReportPaginationTotal,
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
		const { userName = '', currencyId = 0, dateRange } = form.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)
		const siteIds = userSite?.siteId ? [userSite?.siteId] : []
		setRange({ startDate, endDate })
		try {
			await getReferralReport({
				pageNumber: current,
				pageSize,
				startDate,
				endDate,
				userName,
				currencyId,
				siteIds,
			}).unwrap()
			setQueryParams({
				pageNumber: current,
				pageSize,
				startDate,
				endDate,
				userName,
				currencyId,
				siteId: userSite?.siteId,
				timeZone: currentTimeZoneUtcOffset,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		try {
			const { userName = '', currencyId = 0, dateRange } = form.getFieldsValue()
			const [startDate, endDate] = dateRangeToUtcFormatter(
				dateRange,
				timeZoneUtcOffset
			)
			const siteIds = userSite?.siteId ? [userSite?.siteId] : []
			const blob = await exportReferralReportFile({
				userName,
				currencyId,
				startDate,
				endDate,
				siteIds,
			}).unwrap()
			download(
				blob,
				`ExportReferralReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
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

	useEffect(() => {
		if (!userSite?.siteId) return
		const init = () => {
			if (isEmpty(queryParams)) return
			const {
				userName = '',
				currencyId = 0,
				startDate,
				endDate,
				timeZone,
				pageNumber,
				pageSize,
			} = queryParams
			onTimeZoneChange(Number(timeZone))

			form.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				userName,
				currencyId,
			})

			handleSearch({
				current: pageNumber,
				pageSize,
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
		init()
	}, [userSite?.siteId])

	const loading = isGetReferralReportFetching
	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<ReferralReportFilter
				form={form}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<ReferralReportTable
					loading={loading}
					referralReportData={referralReportData}
					pagination={pagination}
					onTableChange={handleTableChange}
					dateRange={range}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
					loading={isExportReferralReportFileLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default ReferralReport

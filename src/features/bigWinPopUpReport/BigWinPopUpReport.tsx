import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, message } from 'antd'
import moment from 'moment/moment'
import { isEmpty } from 'lodash'
import download from 'downloadjs'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useAuth, useQueryParams } from 'common/hooks'
import { selectUserSite } from 'common/enum'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import {
	useExportBigWinReportMutation,
	useLazyGetBigWinReportQuery,
} from 'features/bigWinPopUpReport/api'
import { IFilterForm } from 'features/bigWinPopUpReport/type'
import BigWinPopUpReportFilter from 'features/bigWinPopUpReport/BigWinPopUpReportFilter'
import BigWinPopUpReportTable from 'features/bigWinPopUpReport/BigWinPopUpReportTable'

const BigWinPopUpReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm<IFilterForm>()

	const [
		getBigWinReport,
		{
			data: { data: bigWinReportList = [] } = {},
			isFetching: isGetBigWinReportListFetching,
		},
	] = useLazyGetBigWinReportQuery()

	const [exportBigWinReport, { isLoading: isExportBigWinReportLoading }] =
		useExportBigWinReportMutation()

	const handleSearch = async ({
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => {
		if (!siteId) return
		const { dateRange, currencyId } = await form.validateFields()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)
		try {
			const args = { startDate, endDate, currencyId, siteId }
			await getBigWinReport(args).unwrap()
			setQueryParams(args)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		const { startDate, endDate, currencyId, siteId: querySiteId } = queryParams
		try {
			const blob = await exportBigWinReport({
				startDate,
				endDate,
				currencyId,
				siteId: querySiteId,
			}).unwrap()
			download(
				blob,
				`exportBigWinReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = async () => {
			const { startDate, endDate, currencyId } = queryParams
			form.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				currencyId:
					currencyId?.map((strCurrencyId: string) => Number(strCurrencyId)) ??
					[],
			})
			handleSearch({})
		}
		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	const loading = isGetBigWinReportListFetching || isExportBigWinReportLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<BigWinPopUpReportFilter
				form={form}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<BigWinPopUpReportTable
					loading={loading}
					bigWinReportList={bigWinReportList}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={loading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BigWinPopUpReport

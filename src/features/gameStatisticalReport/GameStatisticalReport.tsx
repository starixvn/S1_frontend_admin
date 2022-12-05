import { useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { Form, message } from 'antd'
import download from 'downloadjs'
import moment from 'moment/moment'
import { assign, cloneDeep, isEmpty } from 'lodash'
import { useAppSelector } from 'app/store'
import { useAuth, useQueryParams } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { dateRangeToUtcFormatter } from 'common/utils'
import { selectUserSite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import {
	useGetGameStatisticalReportListQuery,
	useExportGameStatisticalReportMutation,
} from './api'
import { IGameStatisticalReportResponse, IForm } from './type'
import GameStatisticalReportTab from './GameStatisticalReportTab'
import GameStatisticalReportFilter from './GameStatisticalReportFilter'

const GameStatisticalReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm<IForm>()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const dateRange = Form.useWatch('dateRange', form)
	const [queryParams, setQueryParams] = useQueryParams()
	const [tabActiveKey, setActiveKey] = useState<string | undefined>()
	const [startDate, endDate] = dateRangeToUtcFormatter(
		dateRange,
		timeZoneUtcOffset
	)

	const {
		data: {
			data: gameStatisticalReportData = [],
		} = {} as IGameStatisticalReportResponse,
		isFetching: isGameStatisticalReportFetching,
	} = useGetGameStatisticalReportListQuery(
		{
			siteId,
			startDate,
			endDate,
		},
		{
			skip: !startDate || !endDate,
			selectFromResult: result => {
				const newResult = cloneDeep(result)
				const { isError, data, isFetching, isUninitialized } = result
				const emptyStatus = isError || isFetching || isUninitialized
				return assign(newResult, {
					data: { ...newResult?.data, data: emptyStatus ? [] : data?.data },
				})
			},
		}
	)

	const [
		exportGameStatisticalReport,
		{ isLoading: isExportGameStatisticalReport },
	] = useExportGameStatisticalReportMutation()

	const handleExport = async () => {
		try {
			const blob = await exportGameStatisticalReport({
				siteId,
				startDate,
				endDate,
			}).unwrap()
			download(
				blob,
				`ExportGameStatisticalReportReport_${moment().format('YYYYMMDD')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTabsChange = async (key: string) => {
		if (!key) return
		setActiveKey(key)
		setQueryParams(assign(queryParams, { currencyId: key }))
	}

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) return

			const {
				currencyId,
				startDate: queryStart,
				endDate: queryEndDate,
				timeZone,
			} = queryParams

			onTimeZoneChange(Number(timeZone))
			form.setFieldsValue({
				dateRange: [moment(queryStart), moment(queryEndDate)],
			})
			setActiveKey(currencyId)
		}
		init()
	}, [])

	useEffect(() => {
		setQueryParams({
			startDate,
			endDate,
			timeZone: timeZoneUtcOffset,
		})
	}, [isGameStatisticalReportFetching])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<GameStatisticalReportFilter
				form={form}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
			/>
			<GameStatisticalReportTab
				tabActiveKey={tabActiveKey}
				loading={isGameStatisticalReportFetching}
				gameStatisticalReportData={gameStatisticalReportData}
				onTabsChange={handleTabsChange}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					loading={isExportGameStatisticalReport}
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default GameStatisticalReport

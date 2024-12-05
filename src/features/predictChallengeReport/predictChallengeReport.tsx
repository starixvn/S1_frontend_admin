import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import download from 'downloadjs'
import { useEffect } from 'react'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useTimeZone } from 'components/TimeZoneSelect'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useAuth, useQueryParams } from 'common/hooks'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { Form, message } from 'antd'
import type { IClaimPredictPromotionArgs, IFilterForm } from './type'
import { AffixButtons } from '../../components/AffixButtons'
import {
	useClaimPredictPromotionMutation,
	useExportPredictionChallengeReportMutation,
	useLazyGetPredictionChallengeReportQuery,
} from './api'
import PredictChallengeReportFilter from './predictChallengeReportFilter'
import PredictChallengeReportTable from './predictChallengeReportTable'

const PredictChallengeReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { exportExcelPermission, addPermission } = {} } =
		useAuth()
	const [queryParams, setQueryParams] = useQueryParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const [filterForm] = Form.useForm<IFilterForm>()

	const [
		getPredictionChallengeReport,
		{
			data: { data: predictionChallengeReportList = [] } = {},
			isFetching: isPredictionChallengeReportListFetching,
		},
	] = useLazyGetPredictionChallengeReportQuery()

	const [
		exportPredictionChallengeReport,
		{ isLoading: isExportPredictionChallengeReportLoading },
	] = useExportPredictionChallengeReportMutation()

	const handleSearch = async ({
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => {
		if (!siteId) return
		const {
			dateRange,
			currencyIds,
			userName,
			predictStatusList = [],
		} = filterForm.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)
		const args = {
			siteId,
			currencyIds,
			userName,
			startTime,
			endTime,
			predictStatusList,
		}

		try {
			await getPredictionChallengeReport(args).unwrap()
			setQueryParams({ timeZone: currentTimeZoneUtcOffset, ...args })
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const [claimPrediction, { isLoading: isClaimPredictionLoading }] =
		useClaimPredictPromotionMutation()

	const handleExport = async () => {
		const {
			currencyIds = [],
			userName,
			startTime,
			endTime,
			predictStatusList = [],
		} = queryParams
		try {
			const blob = await exportPredictionChallengeReport({
				siteId,
				currencyIds: currencyIds.map((value: string) => Number(value)),
				userName,
				startTime,
				endTime,
				predictStatusList: predictStatusList
					? predictStatusList.map((predictStatus: string) =>
							Number(predictStatus)
					  )
					: [],
			}).unwrap()
			download(
				blob,
				`ExportPredictionChallengeReport${dayjs().format(
					'YYYYMMDDHHmmss'
				)}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleClaimPrediction = async ({
		bonusCode,
		matchId,
		custIdList,
		currencyId,
	}: IClaimPredictPromotionArgs) => {
		try {
			const response = await claimPrediction({
				bonusCode,
				matchId,
				currencyId,
				custIdList,
			}).unwrap()
			message.success(response?.message || t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const filterLoading =
		isPredictionChallengeReportListFetching || isClaimPredictionLoading

	useEffect(() => {
		const init = () => {
			const {
				currencyIds = [],
				userName,
				startTime,
				endTime,
				predictStatusList = [],
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [dayjs(startTime), dayjs(endTime)],
				currencyIds: currencyIds.map((currency: string) => Number(currency)),
				userName,
				predictStatusList: predictStatusList
					? predictStatusList.map((predictStatus: string) =>
							Number(predictStatus)
					  )
					: [],
			})
			handleSearch({
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<PredictChallengeReportFilter
				form={filterForm}
				loading={filterLoading}
				currencyListBySite={currencyListBySite}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>

			{!isEmpty(queryParams) && (
				<PredictChallengeReportTable
					loading={filterLoading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					addPermission={addPermission}
					onClaimPrediction={handleClaimPrediction}
					predictionChallengeReportList={predictionChallengeReportList}
				/>
			)}
			<AffixButtons>
				<AffixButtons.FileExport
					loading={isExportPredictionChallengeReportLoading}
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default PredictChallengeReport

import { LayoutContent } from 'app/pages/layout'
import { useTimeZone } from 'components/TimeZoneSelect'
import { isEmpty, first } from 'lodash'
import WithdrawalPaymentReportTable from 'features/withdrawalPaymentReport/WithdrawalPaymentReportTable'
import WithdrawalPaymentReportFilter from 'features/withdrawalPaymentReport/WithdrawalPaymentReportFilter'
import { useTranslation } from 'react-i18next'
import { useAuth, useQueryParams } from 'common/hooks'
import { useAppSelector } from 'app/store'
import {
	selectAllSiteEnableCurrencyList,
	selectCurrencyIdsBySiteIds,
	selectUserSiteList,
} from 'common/enum'
import { Form, message } from 'antd'
import { useGetGateWayQuery } from 'common/service/allDataApi'
import { useGetEnumTypeQuery, IEnumTypeResponse } from 'common/service/enumApi'

import {
	useGetWithdrawalPaymentReportTypeQuery,
	useLazyGetWithdrawalPaymentReportQuery,
	useExportWithdrawalPaymentReportMutation,
} from 'features/withdrawalPaymentReport/api'
import { IFilterForm } from 'features/withdrawalPaymentReport/type'
import { AffixButtons } from 'components/AffixButtons'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useEffect, useState } from 'react'
import { TableConverter } from 'features/withdrawalPaymentReport/utils'
import moment from 'moment/moment'
import download from 'downloadjs'

const WithdrawalPaymentReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const [filterForm] = Form.useForm<IFilterForm>()
	const watchSiteIds = Form.useWatch('siteIds', filterForm)
	const currencyIdsBySiteIds = useAppSelector(state =>
		selectCurrencyIdsBySiteIds(state, watchSiteIds || [])
	)
	const currencyListByAllSite = useAppSelector(selectAllSiteEnableCurrencyList)
	const userSiteList = useAppSelector(selectUserSiteList)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const [tableData, setTableData] = useState<object[]>([])

	const {
		data: { data: groupByList = [] } = {} as IEnumTypeResponse,
		isLoading: isGroupByListLoading,
	} = useGetEnumTypeQuery({ enumName: 'PaymentReportGroupByEnum' })

	const {
		data: { data: gateWayList = [] } = {},
		isLoading: isGateWayListLoading,
	} = useGetGateWayQuery({ siteIds: watchSiteIds })

	const {
		data: { data: getWithdrawalTypeList = [] } = {},
		isLoading: isGetWithdrawalTypeLoading,
	} = useGetWithdrawalPaymentReportTypeQuery(null)

	const [getWithdrawalReport, { isFetching: isGetWithdrawalLoading }] =
		useLazyGetWithdrawalPaymentReportQuery()

	const [
		exportBankFinancialReport,
		{ isLoading: isExportWithdrawalReportLoading },
	] = useExportWithdrawalPaymentReportMutation()

	const handleSearch = async ({
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => {
		const {
			dateRange,
			siteIds,
			currencyIds,
			baseCurrencyId,
			payIds,
			types,
			userNames,
			groupBy,
		} = filterForm.getFieldsValue()

		const [startTime, endTime] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		try {
			const { data: withdrawalPaymentReport } = await getWithdrawalReport({
				currencyIds,
				siteIds,
				baseCurrencyId,
				payIds,
				types,
				userNames,
				startTime,
				endTime,
				groupBy,
			}).unwrap()

			const { dataSource } = TableConverter.withdrawalReportConverter(
				withdrawalPaymentReport
			)

			setTableData(dataSource)

			setQueryParams({
				startTime,
				endTime,
				currencyIds,
				baseCurrencyId,
				payIds,
				types,
				userNames,
				groupBy,
				timeZone: currentTimeZoneUtcOffset,
				siteIds,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		const {
			startTime,
			endTime,
			baseCurrencyId,
			payIds,
			types,
			userNames,
			groupBy,
			currencyIds,
			siteIds,
		} = queryParams
		try {
			const blob = await exportBankFinancialReport({
				currencyIds,
				siteIds,
				baseCurrencyId,
				payIds,
				types,
				userNames,
				startTime,
				endTime,
				groupBy,
			}).unwrap()

			download(
				blob,
				`ExportWithdrawalReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const filterLoading =
		isGroupByListLoading || isGateWayListLoading || isGetWithdrawalTypeLoading
	useEffect(() => {
		// init
		const init = () => {
			if (isEmpty(queryParams)) {
				filterForm.setFieldsValue({
					siteIds: userSiteList.map(item => item.siteId),
					payIds: gateWayList?.map(({ payId }) => payId),
					types: getWithdrawalTypeList?.map(({ value }) => value),
					baseCurrencyId:
						first(currencyIdsBySiteIds)?.currencyId ??
						currencyListByAllSite[0].currencyId,
					groupBy: first(groupByList)?.name,
					currencyIds: currencyListByAllSite?.map(
						({ currencyId }) => currencyId
					),
				})
			} else {
				const {
					startTime,
					endTime,
					currencyIds = [],
					baseCurrencyId = first(currencyIdsBySiteIds)?.currencyId,
					payIds,
					types,
					userNames,
					groupBy,
					timeZone,
					siteIds,
				} = queryParams
				onTimeZoneChange(Number(timeZone))
				filterForm.setFieldsValue({
					dateRange: [moment(startTime), moment(endTime)],
					currencyIds: currencyIds.map((currency: string) => Number(currency)),
					baseCurrencyId: Number(baseCurrencyId),
					payIds: payIds ? payIds.map((value: string) => Number(value)) : [],
					types: types ? types.map((value: string) => Number(value)) : [],
					userNames,
					groupBy: groupBy ?? '',
					siteIds: siteIds ? siteIds.map((value: string) => Number(value)) : [],
				})

				handleSearch({
					currentTimeZoneUtcOffset: Number(timeZone),
				})
			}
		}
		if (!filterLoading) {
			init()
		}
	}, [filterLoading])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<WithdrawalPaymentReportFilter
				loading={isGetWithdrawalLoading}
				filterLoading={filterLoading}
				form={filterForm}
				timeZoneUtcOffset={timeZoneUtcOffset}
				userSiteList={userSiteList}
				currencyIdsBySiteIds={currencyIdsBySiteIds}
				currencyListByAllSite={currencyListByAllSite}
				groupByList={groupByList}
				gateWayList={gateWayList}
				getWithdrawalTypeList={getWithdrawalTypeList}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<WithdrawalPaymentReportTable
					loading={isGetWithdrawalLoading}
					tableData={tableData}
				/>
			)}

			<AffixButtons>
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportWithdrawalReportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default WithdrawalPaymentReport

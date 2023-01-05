import { LayoutContent } from 'app/pages/layout'
import DepositPaymentReportFilter from 'features/depositPaymentReport/DepositPaymentReportFilter'
import DepositPaymentReportTable from 'features/depositPaymentReport/DepositPaymentReportTable'
import { useTimeZone } from 'components/TimeZoneSelect'
import { first, isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useAuth, useQueryParams } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { Form, message } from 'antd'
import { useGetGateWayQuery } from 'common/service/allDataApi'

import {
	useGetDepositPaymentReportTypeQuery,
	useLazyGetDepositPaymentReportQuery,
	useExportDepositPaymentReportMutation,
} from 'features/depositPaymentReport/api'
import { IFilterForm } from 'features/depositPaymentReport/type'
import { AffixButtons } from 'components/AffixButtons'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useEffect, useState } from 'react'
import { TableConverter } from 'features/depositPaymentReport/utils'
import moment from 'moment'
import download from 'downloadjs'
import { useGetEnumTypeQuery, IEnumTypeResponse } from 'common/service/enumApi'

const DepositPaymentReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [tableData, setTableData] = useState<object[]>([])

	const {
		data: { data: groupByList = [] } = {} as IEnumTypeResponse,
		isLoading: isGroupByListLoading,
	} = useGetEnumTypeQuery({ enumName: 'PaymentReportGroupByEnum' })

	const {
		data: { data: gateWayList = [] } = {},
		isLoading: isGateWayListLoading,
	} = useGetGateWayQuery({ siteId })

	const {
		data: { data: getDepositTypeList = [] } = {},
		isLoading: isGetDepositTypeLoading,
	} = useGetDepositPaymentReportTypeQuery(null)

	const [getDepositReport, { isFetching: isGetDepositLoading }] =
		useLazyGetDepositPaymentReportQuery()

	const [exportDepositReport, { isLoading: isExportDepositReport }] =
		useExportDepositPaymentReportMutation()

	const handleSearch = async ({
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => {
		if (!siteId) return
		const {
			dateRange,
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
			const { data: depositPaymentReport } = await getDepositReport({
				siteId,
				currencyIds,
				baseCurrencyId,
				payIds,
				types,
				userNames,
				startTime,
				endTime,
				groupBy,
			}).unwrap()
			const { dataSource } =
				TableConverter.depositReportReportConverter(depositPaymentReport)

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
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		if (!siteId) return
		const {
			startTime,
			endTime,
			currencyIds = [],
			baseCurrencyId,
			payIds,
			types,
			userNames,
			groupBy,
		} = queryParams
		try {
			const blob = await exportDepositReport({
				siteId,
				currencyIds,
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
				`ExportDepositReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const filterLoading =
		isGroupByListLoading || isGateWayListLoading || isGetDepositTypeLoading

	useEffect(() => {
		// init
		const init = () => {
			if (isEmpty(queryParams)) {
				filterForm.setFieldsValue({
					payIds: gateWayList?.map(({ payId }) => payId),
					types: getDepositTypeList?.map(({ value }) => value),
					baseCurrencyId: first(currencyListBySite)?.currencyId,
					groupBy: first(groupByList)?.name,
				})
			} else {
				const {
					startTime,
					endTime,
					currencyIds = [],
					baseCurrencyId = first(currencyListBySite)?.currencyId,
					payIds,
					types,
					userNames,
					groupBy,
					timeZone,
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
				})

				handleSearch({})
			}
		}
		if (!filterLoading) {
			init()
		}
	}, [filterLoading])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<DepositPaymentReportFilter
				loading={isGetDepositLoading}
				filterLoading={filterLoading}
				form={filterForm}
				timeZoneUtcOffset={timeZoneUtcOffset}
				currencyListBySite={currencyListBySite}
				groupByList={groupByList}
				gateWayList={gateWayList}
				getDepositTypeList={getDepositTypeList}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>

			{!isEmpty(queryParams) && (
				<DepositPaymentReportTable
					loading={isGetDepositLoading}
					tableData={tableData}
				/>
			)}
			<AffixButtons>
				<AffixButtons.FileExport
					loading={isExportDepositReport}
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default DepositPaymentReport

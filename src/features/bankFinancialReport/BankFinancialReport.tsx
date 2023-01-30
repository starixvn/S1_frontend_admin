import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useAuth, useQueryParams } from 'common/hooks'
import { LayoutContent } from 'app/pages/layout'
import {
	useExportBankFinancialReportMutation,
	useGetFinancialAccountListQuery,
	useLazyGetBankFinancialReportQuery,
} from 'features/bankFinancialReport/api'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { useGetAgentListQuery } from 'features/bankCardManagement/api'
import { AffixButtons } from 'components/AffixButtons'
import { BankFinancialReportFilter } from 'features/bankFinancialReport/BankFinancialReportFilter'
import { Form, message } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	IFilterForm,
	ITableColumnsInfo,
} from 'features/bankFinancialReport/type'
import { dateRangeToUtcFormatter } from 'common/utils'
import download from 'downloadjs'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import { TableConverter } from 'features/bankFinancialReport/utils'
import { BankFinancialReportTable } from 'features/bankFinancialReport/BankFinancialReportTable'
import { isEmpty } from 'lodash'

const BankFinancialReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<IFilterForm>()

	const [tableColumnInfo, setTableColumnInfo] = useState<ITableColumnsInfo[]>(
		[]
	)
	// 因為資料是動態的，所以這裡無法給予型別
	const [tableData, setTableData] = useState<object[]>([])

	const {
		data: { data: financialAccountList = [] } = {},
		isLoading: isGetFinancialAccountListLoading,
	} = useGetFinancialAccountListQuery({ siteId, purposes: null }) // purposes 帶 null 取全部

	const {
		data: { data: transferChannelList = [] } = {},
		isLoading: isGetTransferChannelLoading,
	} = useGetEnumTypeQuery({ enumName: 'TransferChannelEnum' })

	const {
		data: { data: agentList = [] } = {},
		isLoading: isGetAgentListLoading,
	} = useGetAgentListQuery({ siteId })

	const [
		getBankFinancialReport,
		{ isFetching: isGetBankFinancialReportLoading },
	] = useLazyGetBankFinancialReportQuery()

	const [
		exportBankFinancialReport,
		{ isLoading: isExportBankFinancialReportLoading },
	] = useExportBankFinancialReportMutation()

	const handleSearch = async ({
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => {
		const {
			dateRange,
			channel: rawChannel,
			agents: rawAgents,
			financialAccountIds: rawAccountIds,
			currencyIds,
		} = filterForm.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		// 全選的話送 null
		const channel =
			rawChannel.length === transferChannelList.length
				? null
				: (rawChannel as number[])
		const agents = rawAgents.length === agentList.length ? null : rawAgents
		const financialAccountIds =
			rawAccountIds.length === financialAccountList.length
				? null
				: (rawAccountIds as number[])

		try {
			const { data: bankFinancialReport } = await getBankFinancialReport({
				siteId,
				startTime,
				endTime,
				currencyIds,
				channel,
				agents,
				financialAccountIds,
			}).unwrap()

			const { dataSource, columnInfo } =
				TableConverter.financialReportConverter(bankFinancialReport)

			setTableColumnInfo(columnInfo)
			setTableData(dataSource)

			setQueryParams({
				startTime,
				endTime,
				currencyIds,
				channel,
				agents,
				financialAccountIds,
				timeZone: currentTimeZoneUtcOffset,
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
			currencyIds,
			channel,
			agents,
			financialAccountIds,
		} = queryParams

		try {
			const blob = await exportBankFinancialReport({
				siteId,
				startTime,
				endTime,
				currencyIds:
					currencyIds?.map((currencyId: string) => Number(currencyId)) ?? [],
				channel: channel?.map((value: string) => Number(value)) ?? null,
				agents,
				financialAccountIds:
					financialAccountIds?.map((accountId: string) => Number(accountId)) ??
					null,
			}).unwrap()

			download(
				blob,
				`BankFinancialReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const filterLoading =
		isGetFinancialAccountListLoading ||
		isGetTransferChannelLoading ||
		isGetAgentListLoading

	useEffect(() => {
		// init
		const init = () => {
			if (isEmpty(queryParams)) {
				filterForm.setFieldsValue({
					channel: transferChannelList.map(({ value }) => value),
					agents: agentList.map(agent => agent),
					financialAccountIds: financialAccountList.map(
						({ financialId }) => financialId
					),
				})
			} else {
				const {
					startTime,
					endTime,
					currencyIds = [],
					channel,
					agents,
					financialAccountIds,
					timeZone,
				} = queryParams

				onTimeZoneChange(Number(timeZone))
				filterForm.setFieldsValue({
					dateRange: [moment(startTime), moment(endTime)],
					currencyIds: currencyIds.map((currency: string) => Number(currency)),
					channel: channel
						? channel?.map((value: string) => Number(value))
						: transferChannelList.map(({ value }) => value),
					agents: agents ?? agentList.map(agent => agent),
					financialAccountIds: financialAccountIds
						? financialAccountIds?.map((id: string) => Number(id))
						: financialAccountList.map(({ financialId }) => financialId),
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
			<BankFinancialReportFilter
				form={filterForm}
				filterLoading={filterLoading}
				loading={isGetBankFinancialReportLoading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				currencyListBySite={currencyListBySite}
				transferChannelList={transferChannelList}
				financialAccountList={financialAccountList}
				agentList={agentList}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<BankFinancialReportTable
					loading={isGetBankFinancialReportLoading}
					tableColumnInfo={tableColumnInfo}
					tableData={tableData}
				/>
			)}
			<AffixButtons>
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportBankFinancialReportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BankFinancialReport

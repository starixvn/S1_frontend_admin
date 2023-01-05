import download from 'downloadjs'
import { first, isEmpty } from 'lodash'
import moment from 'moment'
import { useEffect } from 'react'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import { useGetEnumTypeQuery } from 'common/service/enumApi'

import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'

import {
	useLazyGetIovationReportQuery,
	useExportIovationReportMutation,
} from 'features/iovation/api'
import { IFilterForm } from 'features/iovation/type'
import IovationFilter from 'features/iovation/IovationFilter'
import IovationTable from 'features/iovation/IovationTable'
import IovationAssociateAccountModal from 'features/iovation/IovationAssociateAccountModal'

const Iovation = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [form] = Form.useForm<IFilterForm>()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const {
		data: { data: iovationDeviceTypeList = [] } = {},
		isLoading: isIovationDeviceTypeListLoading,
	} = useGetEnumTypeQuery({ enumName: 'IovationDeviceType' })

	const [
		getIovationReport,
		{
			data: {
				data: IovationReportList = [],
				rowCount: paginationTotal = 0,
			} = {},
			isFetching: isGetIvationReportFetching,
		},
	] = useLazyGetIovationReportQuery()

	const [exportIovationReport, { isLoading: isExportIovationReportLoading }] =
		useExportIovationReportMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal,
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
		if (!siteId) return
		const { dateRange, ...args } = await form.validateFields()

		const [startTime, endTime] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		try {
			await getIovationReport({
				startTime,
				endTime,
				pageNumber: current,
				pageSize,
				...args,
			}).unwrap()
			setQueryParams({
				startTime,
				endTime,
				timeZone: timeZoneUtcOffset,
				pageNumber: current,
				pageSize,
				...args,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		if (!siteId) return

		const { startTime, endTime, currencyId, deviceId, deviceType, userName } =
			queryParams

		try {
			const blob = await exportIovationReport({
				currencyId: Number(currencyId),
				deviceType: Number(deviceType),
				userName,
				deviceId,
				startTime,
				endTime,
			}).unwrap()
			download(
				blob,
				`ExportFailBetRecordReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
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
		})
	}

	const loading = isIovationDeviceTypeListLoading || isGetIvationReportFetching

	useEffect(() => {
		if (!loading) {
			form.setFieldsValue({
				currencyId: first(currencyListBySite)?.currencyId,
				deviceType: first(iovationDeviceTypeList)?.value,
			})
		}
	}, [loading])

	useEffect(() => {
		const init = () => {
			const {
				currencyId,
				deviceId,
				deviceType,
				userName,
				startTime,
				endTime,
				pageNumber,
				pageSize,
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			form.setFieldsValue({
				dateRange: [moment(startTime), moment(endTime)],
				currencyId: Number(currencyId),
				deviceType: Number(deviceType),
				userName,
				deviceId,
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
			})
		}

		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<IovationFilter
				form={form}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				iovationDeviceTypeList={iovationDeviceTypeList}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<IovationTable
					loading={loading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					IovationReportList={IovationReportList}
					onTableChange={handleTableChange}
					// onAccountClick={handleShieldIpAccountClick}
				/>
			)}

			<IovationAssociateAccountModal />

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					loading={isExportIovationReportLoading}
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default Iovation

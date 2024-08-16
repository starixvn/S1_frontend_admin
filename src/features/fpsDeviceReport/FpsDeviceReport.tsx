import dayjs from 'dayjs'
import download from 'downloadjs'
import { useEffect } from 'react'
import { isEmpty } from 'lodash'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { selectCurrencyIdsBySiteIds, selectUserSiteList } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
	useModal,
} from 'common/hooks'
import {
	useLazyGetFpsReportQuery,
	useLazyGetFpsAssociateAccountQuery,
	useExportFpsReportMutation,
	useLazyGetFpsAssociateDevicesQuery,
} from 'features/fpsDeviceReport/api'
import { IFilterForm } from 'features/fpsDeviceReport/type'
import FpsDeviceReportFilter from 'features/fpsDeviceReport/FpsDeviceReportFilter'
import FpsDeviceReportTable from 'features/fpsDeviceReport/FpsDeviceReportTable'
import FpsAssociateAccountModal from 'features/fpsDeviceReport/FpsAssociateAccountModal'
import FpsAssociateDevicesModal from 'features/fpsDeviceReport/FpsAssociateDevicesModal'

const FpsDeviceReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const userSiteList = useAppSelector(selectUserSiteList)
	const [filterForm] = Form.useForm<IFilterForm>()
	const userIdModal = useModal()
	const userDevicesModal = useModal()

	const watchSiteIds = Form.useWatch('siteIds', filterForm)
	const currencyIdsBySiteIds = useAppSelector(state =>
		selectCurrencyIdsBySiteIds(state, watchSiteIds || [])
	)

	const [
		getFpsAssociateAccount,
		{
			data: { data: fpsAssociateAccountList = [] } = {},
			isFetching: isGetFpsAssociateAccountFetching,
		},
	] = useLazyGetFpsAssociateAccountQuery()

	const [
		getFpsAssociateDevices,
		{
			data: { data: fpsAssociateDevicesList = [] } = {},
			isFetching: isGetFpsAssociateDevicesFetching,
		},
	] = useLazyGetFpsAssociateDevicesQuery()

	const {
		data: { data: fpsDeviceTypeList = [] } = {},
		isLoading: isFpsDeviceTypeLoading,
	} = useGetEnumTypeQuery({ enumName: 'FpsDeviceType' })

	const [
		getFpsReport,
		{
			data: { data: fpsReportList = [], rowCount: paginationTotal = 0 } = {},
			isFetching: isGetFpsReportFetching,
		},
	] = useLazyGetFpsReportQuery()

	const [exportFpsReport, { isLoading: isExportFpsReportLoading }] =
		useExportFpsReportMutation()

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
		const { dateRange, ...args } = await filterForm.validateFields()

		const [startTime, endTime] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		try {
			await getFpsReport({
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
		const {
			startTime,
			endTime,
			siteIds = [],
			currencyIds = [],
			deviceId,
			deviceType = 0,
			userName,
		} = queryParams

		try {
			const blob = await exportFpsReport({
				siteIds: siteIds.map((querySiteId: string) => Number(querySiteId)),
				currencyIds: currencyIds.map((queryCurrency: string) =>
					Number(queryCurrency)
				),
				deviceType: Number(deviceType),
				userName,
				deviceId,
				startTime,
				endTime,
			}).unwrap()
			download(blob, `ExportFpsReport_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`)
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

	//  顯示 ip 關聯帳戶彈窗
	const handleUserIdAccountClick = async (deviceId: string) => {
		userIdModal.onOpen()
		try {
			await getFpsAssociateAccount({ deviceId }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	//  顯示 ip 關聯裝置彈窗
	const handleUserDevicesAccountClick = async (custId: number) => {
		userDevicesModal.onOpen()
		try {
			await getFpsAssociateDevices({ custId }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading =
		isFpsDeviceTypeLoading ||
		isGetFpsReportFetching ||
		isGetFpsAssociateAccountFetching ||
		isGetFpsAssociateDevicesFetching

	useEffect(() => {
		const init = () => {
			const {
				currencyIds = [],
				siteIds = [],
				deviceId,
				deviceType = 0,
				userName,
				startTime,
				endTime,
				pageNumber,
				pageSize,
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [dayjs(startTime), dayjs(endTime)],
				siteIds: siteIds.map((querySiteId: string) => Number(querySiteId)),
				currencyIds: currencyIds.map((queryCurrency: string) =>
					Number(queryCurrency)
				),
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
			<FpsDeviceReportFilter
				form={filterForm}
				loading={loading}
				userSiteList={userSiteList}
				currencyIdsBySiteIds={currencyIdsBySiteIds}
				timeZoneUtcOffset={timeZoneUtcOffset}
				fpsDeviceTypeList={fpsDeviceTypeList}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<FpsDeviceReportTable
					loading={loading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					fpsReportList={fpsReportList}
					onTableChange={handleTableChange}
					onAssociateAccountClick={handleUserIdAccountClick}
					onAssociateDevicesClick={handleUserDevicesAccountClick}
				/>
			)}

			{/* AssociateDevices */}
			<FpsAssociateDevicesModal
				loading={loading}
				deviceList={fpsAssociateDevicesList}
				visible={userDevicesModal.visible}
				onCancel={userDevicesModal.onCancel}
			/>

			{/* AssociateAccount */}
			<FpsAssociateAccountModal
				loading={loading}
				userList={fpsAssociateAccountList}
				visible={userIdModal.visible}
				onCancel={userIdModal.onCancel}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					loading={isExportFpsReportLoading}
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default FpsDeviceReport

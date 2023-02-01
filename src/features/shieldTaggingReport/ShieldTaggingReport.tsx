import { Form, message, TablePaginationConfig } from 'antd'
import ShieldTaggingReportFilter from 'features/shieldTaggingReport/ShieldTaggingReportFilter'
import ShieldTaggingReportTable from 'features/shieldTaggingReport/ShieldTaggingReportTable'
import { LayoutContent } from 'app/pages/layout'
import { selectUserSite } from 'common/enum'
import { useGetEnumTypeQuery } from 'common/service/enumApi'

import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
	useModal,
} from 'common/hooks'
import { useAppSelector } from 'app/store'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimeZone } from 'components/TimeZoneSelect'
import { dateRangeToUtcFormatter } from 'common/utils'
import { AffixButtons } from 'components/AffixButtons'
import {
	useGetShieldTaggingReportExportMutation,
	useLazyGetShieldTaggingReportQuery,
	useLazyGetShieldTaggingAssociateAccountReportQuery,
} from 'features/shieldTaggingReport/api'

import {
	IFilterForm,
	IShieldTaggingReportResponse,
} from 'features/shieldTaggingReport/type'
import download from 'downloadjs'
import moment from 'moment'
import { isEmpty } from 'lodash'
import ShieldTaggingAssociateAccountModal from 'features/shieldTaggingReport/ShieldTaggingAssociateAccountModal'

const ShieldTaggingReport = ({ pageTitle }: { pageTitle?: string }) => {
	const [filterForm] = Form.useForm<IFilterForm>()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { t } = useTranslation()
	const [queryParams, setQueryParams] = useQueryParams()
	const shieldIdListModal = useModal()

	const {
		data: { data: shieldPlatformList = [] } = {},
		isLoading: isShieldPlatformLoading,
	} = useGetEnumTypeQuery({ enumName: 'ShieldPlatform' })

	const {
		data: { data: triggeredPointsList = [] } = {},
		isLoading: isTriggerPointLoading,
	} = useGetEnumTypeQuery({ enumName: 'TriggeredPoints' })

	const {
		data: { data: shieldRiskList = [] } = {},
		isLoading: isShieldRiskLoading,
	} = useGetEnumTypeQuery({ enumName: 'ShieldRiskTagged' })

	const {
		data: { data: taggedIssueList = [] } = {},
		isLoading: isTaggingIssueLoading,
	} = useGetEnumTypeQuery({ enumName: 'TaggedIssue' })

	const [
		getShieldTaggingAssociateAccount,
		{
			data: { data: shieldTaggingAssociateAccountList = [] } = {},
			isFetching: isGetShieldTaggingAssociateAccountLoading,
		},
	] = useLazyGetShieldTaggingAssociateAccountReportQuery()

	const [
		getShieldTaggingReport,
		{
			data: {
				data: shieldTaggingReportList,
				rowCount: shieldTaggingReportTotal = 0,
			} = {} as IShieldTaggingReportResponse,
			isFetching: isGetShieldTaggingReportFetching,
		},
	] = useLazyGetShieldTaggingReportQuery()

	const [
		exportShieldTaggingReport,
		{ isLoading: isExportShieldTaggingReport },
	] = useGetShieldTaggingReportExportMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: shieldTaggingReportTotal,
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
		const { dateRange, platform, triggeredPoints, tags, userName, shieldId } =
			filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)
		const args = {
			siteId,
			startDate,
			endDate,
			platform,
			triggeredPoints,
			tags,
			userName,
			shieldId,
			pageNumber: current,
			pageSize,
		}
		try {
			await getShieldTaggingReport(args).unwrap()
			setQueryParams({ timeZone: currentTimeZoneUtcOffset, ...args })
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
		})
	}

	const handleExport = async () => {
		if (!siteId) return
		const {
			startDate,
			endDate,
			platform,
			triggeredPoints,
			tags,
			userName,
			shieldId,
		} = queryParams
		try {
			const blob = await exportShieldTaggingReport({
				siteId,
				startDate,
				endDate,
				platform: platform?.map((value: string) => Number(value)),
				triggeredPoints: triggeredPoints?.map((value: string) => Number(value)),
				tags: tags?.map((value: string) => Number(value)),
				userName,
				shieldId,
			}).unwrap()
			download(
				blob,
				`ExportShieldTaggingReport_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	//  顯示 ip 關聯帳號彈窗
	const handleShieldIpAccountClick = async (shieldId: string) => {
		shieldIdListModal.onOpen()
		try {
			await getShieldTaggingAssociateAccount({ shieldId }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading =
		isShieldPlatformLoading ||
		isShieldRiskLoading ||
		isTriggerPointLoading ||
		isGetShieldTaggingReportFetching ||
		isTaggingIssueLoading ||
		isGetShieldTaggingAssociateAccountLoading

	const filterLoading =
		isShieldPlatformLoading ||
		isShieldRiskLoading ||
		isTriggerPointLoading ||
		isGetShieldTaggingReportFetching

	useEffect(() => {
		if (!filterLoading) {
			filterForm.setFieldsValue({
				platform: shieldPlatformList.map(({ value }) => value),
				triggeredPoints: triggeredPointsList.map(({ value }) => value),
				tags: shieldRiskList.map(({ value }) => value),
			})
		}
	}, [filterLoading])

	useEffect(() => {
		const init = () => {
			const {
				startDate,
				endDate,
				platform,
				triggeredPoints,
				tags,
				userName,
				shieldId,
				pageNumber,
				pageSize,
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				platform: platform
					? platform?.map((value: string) => Number(value))
					: shieldPlatformList?.map(({ value }) => value),
				triggeredPoints: triggeredPoints
					? triggeredPoints?.map((value: string) => Number(value))
					: triggeredPointsList?.map(({ value }) => value),
				tags: tags
					? tags?.map((value: string) => Number(value))
					: shieldRiskList?.map(({ value }) => value),
				userName,
				shieldId,
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
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
			<ShieldTaggingReportFilter
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				form={filterForm}
				shieldPlatformList={shieldPlatformList}
				shieldRiskList={shieldRiskList}
				triggeredPointsList={triggeredPointsList}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<ShieldTaggingReportTable
					loading={loading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					taggedIssueList={taggedIssueList}
					triggeredPointsList={triggeredPointsList}
					shieldTaggingReportList={shieldTaggingReportList}
					onTableChange={handleTableChange}
					onAccountClick={handleShieldIpAccountClick}
				/>
			)}

			{/* AssociateAccount */}
			<ShieldTaggingAssociateAccountModal
				loading={loading}
				userList={shieldTaggingAssociateAccountList}
				visible={shieldIdListModal.visible}
				onCancel={shieldIdListModal.onCancel}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					loading={isExportShieldTaggingReport}
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default ShieldTaggingReport

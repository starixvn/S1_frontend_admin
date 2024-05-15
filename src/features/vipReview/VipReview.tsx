import { Form, message, TablePaginationConfig } from 'antd'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import download from 'downloadjs'
import { LayoutContent } from 'app/pages/layout'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { RcFile, UploadFile } from 'antd/es/upload/interface'
import { ActionStatusEnum, VipTypeEnum } from 'features/vipReview/constants'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import VipReviewTable from 'features/vipReview/VipReviewTable'
import VipReviewFilter from 'features/vipReview/VipReviewFilter'
import VipLevelAssignBatchModal from 'features/vipReview/modal/VipLevelAssignBatchModal'
import {
	useChangeVipLevelBatchMutation,
	useExportDowngradeListMutation,
	useExportUpgradeListMutation,
	useLazyGetDowngradeListQuery,
	useLazyGetUpgradeListQuery,
	useUpdateDowngradeMutation,
	useUpdateUpgradeMutation,
} from 'features/vipReview/api'
import {
	IVipLevelData,
	IDowngradeData,
	IDowngradeListResponse,
	IFilterForm,
	IUpgradeData,
	IUpgradeListResponse,
} from 'features/vipReview/type'
import { useTranslation } from 'react-i18next'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useEffect, useState } from 'react'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { withOutSiteIdParams } from 'common/utils'

const VipReview = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const {
		actionPermissions: {
			editPermission,
			exportExcelPermission,
			appeovedPermission,
		} = {},
	} = useAuth()
	const vipLevelAssignBatchModal = useModal()
	const [uploadSuccess, setUploadSuccess] = useState(false)
	const [selectDate, setSelectDate] = useState(null)
	const [batchLog, setBatchLog] = useState<IVipLevelData[]>([])
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [filterForm] = Form.useForm<IFilterForm>()
	const type = Form.useWatch('type', filterForm)
	const { date: filterDateRange1, dateRange: filterDateRange2 } =
		filterForm.getFieldsValue()
	const {
		data: { data: vipStatusList } = {} as IEnumTypeResponse,
		isFetching: isGetVipStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'VipStatus' })
	const [
		getUpgradeList,
		{
			data: {
				data: upgradeList = [],
				rowCount: upgradeListTotal = 0,
			} = {} as IUpgradeListResponse,
			isFetching: isGetUpgradeListLoading,
		},
	] = useLazyGetUpgradeListQuery()

	const [
		getDowngradeList,
		{
			data: {
				data: downgradeList = [],
				rowCount: downgradeListTotal = 0,
			} = {} as IDowngradeListResponse,
			isFetching: isGetDowngradeList,
		},
	] = useLazyGetDowngradeListQuery()

	const [exportUpgradeList, { isLoading: exportUpgradeListLoading }] =
		useExportUpgradeListMutation()

	const [exportDowngradeList, { isLoading: exportDowngradeListLoading }] =
		useExportDowngradeListMutation()

	const [updateUpgrade, { isLoading: updateUpgradeLoading }] =
		useUpdateUpgradeMutation()

	const [updateDowngrade, { isLoading: updateDowngradeLoading }] =
		useUpdateDowngradeMutation()

	const [changeVipLevelBatch, { isLoading: changeVipLevelBatchLoading }] =
		useChangeVipLevelBatchMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal:
			type === VipTypeEnum.Upgrade ? upgradeListTotal : downgradeListTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
		queryDate = undefined,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
		queryDate?: [dayjs.Dayjs, dayjs.Dayjs] | dayjs.Dayjs
	}) => {
		if (!siteId) return
		const {
			date,
			dateRange,
			status,
			userName,
			currencyIds,
			type: formType,
		} = filterForm.getFieldsValue()
		let calculateYearMonth = ''
		if (formType === VipTypeEnum.Upgrade) {
			calculateYearMonth = dayjs(date ?? queryDate)
				.utcOffset(timeZoneUtcOffset)
				.format('YYYYMM')
		}
		if (formType === VipTypeEnum.Downgrade) {
			calculateYearMonth =
				dayjs(dateRange[0]).utcOffset(timeZoneUtcOffset).format('YYYYMM') +
				dayjs(dateRange[1]).utcOffset(timeZoneUtcOffset).format('YYYYMM')
		}
		try {
			const args = {
				siteId,
				calculateYearMonth,
				status,
				userName,
				currencyId: currencyIds,
				pageNumber: current,
				pageSize,
			}
			if (formType === VipTypeEnum.Upgrade) {
				await getUpgradeList(args).unwrap()
			}
			if (formType === VipTypeEnum.Downgrade) {
				await getDowngradeList(args).unwrap()
			}
			setQueryParams({
				...args,
				currencyIds,
				type: formType,
				timeZone: currentTimeZoneUtcOffset,
			})
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
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleVipLevelAssignBatchFinished = async (file: UploadFile[]) => {
		if (!siteId || file.length === 0) return
		const formData = new FormData()
		formData.append('SiteId', siteId.toString())
		formData.append('ExcelUpload', file[0] as RcFile)
		try {
			const vipLevelBatchList = await changeVipLevelBatch(formData).unwrap()
			setBatchLog(vipLevelBatchList)
			let isOk = true
			vipLevelBatchList.forEach(({ errorCode }) => {
				if (errorCode !== 0) {
					isOk = false
				}
			})
			if (isOk) {
				setUploadSuccess(true)
				message.success(t('System.Label_Success'))
			} else {
				setUploadSuccess(false)
				message.error(t('System.Label_Failed'))
			}
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		if (!siteId) return
		const {
			type: queryType,
			status: statuses,
			userName,
			calculateYearMonth,
			currencyIds,
		} = queryParams

		try {
			if (Number(queryType) === VipTypeEnum.Upgrade) {
				const upgradeArgs = {
					siteId,
					yearMonth: calculateYearMonth,
					status: statuses.map((status: string) => Number(status)),
					userName,
					currencyId: currencyIds.map((currency: string) => Number(currency)),
				}
				const blob = await exportUpgradeList(upgradeArgs).unwrap()
				download(
					blob,
					`ExportVipReviewUpgrade_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
				)
			}
			if (Number(queryType) === VipTypeEnum.Downgrade) {
				const downgradeArgs = {
					siteId,
					calculateYearMonth,
					status: statuses.map((status: string) => Number(status)),
					userName,
					currencyId: currencyIds.map((currency: string) => Number(currency)),
				}
				const blob = await exportDowngradeList(downgradeArgs).unwrap()
				download(
					blob,
					`ExportVipReviewDowngrade_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
				)
			}
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleUpdateStatus = async (record: IUpgradeData | IDowngradeData) => {
		const { type: queryType, calculateYearMonth } = queryParams
		const { custId, status } = record
		if (!siteId) return
		// 預設給0
		let newStatus: number = 0
		if (status === ActionStatusEnum.Pending) {
			newStatus = ActionStatusEnum.Approved
		}
		if (status === ActionStatusEnum.Approved) {
			newStatus = ActionStatusEnum.Pending
		}
		const args = {
			custIdList: [custId],
			calculateYearMonth,
			siteId,
			newStatus,
		}

		try {
			if (Number(queryType) === VipTypeEnum.Upgrade) {
				await updateUpgrade(args).unwrap()
			}
			if (Number(queryType) === VipTypeEnum.Downgrade) {
				await updateDowngrade(args).unwrap()
			}
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const resetQueryParams = () => {
		if (!isEmpty(withOutSiteIdParams(queryParams))) {
			setQueryParams({})
		}
	}

	const loading =
		isGetUpgradeListLoading ||
		isGetDowngradeList ||
		exportUpgradeListLoading ||
		exportDowngradeListLoading ||
		updateUpgradeLoading ||
		updateDowngradeLoading ||
		isGetVipStatusListLoading

	useEffect(() => {
		const init = () => {
			if (isEmpty(withOutSiteIdParams(queryParams))) {
				filterForm.setFieldsValue({
					status: vipStatusList?.map(({ value }) => value),
					date: dayjs().subtract(1, 'month').endOf('month'),
				})
			} else {
				const {
					type: queryType,
					calculateYearMonth = '',
					currencyIds = [],
					status: statuses = [],
					userName,
					timeZone,
					pageNumber,
					pageSize,
				} = queryParams
				onTimeZoneChange(Number(timeZone))
				filterForm.setFieldsValue({
					[Number(queryType) === VipTypeEnum.Upgrade ? 'date' : 'dateRange']:
						Number(queryType) === VipTypeEnum.Upgrade
							? dayjs(calculateYearMonth)
							: [
									dayjs(calculateYearMonth.slice(0, 6)),
									dayjs(calculateYearMonth.slice(-6)),
							  ],

					currencyIds: currencyIds.map((currency: string) => Number(currency)),
					type: Number(queryType),
					status: statuses.map((status: string) => Number(status)),
					userName,
				})
				handleSearch({
					current: Number(pageNumber),
					pageSize: Number(pageSize),
					currentTimeZoneUtcOffset: timeZoneUtcOffset,
					queryDate:
						Number(queryType) === VipTypeEnum.Upgrade
							? dayjs(calculateYearMonth)
							: [
									dayjs(calculateYearMonth.slice(0, 6)),
									dayjs(calculateYearMonth.slice(-6)),
							  ],
				})
			}
		}
		init()
	}, [isGetVipStatusListLoading])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<VipReviewFilter
				form={filterForm}
				loading={loading}
				type={type}
				currencyListBySite={currencyListBySite}
				vipStatusList={vipStatusList}
				timeZoneUtcOffset={timeZoneUtcOffset}
				selectDate={selectDate}
				setSelectDate={setSelectDate}
				resetQueryParams={resetQueryParams}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>
			{!isEmpty(withOutSiteIdParams(queryParams)) &&
				(filterDateRange1 || filterDateRange2) && (
					<VipReviewTable
						loading={loading}
						vipReviewList={
							type === VipTypeEnum.Upgrade ? upgradeList : downgradeList
						}
						vipStatusList={vipStatusList}
						timeZoneUtcOffset={timeZoneUtcOffset}
						pagination={pagination}
						editPermission={editPermission}
						type={type}
						onTableChange={handleTableChange}
						onEditClick={handleUpdateStatus}
					/>
				)}
			<VipLevelAssignBatchModal
				loading={changeVipLevelBatchLoading}
				success={uploadSuccess}
				visible={vipLevelAssignBatchModal.visible}
				batchLog={batchLog}
				uploadSuccess={uploadSuccess}
				onFinish={handleVipLevelAssignBatchFinished}
				onCancel={() => {
					vipLevelAssignBatchModal.onCancel()
					setUploadSuccess(false)
					setBatchLog([])
				}}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
					loading={exportUpgradeListLoading || exportDowngradeListLoading}
				/>
				<AffixButtons.AddBatch
					onClick={vipLevelAssignBatchModal.onOpen}
					disabled={!appeovedPermission?.canUse}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default VipReview

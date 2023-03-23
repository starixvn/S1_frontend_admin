import { isEmpty } from 'lodash'
import moment from 'moment/moment'
import download from 'downloadjs'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { dateRangeToUtcFormatter } from 'common/utils'
import { AffixButtons } from 'components/AffixButtons'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { selectUserSite, selectCurrencyListBySite } from 'common/enum'
import {
	PAGINATION,
	useModal,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { TablePaginationConfig, Form, message } from 'antd'
import { RcFile, UploadFile } from 'antd/es/upload/interface'
import {
	useLazyGetLeaderboardExtraPointQuery,
	useExportLeaderboardExtraPointMutation,
	useAddLeaderboardExtraPointMutation,
} from 'features/leaderboardExtraPoint/api'
import { IFilterForm } from 'features/leaderboardExtraPoint/type'
import LeaderboardExtraPointFilter from 'features/leaderboardExtraPoint/LeaderboardExtraPointFilter'
import LeaderboardExtraPointTable from 'features/leaderboardExtraPoint/LeaderboardExtraPointTable'
import LeaderboardExtraPointBatchModal from 'features/leaderboardExtraPoint/LeaderboardExtraPointBatchModal'

const LeaderboardExtraPoint = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { addPermission, exportExcelPermission } = {} } =
		useAuth()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [filterForm] = Form.useForm<IFilterForm>()
	const [addForm] = Form.useForm()
	const leaderboardExtraPointBatchModal = useModal()

	const [
		getLeaderboardExtraPoint,
		{
			data: {
				data: leaderboardExtraPointList = [],
				rowCount: leaderboardTotal = 0,
			} = {},
			isFetching: isGetLeaderboardExtraPointFetching,
		},
	] = useLazyGetLeaderboardExtraPointQuery()

	const {
		data: { data: LeaderBoardCategoryList = [] } = {},
		isLoading: isGetLeaderBoardCategoryLoading,
	} = useGetEnumTypeQuery({
		enumName: 'LeaderBoardCategoryEnum',
	})

	const [pagination, setPagination] = usePagination({
		paginationTotal: leaderboardTotal,
	})

	const [
		exportLeaderboardExtraPoint,
		{ isLoading: isExportLeaderboardExtraPointLoading },
	] = useExportLeaderboardExtraPointMutation()

	const [
		addLeaderboardExtraPoint,
		{ isLoading: isAddLeaderboardExtraPointLoading },
	] = useAddLeaderboardExtraPointMutation()

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
		const { dateRange, currencyIds, categoryIds } =
			await filterForm.validateFields()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)

		try {
			await getLeaderboardExtraPoint({
				siteId,
				currencyIds,
				categoryIds,
				startDate,
				endDate,
				pageSize,
				pageNumber: current,
			}).unwrap()
			setQueryParams({
				startDate,
				endDate,
				currencyIds,
				categoryIds,
				timeZone: timeZoneUtcOffset,
				pageNumber: current,
				pageSize,
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

	const handleExport = async () => {
		if (!siteId) return
		const { startDate, endDate, currencyIds, categoryIds } = queryParams

		const args = {
			siteId,
			startDate,
			endDate,
			currencyIds: currencyIds.map((currency: string) => Number(currency)),
			categoryIds: categoryIds.map((category: string) => Number(category)),
		}

		try {
			const blob = await exportLeaderboardExtraPoint(args).unwrap()
			download(
				blob,
				`LeaderboardExtraPoint_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleAddLeaderboardExtraPoint = async (fileList: UploadFile[]) => {
		if (!siteId) return

		// 因為 fileList 沒有渲染在畫面上 所以用 message.error show error
		if (isEmpty(fileList)) {
			message.error(t('Label_Required', { key: t('Label_File') }))
		} else {
			const formData = new FormData()
			formData.append('siteId', siteId.toString())
			formData.append('excelUpload', fileList[0] as RcFile)
			try {
				await addLeaderboardExtraPoint(formData).unwrap()
				leaderboardExtraPointBatchModal.onCancel()
				message.success(t('System.Label_Success'))
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	const loading =
		isGetLeaderboardExtraPointFetching || isGetLeaderBoardCategoryLoading

	useEffect(() => {
		const init = () => {
			const {
				startDate,
				endDate,
				currencyIds = [],
				categoryIds = [],
				timeZone,
				pageNumber,
				pageSize,
			} = queryParams
			onTimeZoneChange(Number(timeZone))

			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				currencyIds: currencyIds.map((currency: string) => Number(currency)),
				categoryIds: categoryIds.map((category: string) => Number(category)),
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: timeZoneUtcOffset,
			})
		}

		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<LeaderboardExtraPointFilter
				loading={loading}
				form={filterForm}
				currencyListBySite={currencyListBySite}
				timeZoneUtcOffset={timeZoneUtcOffset}
				LeaderBoardCategoryList={LeaderBoardCategoryList}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<LeaderboardExtraPointTable
					loading={loading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					leaderboardExtraPointList={leaderboardExtraPointList}
					onTableChange={handleTableChange}
				/>
			)}

			<LeaderboardExtraPointBatchModal
				loading={isAddLeaderboardExtraPointLoading}
				form={addForm}
				visible={leaderboardExtraPointBatchModal.visible}
				onFinish={handleAddLeaderboardExtraPoint}
				onCancel={() => leaderboardExtraPointBatchModal.onCancel()}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportLeaderboardExtraPointLoading}
				/>
				<AffixButtons.AddBatch
					onClick={leaderboardExtraPointBatchModal.onOpen}
					disabled={!addPermission?.canUse}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default LeaderboardExtraPoint

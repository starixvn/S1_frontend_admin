import { isArray, isEmpty } from 'lodash'
import moment from 'moment'
import { FC, useEffect } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTimeZone } from 'components/TimeZoneSelect'
import { PAGINATION, usePagination, useQueryParams } from 'common/hooks'
import { useAppDispatch, useAppSelector } from 'app/store'
import { dateRangeToUtcFormatter, withOutSiteIdParams } from 'common/utils'
import {
	selectActionTypeList,
	selectAdjustmentInfoLogMenu,
	selectCurrencyListBySite,
	selectUserSite,
} from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import { AdjustmentLogReportFilter } from './AdjustmentLogReportFilter'
import { fetchLogReportListAsync } from './thunk'
import { AdjustmentLogReportTable } from './AdjustmentLogReportTable'
import {
	selectAdjustmentLogReportStatus,
	setAdjustmentLogReportStatus,
} from './slice'

const AdjustmentLogReport: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()

	const dispatch = useAppDispatch()
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm()

	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const adjustmentInfoLogMenu = useAppSelector(selectAdjustmentInfoLogMenu)
	const actionTypeList = useAppSelector(selectActionTypeList)

	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	const adjustmentLogReportStatus = useAppSelector(
		selectAdjustmentLogReportStatus
	)
	const paginationTotal = useAppSelector(
		state => state.adjustmentLogReport.paginationTotal
	)

	const [pagination, setPagination] = usePagination({ paginationTotal })

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { actionTypes, currencyIds, menus, transId, userName, dateRange } =
			form.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		setQueryParams({
			actionTypes,
			currencyIds,
			menus,
			transId,
			userName,
			startDate,
			endDate,
			current,
			pageSize,
			tz: timeZoneUtcOffset,
		})

		try {
			await dispatch(
				fetchLogReportListAsync({
					pageNumber: current,
					pageSize,
					actionTypes,
					currencyIds,
					menus,
					transId,
					userName,
					startDate,
					endDate,
					siteIds: siteId ? [siteId] : [],
				})
			)

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

	const onChangeCurrency = (newCurrencyIds: number[]) => {
		if (newCurrencyIds.includes(0)) {
			form.setFieldsValue({
				currencyIds: currencyListBySite?.map(item => item.currencyId),
			})
		} else {
			form.setFieldsValue({
				currencyIds: newCurrencyIds,
			})
		}
	}

	const onChangeMenus = (newMenus: number[]) => {
		if (newMenus.includes(0)) {
			form.setFieldsValue({
				menus: adjustmentInfoLogMenu?.map(item => item.value),
			})
		} else {
			form.setFieldsValue({
				menus: newMenus,
			})
		}
	}

	const onChangeActionTypes = (newActionTypes: number[]) => {
		if (newActionTypes.includes(0)) {
			form.setFieldsValue({
				actionTypes: actionTypeList?.map(item => item.value),
			})
		} else {
			form.setFieldsValue({
				actionTypes: newActionTypes,
			})
		}
	}

	useEffect(() => {
		const init = async () => {
			if (isEmpty(withOutSiteIdParams(queryParams))) {
				onChangeCurrency([0])
				onChangeMenus([0])
				onChangeActionTypes([0])

				return
			}

			const {
				actionTypes,
				currencyIds,
				menus,
				transId,
				userName,
				startDate,
				endDate,
				current,
				pageSize,
				tz,
			} = queryParams

			onTimeZoneChange(Number(tz))

			form.setFieldsValue({
				actionTypes: isArray(actionTypes)
					? actionTypes.map((actionType: string) => Number(actionType))
					: [],
				currencyIds: isArray(currencyIds)
					? currencyIds.map((currencyId: string) => Number(currencyId))
					: [],
				menus: isArray(menus)
					? menus.map((currencyId: string) => Number(currencyId))
					: [],
				transId,
				userName,
				dateRange: [moment(startDate), moment(endDate)],
			})

			handleSearch({
				current: Number(current),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(tz),
			})
		}

		init()
	}, [])

	useEffect(() => {
		return () => {
			dispatch(setAdjustmentLogReportStatus('idle'))
		}
	}, [])

	const loading = adjustmentLogReportStatus === 'pending'

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<AdjustmentLogReportFilter
				form={form}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
				onChangeCurrency={onChangeCurrency}
				onChangeMenus={onChangeMenus}
				onChangeActionTypes={onChangeActionTypes}
			/>

			{adjustmentLogReportStatus !== 'idle' && (
				<AdjustmentLogReportTable
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default AdjustmentLogReport

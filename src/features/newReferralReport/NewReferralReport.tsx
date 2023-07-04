import { isEmpty } from 'lodash'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useTimeZone } from 'components/TimeZoneSelect'
import { dateRangeToUtcFormatter } from 'common/utils'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { PAGINATION, usePagination, useQueryParams } from 'common/hooks'
import { Form, message, TablePaginationConfig } from 'antd'
import { useLazyGetDepositReferralReportListQuery } from 'features/newReferralReport/api'
import {
	IDepositReferralReportResponse,
	IFilterForm,
} from 'features/newReferralReport/type'
import NewReferralReportTable from 'features/newReferralReport/NewReferralReportTable'
import NewReferralReportFilter from 'features/newReferralReport/NewReferralReportFilter'

const NewReferralReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [filterForm] = Form.useForm<IFilterForm>()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [range, setRange] = useState({ startDate: '', endDate: '' })

	const [
		getDepositReferralReportList,
		{
			data: {
				data: depositReferralReportList,
				rowCount: depositReferralReportTotal = 0,
			} = {} as IDepositReferralReportResponse,
			isFetching: isDepositReferralReportListFetching,
		},
	] = useLazyGetDepositReferralReportListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: depositReferralReportTotal,
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
		const { currencyIds, dateRange, userName } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		setRange({ startDate, endDate })
		const args = {
			siteId,
			currencyIds,
			userName,
			startDate,
			endDate,
			pageNumber: current,
			pageSize,
		}

		try {
			await getDepositReferralReportList(args).unwrap()
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

	useEffect(() => {
		const init = () => {
			const {
				currencyIds = [],
				userName,
				startDate,
				endDate,
				pageNumber,
				pageSize,
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				currencyIds: currencyIds.map((currency: string) => Number(currency)),
				userName,
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

			<NewReferralReportFilter
				form={filterForm}
				loading={isDepositReferralReportListFetching}
				currencyListBySite={currencyListBySite}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>

			{!isEmpty(queryParams) && (
				<NewReferralReportTable
					loading={isDepositReferralReportListFetching}
					pagination={pagination}
					dateRange={range}
					depositReferralReportList={depositReferralReportList}
					onTableChange={handleTableChange}
				/>
			)}
		</LayoutContent.Main>
	)
}

export default NewReferralReport

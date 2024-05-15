import { useEffect } from 'react'
import { Form, message, PageHeader, TablePaginationConfig } from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { dateRangeToUtcFormatter } from 'common/utils'
import { PAGINATION, usePagination } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { useTimeZone } from 'components/TimeZoneSelect'
import { IForm, IOtpReportResponse } from './type'
import { useLazyGetOTPReportQuery } from './api'
import OtpVerificationReportFilter from './OtpVerificationReportFilter'
import OtpVerificationReportTable from './OtpVerificationReportTable'

const OtpVerificationReport = ({ pageTitle = '' }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [form] = Form.useForm<IForm>()

	const {
		data: { data: otpProviderEnum = [] } = {},
		isFetching: isGetOTPProviderEnumFetching,
	} = useGetEnumTypeQuery({
		enumName: 'OTPProvider',
	})

	const {
		data: { data: otpStatusEnum = [] } = {},
		isFetching: isGetOTPStatusEnumFetching,
	} = useGetEnumTypeQuery({
		enumName: 'OTPStatus',
	})

	const [
		getOTPReport,
		{
			data: {
				data: otpReport = [],
				rowCount: otpReportTotal = 0,
			} = {} as IOtpReportResponse,
			isFetching: isGetMemberListLoading,
		},
	] = useLazyGetOTPReportQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: otpReportTotal,
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
		const { dateRange, currencyIds, ...values } = await form.validateFields()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		try {
			await getOTPReport({
				...values,
				currencyList: currencyIds,
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
			}).unwrap()
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

	const isEnumLoading =
		isGetOTPProviderEnumFetching || isGetOTPStatusEnumFetching

	useEffect(() => {
		if (!isEnumLoading) {
			form.setFieldsValue({
				otpProvider: otpProviderEnum[0]?.value,
				otpStatus: otpStatusEnum[0]?.value,
			})
			handleSearch({})
		}
	}, [isEnumLoading])

	return (
		<LayoutContent.Main>
			<PageHeader title={pageTitle} />
			<OtpVerificationReportFilter
				enumLoading={isEnumLoading}
				loading={isGetMemberListLoading}
				form={form}
				currencyListBySite={currencyListBySite}
				otpProviderEnum={otpProviderEnum}
				otpStatusEnum={otpStatusEnum}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			<OtpVerificationReportTable
				otpReport={otpReport}
				loading={isGetMemberListLoading}
				pagination={pagination}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTableChange={handleTableChange}
			/>
		</LayoutContent.Main>
	)
}

export default OtpVerificationReport

import dayjs from 'dayjs'
import download from 'downloadjs'
import { useEffect, useState } from 'react'
import { isArray, isEmpty, reject } from 'lodash'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	useExportPaymentAdjustmentReportMutation,
	useLazyGetPaymentAdjustmentReportQuery,
	useSetPaymentAdjustmentMutation,
} from 'features/paymentAdjustment/api'
import { Form, message, TablePaginationConfig } from 'antd'
import { PaymentAdjustmentFilter } from 'features/paymentAdjustment/PaymentAdjustmentFilter'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { dateRangeToUtcFormatter } from 'common/utils'
import { AffixButtons } from 'components/AffixButtons'
import { PaymentAdjustmentTable } from 'features/paymentAdjustment/PaymentAdjustmentTable'
import { PaymentAdjustmentOverviewTable } from 'features/paymentAdjustment/PaymentAdjustmentOverviewTable'
import {
	IAdjustmentData,
	IEditForm,
	IFilterForm,
	IGetPaymentAdjustmentReportData,
} from 'features/paymentAdjustment/type'
import { UserTypeEnum } from 'features/memberAdministrationList/constants'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { IGetReasonListResponse } from 'features/balanceAdjustment/balanceAdjustment/type'
import { useGetReasonListQuery } from 'features/balanceAdjustment/balanceAdjustment/api'

const PaymentAdjustment = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [editingTransId, setEditingTransId] = useState<string | undefined>(
		undefined
	)
	const { actionPermissions: { exportExcelPermission, editPermission } = {} } =
		useAuth()
	const [queryParams, setQueryParams] = useQueryParams()

	const [editForm] = Form.useForm<IEditForm>()

	const [filterForm] = Form.useForm<IFilterForm>()

	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()

	const [selectedMethodType, setSelectedMethodType] = useState<number>(0)

	const formAdjustmentType = Form.useWatch('adjustType', editForm)

	const {
		data: { data: reasonList } = {} as IGetReasonListResponse,
		isLoading: isGetReasonListLoading,
	} = useGetReasonListQuery(
		{
			methodTypeID: selectedMethodType,
			adjustmentTypeID: formAdjustmentType,
		},
		{ skip: !formAdjustmentType }
	)
	const {
		data: { data: adjustTypeList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetAdjustTypeListLoading,
	} = useGetEnumTypeQuery({ enumName: 'AdjustTypeEnum' })

	const [
		getPaymentAdjustmentReport,
		{
			data: {
				data: paymentAdjustmentReport = [],
				currencyAmountRecord: currencyAmountData = [],
				rowCount: payMentAdjustmentReportTotal = 0,
			} = {},
			isFetching: isGetPaymentAdjustmentReportLoading,
		},
	] = useLazyGetPaymentAdjustmentReportQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: payMentAdjustmentReportTotal,
	})

	const [setPaymentAdjustment, { isLoading: isSetPaymentAdjustmentLoading }] =
		useSetPaymentAdjustmentMutation()

	const [
		exportPaymentAdjustmentReport,
		{ isLoading: isExportPaymentAdjustmentReportLoading },
	] = useExportPaymentAdjustmentReportMutation()

	const {
		data: { data: memberTypeEnums = [] } = {},
		isLoading: isMemberTypeEnumsLoading,
	} = useGetEnumTypeQuery({
		enumName: 'MemberTypeEnum',
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
		const {
			dateRange,
			userName,
			sabaId,
			transId,
			depositId,
			memberTypes,
			...restValue
		} = filterForm.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)
		try {
			await getPaymentAdjustmentReport({
				startDate,
				endDate,
				userName: userName || null,
				sabaId: sabaId || null,
				transId: transId || null,
				depositId: depositId || null,
				memberTypes,
				pageNumber: current,
				pageSize,
				...restValue,
			}).unwrap()
			setQueryParams({
				startDate,
				endDate,
				userName,
				sabaId,
				transId,
				depositId,
				memberTypes,
				pageNumber: current,
				pageSize,
				timeZone: currentTimeZoneUtcOffset,
				...restValue,
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
		setEditingTransId(undefined)
		await handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleSaved = async (before: IGetPaymentAdjustmentReportData) => {
		const {
			memo: afterMemo = '',
			adjustCategory: afterCategory,
			adjustType: afterAdjustType,
		} = await editForm.getFieldsValue()
		const { memo, adjustCategory, transId, currencyId, siteId, adjustType } =
			before
		const beforeData: IAdjustmentData = {
			category: adjustCategory,
			memo,
			adjustType,
			methodType: selectedMethodType,
		}
		const afterData: IAdjustmentData = {
			category: afterCategory,
			memo: afterMemo,
			adjustType: afterAdjustType,
			methodType: selectedMethodType,
		}
		try {
			await setPaymentAdjustment({
				currencyId,
				siteId,
				transId,
				before: beforeData,
				after: afterData,
				methodType: selectedMethodType,
			}).unwrap()
			message.success(t('System.Label_Success'))
			setEditingTransId(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		const {
			startDate,
			endDate,
			userName,
			sabaId,
			transId,
			depositId,
			adjustTypes,
			currencyIds,
			memberTypes = [],
		} = queryParams

		try {
			const blob = await exportPaymentAdjustmentReport({
				startDate,
				endDate,
				userName: userName || null,
				sabaId: sabaId || null,
				transId: transId || null,
				depositId: depositId || null,
				adjustTypes: adjustTypes?.map((type: string) => Number(type)) ?? [],
				currencyIds:
					currencyIds?.map((currency: string) => Number(currency)) ?? [],
				memberTypes: memberTypes?.map((value: string) => Number(value)) ?? [],
			}).unwrap()
			download(
				blob,
				`PaymentAdjustmentReport_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		// init
		if (!isEmpty(queryParams)) {
			const {
				startDate,
				endDate,
				adjustTypes,
				currencyIds,
				userName = '',
				sabaId = '',
				transId = '',
				depositId = '',
				pageNumber,
				pageSize,
				timeZone,
				memberTypes = [],
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [dayjs(startDate), dayjs(endDate)],
				adjustTypes: adjustTypes?.map((type: string) => Number(type)),
				currencyIds: currencyIds?.map((id: string) => Number(id)),
				userName,
				sabaId,
				transId,
				depositId,
				memberTypes: isArray(memberTypes)
					? memberTypes.map((value: string) => Number(value))
					: [],
			})
			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
	}, [])

	useEffect(() => {
		if (!isGetAdjustTypeListLoading && isEmpty(queryParams)) {
			filterForm.setFieldsValue({
				adjustTypes: adjustTypeList.map(({ value }) => value),
			})
		}
	}, [isGetAdjustTypeListLoading])

	const loading =
		isGetReasonListLoading ||
		isGetPaymentAdjustmentReportLoading ||
		isSetPaymentAdjustmentLoading ||
		isGetAdjustTypeListLoading ||
		isMemberTypeEnumsLoading

	const filterLoading =
		isMemberTypeEnumsLoading || isGetPaymentAdjustmentReportLoading

	useEffect(() => {
		if (!filterLoading) {
			filterForm.setFieldsValue({
				// 預設排除直播主
				memberTypes: reject(memberTypeEnums, [
					'value',
					UserTypeEnum.LiveStreaming,
				]).map(({ value }) => Number(value)),
			})
		}
	}, [isMemberTypeEnumsLoading])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<PaymentAdjustmentFilter
				loading={isGetPaymentAdjustmentReportLoading}
				form={filterForm}
				timeZoneUtcOffset={timeZoneUtcOffset}
				memberTypeEnums={memberTypeEnums}
				adjustTypeList={adjustTypeList}
				onSearch={handleSearch}
				currencyListBySite={currencyListBySite}
				onTimeZoneChange={onTimeZoneChange}
				isEditing={!!editingTransId}
			/>
			{!isEmpty(queryParams) && (
				<PaymentAdjustmentTable
					setSelectedMethodType={setSelectedMethodType}
					loading={loading}
					paymentAdjustmentReport={paymentAdjustmentReport}
					pagination={pagination}
					adjustTypeList={adjustTypeList}
					onTableChange={handleTableChange}
					reasonList={reasonList}
					form={editForm}
					setEditingKey={setEditingTransId}
					editingKey={editingTransId}
					onSaved={handleSaved}
					timeZoneUtcOffset={timeZoneUtcOffset}
					editPermission={editPermission}
				/>
			)}
			{currencyAmountData.length > 0 && (
				<PaymentAdjustmentOverviewTable
					loading={loading}
					currencyAmountData={currencyAmountData}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportPaymentAdjustmentReportLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default PaymentAdjustment

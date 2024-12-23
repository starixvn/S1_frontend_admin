import { isEmpty } from 'lodash'
import React from 'react'
import { Card, Form, message } from 'antd'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useLazyGetPaymentAgentListQuery } from './api'
import PaymentAgentManagementFilter from './PaymentAgentManagementFilter'
import PaymentAgentManagementTable from './PaymentAgentManagementTable'
import { PAGINATION, useQueryParams } from '../../common/hooks'
import { dateRangeToUtcFormatter } from '../../common/utils'
import { useLazyGetPaymentAdjustmentReportQuery } from '../paymentAdjustment/api'
import { useTimeZone } from '../../components/TimeZoneSelect'
import { IFilterForm, IPaymentAgentData, PaymentAgentResponse } from './type'

const PaymentAgentManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [form] = Form.useForm<IFilterForm>()
	const [queryParams, setQueryParams] = useQueryParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()

	const [
		getPaymentAgentList,
		{
			data: { data: paymentAgentList = [] } = {},
			isFetching: isGetPaymentAgentListLoading,
		},
	] = useLazyGetPaymentAgentListQuery()

	const {
		data: { data: paymentAgentTypeEnum = [] } = {},
		isLoading: isPaymentAgentTypeEnumLoading,
	} = useGetEnumTypeQuery({ enumName: 'PaymentAgentTypeEnum' })

	const {
		data: { data: paymentAgentStatusEnum = [] } = {},
		isLoading: isPaymentAgentStatusEnumLoading,
	} = useGetEnumTypeQuery({ enumName: 'PaymentAgentStatusEnum' })

	const handleSearch = async () => {
		const { types, status } = form.getFieldsValue()

		try {
			await getPaymentAgentList({
				types,
				status,
			}).unwrap()
			setQueryParams({
				types,
				status,
			})

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const filterLoading =
		isPaymentAgentTypeEnumLoading ||
		isGetPaymentAgentListLoading ||
		isPaymentAgentStatusEnumLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<PaymentAgentManagementFilter
				loading={filterLoading}
				form={form}
				paymentAgentTypeEnum={paymentAgentTypeEnum}
				paymentAgentStatusEnum={paymentAgentStatusEnum}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<PaymentAgentManagementTable paymentAgentList={paymentAgentList} />
			)}
		</LayoutContent.Main>
	)
}

export default PaymentAgentManagement

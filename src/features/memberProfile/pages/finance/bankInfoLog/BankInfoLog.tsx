import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IGetBankInfoResponse } from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { message, TablePaginationConfig } from 'antd'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useLazyGetBankInfoQuery } from 'features/memberProfile/api'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { PAGINATION, usePagination } from 'common/hooks'
import BankInfoTable from 'features/memberProfile/pages/finance/bankInfoLog/BankInfoTable'

const BankInfoLog = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset } = useTimeZone()

	const [
		getBankInfoLog,
		{
			data: {
				data: bankInfoLogList = [],
				rowCount: custBankInfoLogTotal = 0,
			} = {} as IGetBankInfoResponse,
			isFetching: isGetBankInfoLoading,
		},
	] = useLazyGetBankInfoQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: custBankInfoLogTotal,
	})

	const {
		data: { data: statusList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'CustBankInfoLogStatus' })

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!custId) return
		try {
			await getBankInfoLog({
				pageNumber: current,
				pageSize,
				custId: Number(custId),
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
		})
	}

	useEffect(() => {
		if (custId) {
			handleSearch({})
		}
	}, [custId])

	const loading = isGetBankInfoLoading || isGetStatusListLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Finance.Label_BankInfoLog')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<BankInfoTable
					bankInfoLogList={bankInfoLogList}
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
					statusList={statusList}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default BankInfoLog
